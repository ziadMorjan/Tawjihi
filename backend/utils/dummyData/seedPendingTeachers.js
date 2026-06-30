import { config } from 'dotenv';
import { fakerAR } from '@faker-js/faker';
import { connectDB } from '../../config/db.js';
import User from '../../models/User.js';

config({ path: '../../config.env' });

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

(async () => {
	try {
		await connectDB(process.env.DB_URI);

		const count = 3;
		const pendingTeachers = [];

		for (let i = 0; i < count; i += 1) {
			const gender = fakerAR.helpers.arrayElement(['male', 'female']);
			const firstName = fakerAR.person.firstName(gender);
			const lastName = fakerAR.person.lastName(gender);

			pendingTeachers.push({
				name: `${firstName} ${lastName}`,
				email: `${transliterate(firstName)}.${transliterate(lastName)}.pending.${i}@gmail.com`,
				description: `معلم يريد الانضمام إلى المنصة: ${firstName} ${lastName}`,
				password: '12345678',
				phone: fakerAR.helpers.fromRegExp('05[6-7][0-9]{3}[0-9]{4}'),
				coverImage: fakerAR.image.personPortrait({ sex: gender }),
				cv: 'https://res.cloudinary.com/tawhihi/raw/upload/v1752490269/files/cvs/ycvuuocuzzztsw9gh4t4.pdf',
				role: 'teacher',
				isActive: false,
			});
		}

		const created = await User.create(pendingTeachers);
		console.log(`✅ Created ${created.length} pending teacher(s):`);
		created.forEach((t) => console.log(`   - ${t.name} (${t.email})`));
		process.exit(0);
	} catch (error) {
		console.error('❌ Error creating pending teachers:', error.message);
		process.exit(-1);
	}
})();
