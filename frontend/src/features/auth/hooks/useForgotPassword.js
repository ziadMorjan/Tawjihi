import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '..';
import { PATH } from '../../../constants';

export function useForgotPassword() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const isRtl = i18n.language.startsWith('ar');

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
      navigate(PATH.login, { replace: true });
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || t('auth.errorResetFailed'));
    }
  });

  return {
    step,
    setStep,
    userEmail,
    showPassword,
    setShowPassword,
    errorMessage,
    setErrorMessage,
    isRtl,
    forgotPasswordMutation,
    verifyCodeMutation,
    resetPasswordMutation,
    t,
  };
}