import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATH } from '../../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Mail, Key, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi } from '../../../features/auth';
import { AuthLayout } from '../../../features/auth/components/AuthLayout';
import { Button, Input } from '../../../shared/components';
import {
  FormHeader, FormTitle, FormSubtitle, ErrorBanner, FooterText
} from '../../../features/auth/components/AuthLayout.styles';

const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1); // 1: إدخال البريد, 2: إدخال الكود, 3: تعيين كلمة المرور
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const isRtl = i18n.language.startsWith('ar');

  // مخططات التحقق (Schemas) لكل خطوة
  const emailSchema = useMemo(() => yup.object({
    email: yup.string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
  }), [t]);

  const codeSchema = useMemo(() => yup.object({
    resetCode: yup.string().length(6, t('validation.codeLength')).required(t('validation.codeRequired')),
  }), [t]);

  const passwordSchema = useMemo(() => yup.object({
    newPassword: yup.string()
      .min(8, t('validation.passwordMin'))
      .matches(passRegex, t('validation.passwordStrength'))
      .required(t('validation.passwordRequired')),
    newConfirmPassword: yup.string()
      .oneOf([yup.ref('newPassword')], t('validation.passwordsMustMatch'))
      .required(t('validation.confirmPasswordRequired')),
  }), [t]);

  // إعداد النماذج المنفصلة لكل خطوة لحماية الـ Validation
  const emailForm = useForm({ resolver: yupResolver(emailSchema) });
  const codeForm = useForm({ resolver: yupResolver(codeSchema) });
  const passwordForm = useForm({ resolver: yupResolver(passwordSchema) });

  // --- عمليات الـ Mutations (React Query) ---

  // الخطوة 1: طلب إرسال الكود
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (_, variables) => {
      setUserEmail(variables);
      setErrorMessage(null);
      setStep(2);
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || t('auth.errorSendCode'));
    }
  });

  // الخطوة 2: التحقق من الكود
  const verifyCodeMutation = useMutation({
    mutationFn: authApi.verifyResetCode,
    onSuccess: () => {
      setErrorMessage(null);
      setStep(3);
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || t('auth.errorInvalidCode'));
    }
  });

  // الخطوة 3: تغيير كلمة المرور النهائية
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      setErrorMessage(null);
      // توجيه المستخدم لصفحة تسجيل الدخول بنجاح
      navigate(PATH.login, { replace: true });
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || t('auth.errorResetFailed'));
    }
  });

  // --- الدوال المشغلة لإرسال البيانات ---
  const onEmailSubmit = (data) => forgotPasswordMutation.mutate(data.email);
  const onCodeSubmit = (data) => verifyCodeMutation.mutate(data.resetCode);
  const onPasswordSubmit = (data) => {
    resetPasswordMutation.mutate({
      email: userEmail,
      newPassword: data.newPassword,
      newConfirmPassword: data.newConfirmPassword
    });
  };

  return (
    <AuthLayout
      panelTitle={t('auth.resetAccessTitle')}
      panelSubtitle={t('auth.resetAccessSub')}
    >
      {/* الخطوة الأولى: إدخال البريد الإلكتروني */}
      {step === 1 && (
        <>
          <FormHeader>
            <FormTitle>{t('auth.forgotPasswordTitle')}</FormTitle>
            <FormSubtitle>{t('auth.forgotPasswordSub')}</FormSubtitle>
          </FormHeader>

          {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="email"
              type="email"
              label={t('auth.email')}
              placeholder="example@email.com"
              leftIcon={<Mail size={18} />}
              error={emailForm.formState.errors.email?.message}
              dir="ltr"
              {...emailForm.register('email')}
            />
            <Button type="submit" fullWidth isLoading={forgotPasswordMutation.isPending} size="lg">
              {t('auth.sendCodeBtn')}
            </Button>
          </form>
        </>
      )}

      {/* الخطوة الثانية: إدخال كود التحقق المكون من 6 أرقام */}
      {step === 2 && (
        <>
          <FormHeader>
            <FormTitle>{t('auth.verifyCodeTitle')}</FormTitle>
            <FormSubtitle>{t('auth.verifyCodeSub', { email: userEmail })}</FormSubtitle>
          </FormHeader>

          {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

          <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="resetCode"
              type="text"
              label={t('auth.verificationCodeLabel')}
              placeholder="123456"
              maxLength={6}
              leftIcon={<Key size={18} />}
              error={codeForm.formState.errors.resetCode?.message}
              dir="ltr"
              {...codeForm.register('resetCode')}
            />
            <Button type="submit" fullWidth isLoading={verifyCodeMutation.isPending} size="lg">
              {t('auth.verifyCodeBtn')}
            </Button>
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => { setStep(1); setErrorMessage(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#2563EB', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                {isRtl ? <ArrowRight size={14} /> : <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />} {t('auth.editEmail')}
              </button>
            </div>
          </form>
        </>
      )}

      {/* الخطوة الثالثة: كتابة كلمة المرور الجديدة */}
      {step === 3 && (
        <>
          <FormHeader>
            <FormTitle>{t('auth.newPasswordTitle')}</FormTitle>
            <FormSubtitle>{t('auth.newPasswordSub')}</FormSubtitle>
          </FormHeader>

          {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              label={t('auth.newPasswordLabel')}
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={passwordForm.formState.errors.newPassword?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{ cursor: 'pointer', display: 'flex', background: 'none', border: 'none', color: 'inherit' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              {...passwordForm.register('newPassword')}
            />

            <Input
              id="newConfirmPassword"
              type="password"
              label={t('auth.newConfirmPasswordLabel')}
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={passwordForm.formState.errors.newConfirmPassword?.message}
              {...passwordForm.register('newConfirmPassword')}
            />

            <Button type="submit" fullWidth isLoading={resetPasswordMutation.isPending} size="lg">
              {t('auth.savePasswordBtn')}
            </Button>
          </form>
        </>
      )}

      <FooterText>
        {t('auth.rememberPassword')}{' '}
        <button type="button" onClick={() => navigate(PATH.login)}>
          {t('auth.loginTitle')}
        </button>
      </FooterText>
    </AuthLayout>
  );
}