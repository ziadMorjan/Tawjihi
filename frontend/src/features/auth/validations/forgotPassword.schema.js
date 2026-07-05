import * as yup from 'yup';

const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// دالة توليد مخططات التحقق لدعم الترجمة الديناميكية (i18n)
export const getForgotPasswordSchemas = (t) => {
  const emailSchema = yup.object({
    email: yup.string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
  });

  const codeSchema = yup.object({
    resetCode: yup.string().length(6, t('validation.codeLength')).required(t('validation.codeRequired')),
  });

  const passwordSchema = yup.object({
    newPassword: yup.string()
      .min(8, t('validation.passwordMin'))
      .matches(passRegex, t('validation.passwordStrength'))
      .required(t('validation.passwordRequired')),
    newConfirmPassword: yup.string()
      .oneOf([yup.ref('newPassword')], t('validation.passwordsMustMatch'))
      .required(t('validation.confirmPasswordRequired')),
  });

  return { emailSchema, codeSchema, passwordSchema };
};
