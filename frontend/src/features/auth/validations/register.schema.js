import * as yup from 'yup';

// دالة توليد الـ Schema لدعم الترجمة الديناميكية (i18n)
export const getRegisterSchema = (t) => {
  const studentSchema = yup.object({
    name:            yup.string().required(t('validation.nameRequired')),
    email:           yup.string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
    phone:           yup.string().required(t('validation.phoneRequired')),
    password:        yup.string().required(t('validation.passwordRequired')).min(8, t('validation.passwordMin')),
    confirmPassword: yup.string()
      .required(t('validation.confirmPasswordRequired'))
      .oneOf([yup.ref('password'), ''], t('validation.passwordsMustMatch')),
  });

  const teacherSchema = studentSchema.shape({
    cv: yup.mixed().required(t('validation.cvRequired')),
  });

  return { studentSchema, teacherSchema };
};
