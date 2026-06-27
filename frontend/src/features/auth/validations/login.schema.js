import * as yup from 'yup';

// دالة توليد الـ Schema لدعم الترجمة الديناميكية (i18n)
export const getLoginSchema = (t) => yup.object({
  email: yup
    .string()
    .email(t('validation.emailInvalid'))
    .required(t('validation.emailRequired')),
  password: yup
    .string()
    .required(t('validation.passwordRequired'))
    .min(8, t('validation.passwordMin')),
});