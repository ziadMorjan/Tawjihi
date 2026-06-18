// src/pages/Auth/Register/index.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../constants';
import { Mail, Lock, Eye, EyeOff, User, Phone, Upload } from 'lucide-react';
import { useAuth } from '../../../features/auth';
import { Button, Input, Badge } from '../../../shared/components';
import {AuthLayout} from "../../../features/auth/components/AuthLayout"
import {studentSchema , teacherSchema} from "../../../features/auth/validations/register.schema"
import {
  FormHeader, FormTitle, FormSubtitle,
  Divider, OAuthButton, FooterText, ErrorBanner,
} from '../../../features/auth/components/AuthLayout.styles';


export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isRegisterLoading, registerError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [cvFileName, setCvFileName] = useState('');

  const schema = selectedRole === 'teacher' ? teacherSchema : studentSchema;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    reset();
    setCvFileName('');
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('cv', file);
      setCvFileName(file.name);
    }
  };

  const onSubmit = async (formData) => {
    try {

      if (selectedRole === 'teacher') {
        const fd = new FormData();
        Object.keys(formData).forEach(key => {
          if (key !== 'cv') fd.append(key, formData[key]);
        });
        fd.append('cv', formData.cv);
        fd.append('role', 'teacher');
        await registerUser(fd);
        navigate(PATH.login, {
          state: { message: 'تم إرسال طلبك، انتظر موافقة الإدارة' }
        });
      } else {
        await registerUser({ ...formData, role: 'user' });
        navigate(PATH.home);
      }
    } catch {
      // error في registerError
    }
  };

  const errorMessage = registerError?.response?.data?.message ?? registerError?.message ?? null;

  return (
    <AuthLayout
      panelTitle="انضم إلى توجيهي"
      panelSubtitle="آلاف الطلاب يدرسون معنا كل يوم"
    >
      <FormHeader>
        <FormTitle>إنشاء حساب جديد</FormTitle>
        <FormSubtitle>أدخل بياناتك لإنشاء حسابك</FormSubtitle>
      </FormHeader>

      {/* Role Selector */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ value: 'user', label: 'طالب' }, { value: 'teacher', label: 'معلم' }].map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleRoleChange(value)}
            style={{
              flex: 1, padding: '10px',
              borderRadius: 8,
              border: `2px solid ${selectedRole === value ? '#1B4FD8' : '#E2E8F0'}`,
              background: selectedRole === value ? '#EFF6FF' : 'white',
              color: selectedRole === value ? '#1B4FD8' : '#475569',
              fontFamily: 'inherit', fontSize: 14,
              fontWeight: selectedRole === value ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {selectedRole === 'teacher' && (
        <Badge variant="warning">طلب المعلم يحتاج موافقة الإدارة قبل التفعيل</Badge>
      )}

      {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <Input
          id="name" type="text"
          label="الاسم الكامل" placeholder="محمد أحمد"
          leftIcon={<User size={18} />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          id="email" type="email"
          label="البريد الإلكتروني" placeholder="example@email.com"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          dir="ltr"
          {...register('email')}
        />

        <Input
          id="phone" type="tel"
          label="رقم الهاتف" placeholder="0599123456"
          leftIcon={<Phone size={18} />}
          error={errors.phone?.message}
          dir="ltr"
          {...register('phone')}
        />

        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="كلمة المرور" placeholder="8 أحرف على الأقل"
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(p => !p)}
              style={{ cursor: 'pointer', display: 'flex', background: 'none', border: 'none', color: 'inherit' }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          {...register('password')}
        />

        <Input
          id="confirmPassword" type="password"
          label="تأكيد كلمة المرور" placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* CV Upload — للمعلم فقط */}
        {selectedRole === 'teacher' && (
          <div>
            <label
              htmlFor="cv-upload"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 16px',
                border: `1.5px dashed ${errors.cv ? '#DC2626' : '#CBD5E1'}`,
                borderRadius: 12,
                cursor: 'pointer',
                background: '#F8FAFC',
                color: '#475569',
                fontSize: 14,
              }}
            >
              <Upload size={18} />
              {cvFileName || 'رفع السيرة الذاتية (PDF)'}
            </label>
            <input
              id="cv-upload"
              type="file"
              accept=".pdf"
              onChange={handleCvChange}
              style={{ display: 'none' }}
            />
            {errors.cv && (
              <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>
                {errors.cv.message}
              </span>
            )}
          </div>
        )}

        <Button type="submit" fullWidth isLoading={isRegisterLoading} size="lg">
          إنشاء الحساب
        </Button>
      </form>

      <Divider>أو</Divider>

      <OAuthButton
        type="button"
        onClick={() => { window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`; }}
      >
        <img src="/assets/img/google.png" alt="Google" width={20} height={20} />
        التسجيل عبر Google
      </OAuthButton>

      <FooterText>
        لديك حساب؟{' '}
        <button type="button" onClick={() => navigate(PATH.login)}>
          تسجيل الدخول
        </button>
      </FooterText>
    </AuthLayout>
  );
}