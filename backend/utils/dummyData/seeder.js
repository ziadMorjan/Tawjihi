import { readFileSync } from 'fs';
import { fakerAR } from '@faker-js/faker';
import { config } from 'dotenv';
import { connectDB } from '../../config/db.js';
import i18n from '../../config/i18n.js';
import Branch from '../../models/Branch.js';
import Cart from '../../models/Cart.js';
import Comment from '../../models/Comment.js';
import Coupon from '../../models/Coupon.js';
import Course from '../../models/Course.js';
import Enrollment from '../../models/Enrollment.js';
import Lesson from '../../models/Lesson.js';
import New from '../../models/New.js';
import Payment from '../../models/Payment.js';
import Review from '../../models/Review.js';
import Subject from '../../models/Subject.js';
import TeacherReview from '../../models/TeacherReview.js';
import User from '../../models/User.js';

config({ path: '../../config.env' });

const t = (key, options) => i18n.__({ phrase: key, locale: 'en' }, options);

const randomDateWithinYear = () => {
	const now = Date.now();
	const past = now - 365 * 24 * 60 * 60 * 1000;
	return new Date(past + Math.random() * (now - past));
};

const AR_TO_EN = {
	'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'a',
	'ب': 'b', 'ت': 't', 'ث': 'th',
	'ج': 'j', 'ح': 'h', 'خ': 'kh',
	'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
	'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
	'ط': 't', 'ظ': 'z',
	'ع': 'aa', 'غ': 'gh',
	'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l',
	'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
	'ة': 'a', 'ى': 'a', 'ئ': 'e',
	' ': '.',
};

const transliterate = (text) =>
	text
		.split('')
		.map((ch) => AR_TO_EN[ch] || ch)
		.join('')
		.replace(/\.+/g, '.')
		.replace(/^\.|\.$/g, '')
		.toLowerCase();

const deleteData = async () => {
	try {
		await Branch.deleteMany({});
		await Cart.deleteMany({});
		await Comment.deleteMany({});
		await Coupon.deleteMany({});
		await Course.deleteMany({});
		await Enrollment.deleteMany({});
		await Lesson.deleteMany({});
		await New.deleteMany({});
		await Payment.deleteMany({});
		await Review.deleteMany({});
		await Subject.deleteMany({});
		await TeacherReview.deleteMany({});
		await User.deleteMany({});
		console.log(t('seeder.all_data_deleted'));
	} catch (error) {
		console.error(t('seeder.error_deleting_data', { error }));
		process.exit(-1);
	}
};

const seedAdmin = async () => {
	try {
		await User.create({
			name: 'Admin',
			email: 'admin@tawjihi.com',
			description: 'Admin user for the application',
			password: 'admin123',
			phone: fakerAR.helpers.fromRegExp('05[6-7][0-9]{3}[0-9]{4}'),
			role: 'admin',
			coverImage: fakerAR.image.personPortrait(),
		});
		console.log(t('seeder.admin_created'));
	} catch (error) {
		console.error(t('seeder.error_creating_admin', { error }));
		process.exit(-1);
	}
};

const seedUsers = async () => {
	const generateUser = (gender) => {
		const firstName = fakerAR.person.firstName(gender);
		const lastName = fakerAR.person.firstName(gender);
		return {
			name: `${firstName} ${lastName}`,
			email: `${transliterate(firstName)}.${transliterate(lastName)}.${fakerAR.string.alphanumeric(4).toLowerCase()}@gmail.com`,
			password: 12345678,
			Phone: fakerAR.helpers.fromRegExp('05[6-7][0-9]{3}[0-9]{4}'),
			coverImage: fakerAR.image.personPortrait(),
			role: 'user',
			isActive: true,
			createdAt: randomDateWithinYear(),
		};
	};

	const users = [];
	for (let i = 0; i < 50; i += 1) {
		users.push(generateUser(fakerAR.helpers.arrayElement(['male', 'female'])));
	}
	try {
		await User.create(users);
		console.log(t('seeder.users_created'));
	} catch (error) {
		console.error(t('seeder.error_creating_users', { error }));
		process.exit(-1);
	}
};

const seedTeachers = async () => {
	const generateTeacher = (gender) => {
		const firstName = fakerAR.person.firstName(gender);
		const lastName = fakerAR.person.lastName(gender);

		return {
			name: `${firstName} ${lastName}`,
			email: `${transliterate(firstName)}.${transliterate(lastName)}.${fakerAR.string.alphanumeric(4).toLowerCase()}@gmail.com`,
			description: `وصف للمعلم ${firstName} ${lastName}`,
			password: 12345678,
			phone: fakerAR.helpers.fromRegExp('05[6-7][0-9]{3}[0-9]{4}'),
			coverImage: fakerAR.image.personPortrait({ sex: gender }),
			cv: 'https://res.cloudinary.com/tawhihi/raw/upload/v1752490269/files/cvs/ycvuuocuzzztsw9gh4t4.pdf',
			role: 'teacher',
			isActive: true,
			createdAt: randomDateWithinYear(),
		};
	};

	const teachers = [];
	for (let i = 0; i < 11; i += 1) {
		teachers.push(generateTeacher(fakerAR.helpers.arrayElement(['male', 'female'])));
	}
	try {
		await User.create(teachers);
		console.log(t('seeder.teachers_created'));
	} catch (error) {
		console.error(t('seeder.error_creating_teachers', { error }));
		process.exit(-1);
	}
};

const seedBranches = async () => {
	const branches = JSON.parse(readFileSync('./branches.json'));
	try {
		await Branch.create(branches);
		console.log(t('seeder.branches_created'));
	} catch (error) {
		console.error(t('seeder.error_creating_branches', { error }));
		process.exit(-1);
	}
};

const seedSubjects = async () => {
	const subjects = JSON.parse(readFileSync('./subjects.json'));
	try {
		await Subject.create(subjects);
		console.log(t('seeder.subjects_created'));
	} catch (error) {
		console.error(t('seeder.error_creating_subjects', { error }));
		process.exit(-1);
	}
};

// ─── New seeding functions ────────────────────────────────────────────────

const seedCourses = async (teachers, subjects, branches) => {
	const names = [
		'رياضيات الصف الأول الثانوي',
		'فيزياء الصف الأول الثانوي',
		'كيمياء الصف الأول الثانوي',
		'أحياء الصف الأول الثانوي',
		'رياضيات الصف الثاني الثانوي',
		'فيزياء الصف الثاني الثانوي',
		'كيمياء الصف الثاني الثانوي',
		'أحياء الصف الثاني الثانوي',
		'اللغة العربية للصف الأول',
		'اللغة الإنجليزية للصف الثاني',
	];
	const coursesData = names.map((name) => {
		const price = fakerAR.helpers.arrayElement([50, 75, 100, 120, 150]);
		return {
			name,
			description: fakerAR.lorem.paragraph(),
			teacher: fakerAR.helpers.arrayElement(teachers)._id,
			subject: fakerAR.helpers.arrayElement(subjects)._id,
			branches: [fakerAR.helpers.arrayElement(branches)._id],
			price,
			coverImage: `https://picsum.photos/seed/${fakerAR.string.alphanumeric(8)}/640/360`,
			...(Math.random() > 0.5 ? { priceAfterDiscount: price - 20 } : {}),
		};
	});
	try {
		const courses = await Course.create(coursesData);
		console.log('Courses created');
		return courses;
	} catch (error) {
		console.error('Error creating courses', error);
		process.exit(-1);
	}
};

const seedLessons = async (courses) => {
	const lessonsData = [];
	for (const course of courses) {
		for (let i = 1; i <= 3; i++) {
			lessonsData.push({
				name: `الدرس ${i} - ${fakerAR.lorem.words(3)}`,
				description: fakerAR.lorem.sentence(),
				video: 'https://www.w3schools.com/html/mov_bbb.mp4',
				duration: fakerAR.number.int({ min: 300, max: 3600 }),
				course: course._id,
			});
		}
	}
	try {
		const lessons = await Lesson.create(lessonsData);
		console.log('Lessons created');
		return lessons;
	} catch (error) {
		console.error('Error creating lessons', error);
		process.exit(-1);
	}
};

const seedEnrollments = async (students, courses) => {
	const enrollmentsData = [];
	const seen = new Set();
	for (const student of students) {
		const picked = fakerAR.helpers.shuffle([...courses]).slice(0, 2);
		for (const course of picked) {
			const key = `${student._id}-${course._id}`;
			if (!seen.has(key)) {
				seen.add(key);
				enrollmentsData.push({
					user: student._id,
					course: course._id,
					createdAt: randomDateWithinYear(),
				});
			}
		}
	}
	try {
		await Enrollment.create(enrollmentsData);
		console.log('Enrollments created');
		return await Enrollment.find({});
	} catch (error) {
		console.error('Error creating enrollments', error);
		process.exit(-1);
	}
};

const seedComments = async (lessons, enrollments) => {
	const courseMap = {};
	for (const e of enrollments) {
		const cid = e.course._id?.toString() || e.course.toString();
		const uid = e.user._id || e.user;
		if (!courseMap[cid]) courseMap[cid] = [];
		courseMap[cid].push(uid);
	}
	const commentsData = [];
	for (const lesson of lessons) {
		const cid = lesson.course._id?.toString() || lesson.course.toString();
		const enrolled = courseMap[cid] || [];
		if (enrolled.length === 0) continue;
		const chosen = fakerAR.helpers.shuffle([...enrolled]).slice(0, 2);
		for (const userId of chosen) {
			commentsData.push({
				lesson: lesson._id,
				user: userId,
				content: fakerAR.lorem.sentence(),
			});
		}
	}
	try {
		await Comment.create(commentsData);
		console.log('Comments created');
	} catch (error) {
		console.error('Error creating comments', error);
		process.exit(-1);
	}
};

const seedReviews = async (enrollments) => {
	const reviewsData = enrollments.map((e) => ({
		rating: fakerAR.number.int({ min: 3, max: 5 }),
		comment: fakerAR.lorem.sentence(),
		user: e.user._id || e.user,
		course: e.course._id || e.course,
		createdAt: randomDateWithinYear(),
	}));
	try {
		await Review.create(reviewsData);
		console.log('Reviews created');
	} catch (error) {
		console.error('Error creating reviews', error);
		process.exit(-1);
	}
};

const seedCoupons = async () => {
	const names = ['SAVE10', 'DISCOUNT20', 'OFFER30', 'TAWJIHI25', 'STUDENT15'];
	const couponsData = names.map((name, i) => ({
		name,
		discount: fakerAR.helpers.arrayElement([10, 15, 20, 25, 30]),
		expire: i < 3 ? fakerAR.date.future() : fakerAR.date.past(),
	}));
	try {
		await Coupon.create(couponsData);
		console.log('Coupons created');
	} catch (error) {
		console.error('Error creating coupons', error);
		process.exit(-1);
	}
};

const seedNews = async () => {
	const newsData = Array.from({ length: 5 }, () => ({
		title: fakerAR.lorem.sentence({ min: 3, max: 8 }),
		body: fakerAR.lorem.paragraphs(2),
		coverImage: `https://picsum.photos/seed/${fakerAR.string.alphanumeric(8)}/800/400`,
	}));
	try {
		await New.create(newsData);
		console.log('News created');
	} catch (error) {
		console.error('Error creating news', error);
		process.exit(-1);
	}
};

const seedReplies = async (lessons) => {
	const lessonCourseMap = {};
	for (const lesson of lessons) {
		const cid = lesson.course?._id?.toString() || lesson.course?.toString();
		if (cid) lessonCourseMap[lesson._id.toString()] = cid;
	}

	const courses = await Course.find({}).select('teacher');
	const courseTeacherMap = {};
	for (const course of courses) {
		courseTeacherMap[course._id.toString()] = course.teacher;
	}

	const comments = await Comment.find({});
	let count = 0;
	for (const comment of comments) {
		const lessonId = comment.lesson?.toString();
		const courseId = lessonCourseMap[lessonId];
		const teacherId = courseTeacherMap[courseId];
		if (teacherId && fakerAR.helpers.arrayElement([true, false, false, false])) {
			comment.replies.push({
				text: fakerAR.lorem.sentence(),
				user: teacherId,
			});
			await comment.save();
			count++;
		}
	}
	console.log(`Replies seeded (${count})`);
};

const seedPayments = async (users) => {
	const paymentsData = users.map((user) => ({
		user: user._id,
		amount: fakerAR.helpers.arrayElement([50, 75, 100, 120, 150]),
		createdAt: randomDateWithinYear(),
	}));
	try {
		await Payment.create(paymentsData);
		console.log('Payments created');
	} catch (error) {
		console.error('Error creating payments', error);
		process.exit(-1);
	}
};

// ─── Main ──────────────────────────────────────────────────────────────────

(async () => {
	await connectDB(process.env.DB_URI);
})();

(async () => {
	const mode = process.argv[2];
	if (!mode || (mode !== '-d' && mode !== '-i')) {
		console.error(t('seeder.invalid_mode'));
		process.exit(-1);
	}
	try {
		if (mode === '-d') {
			await deleteData();
			process.exit(0);
		} else if (mode === '-i') {
			await seedAdmin();
			await seedUsers();
			await seedTeachers();
			await seedBranches();
			await seedSubjects();

			// Fetch references
			const teachers = await User.find({ role: 'teacher' });
			const students = await User.find({ role: 'user' });
			const subjects = await Subject.find({});
			const branches = await Branch.find({});

			const courses = await seedCourses(teachers, subjects, branches);
			const lessons = await seedLessons(courses);
			const enrollments = await seedEnrollments(students, courses);
			await seedComments(lessons, enrollments);
			await seedReplies(lessons);
			await seedReviews(enrollments);
			await seedPayments(students);
			await seedCoupons();
			await seedNews();

			console.log(t('seeder.seeding_complete'));
			process.exit(0);
		}
	} catch (error) {
		console.error(t('seeder.error_in_seeding', { error }));
		process.exit(-1);
	}
})();
