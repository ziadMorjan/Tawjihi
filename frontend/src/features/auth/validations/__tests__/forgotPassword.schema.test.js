import { getForgotPasswordSchemas } from '../forgotPassword.schema';

const t = (key) => key;

describe('Forgot Password Validation Schemas', () => {
  const { emailSchema, codeSchema, passwordSchema } = getForgotPasswordSchemas(t);

  describe('Email Step Schema', () => {
    test('should validate a correct email', async () => {
      const validData = { email: 'test@example.com' };
      await expect(emailSchema.validate(validData)).resolves.toEqual(validData);
    });

    test('should fail if email is empty', async () => {
      const invalidData = { email: '' };
      await expect(emailSchema.validate(invalidData)).rejects.toThrow('validation.emailRequired');
    });

    test('should fail if email format is invalid', async () => {
      const invalidData = { email: 'invalidemail' };
      await expect(emailSchema.validate(invalidData)).rejects.toThrow('validation.emailInvalid');
    });
  });

  describe('Code Step Schema', () => {
    test('should validate a correct 6-digit code', async () => {
      const validData = { resetCode: '123456' };
      await expect(codeSchema.validate(validData)).resolves.toEqual(validData);
    });

    test('should fail if code is empty', async () => {
      const invalidData = { resetCode: '' };
      await expect(codeSchema.validate(invalidData)).rejects.toThrow('validation.codeRequired');
    });

    test('should fail if code is not 6 characters long', async () => {
      const invalidData = { resetCode: '12345' };
      await expect(codeSchema.validate(invalidData)).rejects.toThrow('validation.codeLength');
    });
  });

  describe('Password Step Schema', () => {
    test('should validate a strong password and matching confirmation', async () => {
      const validData = {
        newPassword: 'Password123!',
        newConfirmPassword: 'Password123!',
      };
      await expect(passwordSchema.validate(validData)).resolves.toEqual(validData);
    });

    test('should fail if password is empty', async () => {
      // نستخدم validateAt لفحص حقل newPassword بشكل معزول
      await expect(passwordSchema.validateAt('newPassword', { newPassword: '' }))
        .rejects.toThrow('validation.passwordRequired');
    });

    test('should fail if password is too short', async () => {
      await expect(passwordSchema.validateAt('newPassword', { newPassword: 'short' }))
        .rejects.toThrow('validation.passwordMin');
    });

    test('should fail if password lacks capital letter or special character', async () => {
      await expect(passwordSchema.validateAt('newPassword', { newPassword: 'password123' }))
        .rejects.toThrow('validation.passwordStrength');
    });

    test('should fail if confirmation is empty', async () => {
      await expect(passwordSchema.validateAt('newConfirmPassword', { newConfirmPassword: '' }))
        .rejects.toThrow('validation.confirmPasswordRequired');
    });

    test('should fail if confirmation does not match password', async () => {
      const invalidData = {
        newPassword: 'Password123!',
        newConfirmPassword: 'Different123!',
      };
      await expect(passwordSchema.validate(invalidData)).rejects.toThrow('validation.passwordsMustMatch');
    });
  });
});
