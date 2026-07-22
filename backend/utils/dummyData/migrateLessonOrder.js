/**
 * Migration: Add `order` field to existing Lesson documents
 *
 * الهدف: كل درس مجموعة بكورسه يأخذ رقم ترتيب (0, 1, 2, ...)
 * بناءً على تاريخ إنشائه (createdAt) — أقدم درس يأخذ order: 0
 *
 * التشغيل على البيئة المحلية (يقرأ config.env تلقائياً):
 *   cd backend/utils/dummyData
 *   node migrateLessonOrder.js
 *
 * التشغيل على Production (بدون تغيير config.env):
 *   node migrateLessonOrder.js "mongodb+srv://user:pass@cluster.mongodb.net/dbname"
 *
 * آمن تماماً — لا يحذف بيانات، فقط يضيف/يحدّث حقل order
 */

import { config } from 'dotenv';
import mongoose from 'mongoose';
import Lesson from '../../models/Lesson.js';

// ── تحديد الـ URI: إما من argument أو من config.env ──────────────────────────
const CLI_URI = process.argv[2]; // node migrateLessonOrder.js "mongodb+srv://..."

if (!CLI_URI) {
	// لا يوجد argument → نقرأ من config.env (البيئة المحلية)
	config({ path: '../../config.env' });
}

const DB_URI = CLI_URI || process.env.DB_URI;

if (!DB_URI) {
	console.error('❌ لم يتم العثور على DB_URI!');
	console.error('   إما: node migrateLessonOrder.js "mongodb+srv://..."');
	console.error('   أو:  تأكد من وجود DB_URI في config.env');
	process.exit(1);
}

async function migrate() {
	console.log('🚀 بدء Migration: إضافة حقل order للدروس...\n');

	const env = CLI_URI ? '🌐 Production (URI من argument)' : '💻 Development (من config.env)';
	console.log(`📡 البيئة: ${env}`);
	console.log(`🔗 URI: ${(DB_URI || '').replace(/:([^@]+)@/, ':****@')}\n`); // إخفاء كلمة المرور

	await mongoose.connect(DB_URI);
	console.log('✅ متصل بقاعدة البيانات\n');

	// ── 1. جلب كل الدروس مرتبة حسب تاريخ الإنشاء
	const lessons = await Lesson.find({}).sort({ createdAt: 1 }).select('_id course order');

	console.log(`📚 إجمالي الدروس الموجودة: ${lessons.length}`);

	// ── 2. تجميع الدروس حسب الكورس
	const courseMap = new Map();
	for (const lesson of lessons) {
		const courseId = lesson.course.toString();
		if (!courseMap.has(courseId)) courseMap.set(courseId, []);
		courseMap.get(courseId).push(lesson);
	}

	console.log(`🎓 إجمالي الكورسات: ${courseMap.size}\n`);

	// ── 3. بناء bulkWrite operations
	const bulkOps = [];
	let alreadyHasOrder = 0;
	let willUpdate = 0;

	for (const [courseId, courseLessons] of courseMap) {
		courseLessons.forEach((lesson, index) => {
			// تخطي الدروس التي لديها order صحيح بالفعل
			if (lesson.order !== undefined && lesson.order !== null && lesson.order === index) {
				alreadyHasOrder++;
				return;
			}

			willUpdate++;
			bulkOps.push({
				updateOne: {
					filter: { _id: lesson._id },
					update: { $set: { order: index } },
				},
			});
		});
	}

	console.log(`✅ دروس لها order صحيح بالفعل: ${alreadyHasOrder}`);
	console.log(`✏️  دروس ستُحدَّث: ${willUpdate}\n`);

	// ── 4. تنفيذ التحديثات دفعةً واحدة
	if (bulkOps.length === 0) {
		console.log('🎉 كل الدروس لديها order صحيح. لا حاجة لأي تحديث!');
	} else {
		const result = await Lesson.bulkWrite(bulkOps, { ordered: false });
		console.log('✅ تم التحديث بنجاح:');
		console.log(`   - modifiedCount: ${result.modifiedCount}`);
		console.log(`   - matchedCount:  ${result.matchedCount}`);
	}

	// ── 5. تحقق سريع من النتيجة (عينة)
	console.log('\n📋 عينة من النتيجة (أول كورسين):');
	let shown = 0;
	for (const [courseId, courseLessons] of courseMap) {
		if (shown >= 2) break;
		const updatedLessons = await Lesson.find({ course: courseId })
			.sort({ order: 1 })
			.select('name order');
		console.log(`\n  🎓 Course ID: ${courseId}`);
		updatedLessons.forEach((l) => {
			console.log(`     [${l.order}] ${l.name}`);
		});
		shown++;
	}

	console.log('\n✅ Migration اكتملت بنجاح!');
	await mongoose.disconnect();
	process.exit(0);
}

migrate().catch((err) => {
	console.error('❌ خطأ في Migration:', err);
	mongoose.disconnect();
	process.exit(1);
});
