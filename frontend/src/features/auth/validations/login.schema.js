import * as yup from 'yup';
export const schemaLogin = yup.object({
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(8, 'كلمة المرور 8 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
});