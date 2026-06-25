import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PATH } from '../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock } from 'lucide-react';
import styled from 'styled-components';
import { MainLayout }        from '../../shared/components/layout/MainLayout';
import { Button, Input }     from '../../shared/components';
import { useChangePassword } from '../../features/user';

const PageWrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing[6]};
`;

const StrengthBar = styled.div`
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.bgTertiary};
  margin-top: 6px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    border-radius: 999px;
    transition: all 0.3s ease;
    background: ${({ $strength }) =>
      $strength === 'weak'   ? '#DC2626' :
      $strength === 'medium' ? '#F59E0B' :
      $strength === 'strong' ? '#16A34A' : 'transparent'
    };
    width: ${({ $strength }) =>
      $strength === 'weak'   ? '33%' :
      $strength === 'medium' ? '66%' :
      $strength === 'strong' ? '100%' : '0%'
    };
  }
`;

const getStrength = (pw) => {
  if (!pw) return '';
  if (pw.length < 6)  return 'weak';
  if (pw.length < 10) return 'medium';
  return 'strong';
};

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export default function ChangePassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const changeMutation = useChangePassword();

  const schema = useMemo(() => yup.object({
    currentPassword:    yup.string().required(t('profile.currentPasswordRequired')),
    newPassword:        yup.string().min(8, t('profile.minChar')).required(t('profile.newPasswordRequired')),
    newConfirmPassword: yup.string()
      .oneOf([yup.ref('newPassword')], t('profile.passwordsMustMatch'))
      .required(t('profile.confirmPasswordRequired')),
  }), [t]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const newPassword = watch('newPassword') ?? '';
  const strength = getStrength(newPassword);

  const onSubmit = async (data) => {
    await changeMutation.mutateAsync(data);
    navigate(PATH.profile);
  };

  return (
    <MainLayout>
      <PageWrapper>
        <PageTitle>{t('profile.changePassword')}</PageTitle>

        <Card>
          <Input
            id="currentPassword"
            type="password"
            label={t('profile.currentPassword')}
            leftIcon={<Lock size={16} />}
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <div>
            <Input
              id="newPassword"
              type="password"
              label={t('profile.newPassword')}
              leftIcon={<Lock size={16} />}
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            {newPassword && <StrengthBar $strength={strength} />}
          </div>

          <Input
            id="newConfirmPassword"
            type="password"
            label={t('profile.confirmNewPassword')}
            leftIcon={<Lock size={16} />}
            error={errors.newConfirmPassword?.message}
            {...register('newConfirmPassword')}
          />

          <Actions>
            <Button variant="ghost" onClick={() => navigate(PATH.profile)}>
              {t('profile.cancel')}
            </Button>
            <Button
              isLoading={changeMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {t('profile.changePassword')}
            </Button>
          </Actions>
        </Card>
      </PageWrapper>
    </MainLayout>
  );
}