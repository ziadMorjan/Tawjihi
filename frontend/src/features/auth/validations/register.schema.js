import * as yup from 'yup';

// Schema الطالب
export const studentSchema = yup.object({
  name:            yup.string().required('الاسم مطلوب'),
  email:           yup.string().email('بريد غير صحيح').required('البريد مطلوب'),
  phone:           yup.string().required('الهاتف مطلوب'),
  password:        yup.string().min(8, '8 أحرف على الأقل').required('كلمة المرور مطلوبة'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
});

// Schema المعلم — يضيف CV
export const teacherSchema = studentSchema.shape({
  cv: yup.mixed().required('السيرة الذاتية مطلوبة للمعلمين'),
});


