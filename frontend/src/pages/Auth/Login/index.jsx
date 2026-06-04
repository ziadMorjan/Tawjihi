// src/pages/Auth/Login/index.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../features/auth';
import { AuthLayout } from '../components/AuthLayout';
import { Button, Input } from '../../../shared/components';
import {
  FormHeader, FormTitle, FormSubtitle,
  Divider, OAuthButton, FooterText, ErrorBanner,
} from '../components/AuthLayout.styles';

const schema = yup.object({
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(8, 'كلمة المرور 8 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
});

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isLoginLoading, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (formData) => {
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch {
      // error يظهر من loginError
    }
  };

  const errorMessage = loginError?.response?.data?.message ?? loginError?.message ?? null;

  return (
    <AuthLayout
      panelTitle="مرحباً بعودتك"
      panelSubtitle="سجّل دخولك للوصول إلى كورساتك"
    >
      <FormHeader>
        <FormTitle>تسجيل الدخول</FormTitle>
        <FormSubtitle>أدخل بياناتك للمتابعة</FormSubtitle>
      </FormHeader>

      {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <Input
          id="email"
          type="email"
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          dir="ltr"
          {...register('email')}
        />

        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="كلمة المرور"
          placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              style={{ cursor: 'pointer', display: 'flex', background: 'none', border: 'none', color: 'inherit' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          {...register('password')}
        />

        <div style={{ textAlign: 'left' }}>
          <button
            type="button"
            onClick={() => navigate('/auth/forgot-password')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#2563EB' }}
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        <Button type="submit" fullWidth isLoading={isLoginLoading} size="lg">
          تسجيل الدخول
        </Button>
      </form>

      <Divider>أو</Divider>

      <OAuthButton
        type="button"
        onClick={() => { window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`; }}
      >
        <img src="/assets/img/google.png" alt="Google" width={20} height={20} />
        المتابعة عبر Google
      </OAuthButton>

      <FooterText>
        ليس لديك حساب؟{' '}
        <button type="button" onClick={() => navigate('/auth/register')}>
          إنشاء حساب جديد
        </button>
      </FooterText>
    </AuthLayout>
  );
}