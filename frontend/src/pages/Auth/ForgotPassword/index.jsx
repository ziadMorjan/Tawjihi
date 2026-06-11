import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Mail, Key, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi } from '../../../features/auth';
import { AuthLayout } from '../components/AuthLayout';
import { Button, Input } from '../../../shared/components';
import {
  FormHeader, FormTitle, FormSubtitle, ErrorBanner, FooterText
} from '../components/AuthLayout.styles';

// مخططات التحقق (Schemas) لكل خطوة
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

const emailSchema = yup.object({
  email: yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
});

const codeSchema = yup.object({
  resetCode: yup.string().length(6, 'يجب أن يتكون الرمز من 6 أرقام').required('رمز التحقق مطلوب'),
});

const passwordSchema = yup.object({
  newPassword: yup.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(passRegex, 'يجب أن تحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص')
    .required('كلمة المرور مطلوبة'),
  newConfirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'كلمات المرور غير متطابقتين')
    .required('تأكيد كلمة المرور مطلوب'),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: إدخال البريد, 2: إدخال الكود, 3: تعيين كلمة المرور
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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
      setErrorMessage(error.response?.data?.message || 'حدث خطأ أثناء إرسال الكود');
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
      setErrorMessage(error.response?.data?.message || 'رمز التحقق غير صحيح أو منتهي الصلاحية');
    }
  });

  // الخطوة 3: تغيير كلمة المرور النهائية
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      setErrorMessage(null);
      // توجيه المستخدم لصفحة تسجيل الدخول بنجاح
      navigate('/auth/login', { replace: true });
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || 'فشل إعادة تعيين كلمة المرور');
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
      panelTitle="استعادة الوصول لحسابك"
      panelSubtitle="خطوات بسيطة لإعادة تعيين كلمة المرور الخاصة بك والعودة للتعلم"
    >
      {/* الخطوة الأولى: إدخال البريد الإلكتروني */}
      {step === 1 && (
        <>
          <FormHeader>
            <FormTitle>نسيت كلمة المرور؟</FormTitle>
            <FormSubtitle>أدخل بريدك الإلكتروني لإرسال رمز التحقق</FormSubtitle>
          </FormHeader>

          {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="email"
              type="email"
              label="البريد الإلكتروني"
              placeholder="example@email.com"
              leftIcon={<Mail size={18} />}
              error={emailForm.formState.errors.email?.message}
              dir="ltr"
              {...emailForm.register('email')}
            />
            <Button type="submit" fullWidth isLoading={forgotPasswordMutation.isPending} size="lg">
              إرسال رمز التحقق
            </Button>
          </form>
        </>
      )}

      {/* الخطوة الثانية: إدخال كود التحقق المكون من 6 أرقام */}
      {step === 2 && (
        <>
          <FormHeader>
            <FormTitle>التحقق من الرمز</FormTitle>
            <FormSubtitle>أدخل الرمز المكون من 6 أرقام المرسل إلى {userEmail}</FormSubtitle>
          </FormHeader>

          {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

          <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="resetCode"
              type="text"
              label="رمز التحقق"
              placeholder="123456"
              maxLength={6}
              leftIcon={<Key size={18} />}
              error={codeForm.formState.errors.resetCode?.message}
              dir="ltr"
              {...codeForm.register('resetCode')}
            />
            <Button type="submit" fullWidth isLoading={verifyCodeMutation.isPending} size="lg">
              التحقق من الرمز
            </Button>
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => { setStep(1); setErrorMessage(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#2563EB', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <ArrowRight size={14} /> تعديل البريد الإلكتروني
              </button>
            </div>
          </form>
        </>
      )}

      {/* الخطوة الثالثة: كتابة كلمة المرور الجديدة */}
      {step === 3 && (
        <>
          <FormHeader>
            <FormTitle>تعيين كلمة مرور جديدة</FormTitle>
            <FormSubtitle>أدخل كلمة المرور الجديدة لحمايتها وتحديث حسابك</FormSubtitle>
          </FormHeader>

          {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              label="كلمة المرور الجديدة"
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
              label="تأكيد كلمة المرور الجديدة"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={passwordForm.formState.errors.newConfirmPassword?.message}
              {...passwordForm.register('newConfirmPassword')}
            />

            <Button type="submit" fullWidth isLoading={resetPasswordMutation.isPending} size="lg">
              حفظ وتحديث كلمة المرور
            </Button>
          </form>
        </>
      )}

      <FooterText>
        تذكرت كلمة المرور؟{' '}
        <button type="button" onClick={() => navigate('/auth/login')}>
          تسجيل الدخول
        </button>
      </FooterText>
    </AuthLayout>
  );
}