import { getRegisterSchema } from '../register.schema';

const t = (key) => key;

describe('Register Validation Schema', () => {
  const { studentSchema, teacherSchema } = getRegisterSchema(t);

  describe('Student Schema', () => {
    // 1. حالة النجاح الكامل للطالب
    test('should validate correct student data', async () => {
      const validData = {
        name: 'Ahmad Ali',
        email: 'ahmad@example.com',
        phone: '0599123456',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await expect(studentSchema.validate(validData)).resolves.toEqual(validData);
    });

    // 2. خطأ: الاسم فارغ
    test('should fail if name is empty', async () => {
      const invalidData = {
        name: '',
        email: 'ahmad@example.com',
        phone: '0599123456',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await expect(studentSchema.validate(invalidData)).rejects.toThrow('validation.nameRequired');
    });

    // 3. خطأ: البريد الإلكتروني فارغ
    test('should fail if email is empty', async () => {
      const invalidData = {
        name: 'Ahmad Ali',
        email: '',
        phone: '0599123456',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await expect(studentSchema.validate(invalidData)).rejects.toThrow('validation.emailRequired');
    });

    // 4. خطأ: صيغة البريد الإلكتروني غير صحيحة
    test('should fail if email format is invalid', async () => {
      const invalidData = {
        name: 'Ahmad Ali',
        email: 'invalidemail',
        phone: '0599123456',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await expect(studentSchema.validate(invalidData)).rejects.toThrow('validation.emailInvalid');
    });

    // 5. خطأ: رقم الهاتف فارغ
    test('should fail if phone is empty', async () => {
      const invalidData = {
        name: 'Ahmad Ali',
        email: 'ahmad@example.com',
        phone: '',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await expect(studentSchema.validate(invalidData)).rejects.toThrow('validation.phoneRequired');
    });

    // 6. خطأ: كلمة المرور فارغة
    test('should fail if password is empty', async () => {
      await expect(studentSchema.validateAt('password', { password: '' }))
        .rejects.toThrow('validation.passwordRequired');
    });

    // 7. خطأ: كلمة المرور قصيرة جداً
    test('should fail if password is too short', async () => {
      const invalidData = {
        name: 'Ahmad Ali',
        email: 'ahmad@example.com',
        phone: '0599123456',
        password: 'short',
        confirmPassword: 'short',
      };
      await expect(studentSchema.validate(invalidData)).rejects.toThrow('validation.passwordMin');
    });

    // 8. خطأ: عدم تطابق كلمتي المرور
    test('should fail if passwords do not match', async () => {
      const invalidData = {
        name: 'Ahmad Ali',
        email: 'ahmad@example.com',
        phone: '0599123456',
        password: 'password123',
        confirmPassword: 'differentpassword',
      };
      await expect(studentSchema.validate(invalidData)).rejects.toThrow('validation.passwordsMustMatch');
    });

    // 9. خطأ: تأكيد كلمة المرور فارغ
    test('should fail if confirmPassword is empty', async () => {
      await expect(studentSchema.validateAt('confirmPassword', { confirmPassword: '' }))
        .rejects.toThrow('validation.confirmPasswordRequired');
    });
  });

  describe('Teacher Schema', () => {
    // 1. حالة النجاح الكامل للمعلم (مع السيرة الذاتية)
    test('should validate correct teacher data including CV', async () => {
      const validData = {
        name: 'Ahmad Ali',
        email: 'ahmad@example.com',
        phone: '0599123456',
        password: 'password123',
        confirmPassword: 'password123',
        cv: 'my-cv-file-object',
      };
      await expect(teacherSchema.validate(validData)).resolves.toEqual(validData);
    });

    // 2. خطأ: السيرة الذاتية مفقودة
    test('should fail if CV is missing', async () => {
      const invalidData = {
        name: 'Ahmad Ali',
        email: 'ahmad@example.com',
        phone: '0599123456',
        password: 'password123',
        confirmPassword: 'password123',
        // cv مفقود هنا
      };
      await expect(teacherSchema.validate(invalidData)).rejects.toThrow('validation.cvRequired');
    });
  });
});
