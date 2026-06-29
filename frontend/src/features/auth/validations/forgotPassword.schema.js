import * as yup from 'yup';

const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// دالة توليد مخططات التحقق لدعم الترجمة الديناميكية (i18n)
export const getForgotPasswordSchemas = (t) => {
  const emailSchema = yup.object({
    email: yup.string().required(t('validation.emailRequired')).email(t('validation.emailInvalid')),
  });

  const codeSchema = yup.object({
    resetCode: yup.string().required(t('validation.codeRequired')).length(6, t('validation.codeLength')),
  });

  const passwordSchema = yup.object({
    newPassword: yup.string()
      .required(t('validation.passwordRequired'))
      .min(8, t('validation.passwordMin'))
      .matches(passRegex, t('validation.passwordStrength')),
    newConfirmPassword: yup.string()
      .required(t('validation.confirmPasswordRequired'))
      .oneOf([yup.ref('newPassword'), ''], t('validation.passwordsMustMatch')),
  });

  return { emailSchema, codeSchema, passwordSchema };
};
