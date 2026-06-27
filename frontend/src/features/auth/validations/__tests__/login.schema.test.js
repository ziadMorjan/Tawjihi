import { getLoginSchema } from '../login.schema';

const t = (key) => key;

describe('Login Validation Schema', () => {
  const schema = getLoginSchema(t);

  // 1. حالة النجاح الكامل
  test('should validate a correct email and password', async () => {
    const validData = { email: 'test@example.com', password: 'password123' };
    await expect(schema.validate(validData)).resolves.toEqual(validData);
  });

  // 2. خطأ: البريد فارغ
  test('should fail if email is empty', async () => {
    const invalidData = { email: '', password: 'password123' };
    await expect(schema.validate(invalidData)).rejects.toThrow('validation.emailRequired');
  });

  // 3. خطأ: صيغة البريد غير صحيحة (لا يحتوي على @ أو .)
  test('should fail if email format is invalid', async () => {
    const invalidData = { email: 'invalidemail', password: 'password123' };
    await expect(schema.validate(invalidData)).rejects.toThrow('validation.emailInvalid');
  });

  // 4. خطأ: كلمة المرور فارغة
  test('should fail if password is empty', async () => {
    const invalidData = { email: 'test@example.com', password: '' };
    await expect(schema.validate(invalidData)).rejects.toThrow('validation.passwordRequired');
  });

  // 5. خطأ: كلمة المرور أقل من 8 أحرف
  test('should fail if password is too short', async () => {
    const invalidData = { email: 'test@example.com', password: 'short' };
    await expect(schema.validate(invalidData)).rejects.toThrow('validation.passwordMin');
  });
});