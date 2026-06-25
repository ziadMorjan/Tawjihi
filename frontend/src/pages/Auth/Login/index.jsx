// src/pages/Auth/Login/index.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATH } from '../../../constants';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../features/auth';
import { Button, Input } from '../../../shared/components';
import {AuthLayout} from "../../../features/auth/components/AuthLayout"
import {
  FormHeader, FormTitle, FormSubtitle,
  Divider, OAuthButton, FooterText, ErrorBanner,
} from '../../../features/auth/components/AuthLayout.styles';

import { schemaLogin } from '../../../features/auth/validations/login.schema';



export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { t }     = useTranslation();
  const { login, isLoginLoading, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schemaLogin) });

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
      panelTitle={t('auth.welcomeBack')}
      panelSubtitle={t('auth.welcomeBackSub')}
    >
      <FormHeader>
        <FormTitle>{t('auth.loginTitle')}</FormTitle>
        <FormSubtitle>{t('auth.enterDetails')}</FormSubtitle>
      </FormHeader>

      {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <Input
          id="email"
          type="email"
          label={t('auth.email')}
          placeholder="example@email.com"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          dir="ltr"
          {...register('email')}
        />

        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label={t('auth.password')}
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
            onClick={() => navigate(PATH.forgotPassword)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#2563EB' }}
          >
            {t('auth.forgotPassword')}
          </button>
        </div>

        <Button type="submit" fullWidth isLoading={isLoginLoading} size="lg">
          {t('auth.loginBtn')}
        </Button>
      </form>

      <Divider>{t('auth.or')}</Divider>

      <OAuthButton
        type="button"
        onClick={() => { window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`; }}
      >
        <img src="/assets/img/google.png" alt="Google" width={20} height={20} />
        {t('auth.continueWithGoogle')}
      </OAuthButton>

      <FooterText>
        {t('auth.noAccount')}{' '}
        <button type="button" onClick={() => navigate(PATH.register)}>
          {t('auth.registerBtn')}
        </button>
      </FooterText>
    </AuthLayout>
  );
}