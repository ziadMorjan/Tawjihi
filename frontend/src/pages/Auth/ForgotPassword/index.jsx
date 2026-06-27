import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForgotPassword } from '../../../features/auth/hooks/useForgotPassword';
import { getForgotPasswordSchemas } from '../../../features/auth';
import { Mail, Key, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthLayout } from '../../../features/auth/components/AuthLayout';
import { Button, Input } from '../../../shared/components';
import { Link } from 'react-router-dom';
import { PATH } from '../../../constants';
import {
  FormHeader, FormTitle, FormSubtitle, ErrorBanner, FooterText
} from '../../../features/auth/components/AuthLayout.styles';

export default function ForgotPassword() {
  const {
    step, setStep, userEmail, showPassword, setShowPassword, errorMessage, setErrorMessage, isRtl,
    forgotPasswordMutation, verifyCodeMutation, resetPasswordMutation, t
  } = useForgotPassword();

  // جلب مخططات التحقق مترجمة ديناميكياً
  const { emailSchema, codeSchema, passwordSchema } = useMemo(
    () => getForgotPasswordSchemas(t),
    [t]
  );

  // إعداد النماذج هنا داخل المكون (متسق مع Login & Register)
  const emailForm = useForm({ resolver: yupResolver(emailSchema) });
  const codeForm = useForm({ resolver: yupResolver(codeSchema) });
  const passwordForm = useForm({ resolver: yupResolver(passwordSchema) });

  // دوال الـ Submit
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
      {step === 1 && (
        <EmailStep
          form={emailForm}
          onSubmit={onEmailSubmit}
          isPending={forgotPasswordMutation.isPending}
          errorMessage={errorMessage}
          t={t}
        />
      )}

      {step === 2 && (
        <CodeStep
          form={codeForm}
          onSubmit={onCodeSubmit}
          isPending={verifyCodeMutation.isPending}
          errorMessage={errorMessage}
          userEmail={userEmail}
          isRtl={isRtl}
          onBack={() => {
            setStep(1);
            setErrorMessage(null);
          }}
          t={t}
        />
      )}

      {step === 3 && (
        <PasswordStep
          form={passwordForm}
          onSubmit={onPasswordSubmit}
          isPending={resetPasswordMutation.isPending}
          errorMessage={errorMessage}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          t={t}
        />
      )}

      <FooterText>
        {t('auth.rememberPassword')}{' '}
        <Link to={PATH.login}>
          {t('auth.loginTitle')}
        </Link>
      </FooterText>
    </AuthLayout>
  );
}

// ─── مكونات الخطوات الفرعية (Sub-components) ───

function EmailStep({ form, onSubmit, isPending, errorMessage, t }) {
  return (
    <>
      <FormHeader>
        <FormTitle>{t('auth.forgotPasswordTitle')}</FormTitle>
        <FormSubtitle>{t('auth.forgotPasswordSub')}</FormSubtitle>
      </FormHeader>

      {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

      <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          id="email" type="email"
          label={t('auth.email')} placeholder="example@email.com"
          leftIcon={<Mail size={18} />}
          error={form.formState.errors.email?.message}
          dir="ltr"
          {...form.register('email')}
        />
        <Button type="submit" fullWidth isLoading={isPending} size="lg">
          {t('auth.sendCodeBtn')}
        </Button>
      </form>
    </>
  );
}

function CodeStep({ form, onSubmit, isPending, errorMessage, userEmail, isRtl, onBack, t }) {
  return (
    <>
      <FormHeader>
        <FormTitle>{t('auth.verifyCodeTitle')}</FormTitle>
        <FormSubtitle>{t('auth.verifyCodeSub', { email: userEmail })}</FormSubtitle>
      </FormHeader>

      {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

      <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          id="resetCode" type="text"
          label={t('auth.verificationCodeLabel')} placeholder="123456"
          maxLength={6}
          leftIcon={<Key size={18} />}
          error={form.formState.errors.resetCode?.message}
          dir="ltr"
          {...form.register('resetCode')}
        />
        <Button type="submit" fullWidth isLoading={isPending} size="lg">
          {t('auth.verifyCodeBtn')}
        </Button>
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
              color: '#2563EB', display: 'inline-flex', alignItems: 'center', gap: 4
            }}
          >
            {isRtl ? <ArrowRight size={14} /> : <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />}
            {t('auth.editEmail')}
          </button>
        </div>
      </form>
    </>
  );
}

function PasswordStep({ form, onSubmit, isPending, errorMessage, showPassword, setShowPassword, t }) {
  return (
    <>
      <FormHeader>
        <FormTitle>{t('auth.newPasswordTitle')}</FormTitle>
        <FormSubtitle>{t('auth.newPasswordSub')}</FormSubtitle>
      </FormHeader>

      {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

      <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          id="newPassword"
          type={showPassword ? 'text' : 'password'}
          label={t('auth.newPasswordLabel')} placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          error={form.formState.errors.newPassword?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              style={{ cursor: 'pointer', display: 'flex', background: 'none', border: 'none', color: 'inherit' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          {...form.register('newPassword')}
        />

        <Input
          id="newConfirmPassword" type="password"
          label={t('auth.newConfirmPasswordLabel')} placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          error={form.formState.errors.newConfirmPassword?.message}
          {...form.register('newConfirmPassword')}
        />

        <Button type="submit" fullWidth isLoading={isPending} size="lg">
          {t('auth.savePasswordBtn')}
        </Button>
      </form>
    </>
  );
}