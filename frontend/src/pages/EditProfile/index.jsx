import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Camera, User, Mail, Phone, FileText } from 'lucide-react';
import styled from 'styled-components';
import { MainLayout }      from '../../shared/components/layout/MainLayout';
import { Button, Input } from '../../shared/components';
import { useAuth }         from '../../features/auth';
import { useUpdateProfile } from '../../features/user';

const schema = yup.object({
  name:  yup.string().required('الاسم مطلوب'),
  email: yup.string().email('بريد غير صحيح').required('البريد مطلوب'),
  phone: yup.string().nullable(),
  bio:   yup.string().nullable(),
});

const PageWrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[10]} ${theme.spacing[6]}`};
  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing[6]};
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[5]};
`;

const AvatarUpload = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px dashed ${({ theme }) => theme.colors.border};

  img, span {
    width: 100%; height: 100%;
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 28px;
    font-weight: 700;
  }

  &:hover .overlay { opacity: 1; }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
  class: overlay;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
  outline: none;
  direction: rtl;
  min-height: 100px;
  background: ${({ theme }) => theme.colors.bgPrimary};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: block;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export default function EditProfile() {
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const fileRef    = useRef(null);
  const [preview, setPreview] = useState(user?.coverImage ?? null);
  const [imageFile, setImageFile] = useState(null);

  const updateMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name:  user?.name  ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      bio:   user?.bio   ?? '',
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('image/')) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const fd = new FormData();
    fd.append('name',  data.name);
    fd.append('email', data.email);
    if (data.phone) fd.append('phone', data.phone);
    if (data.bio)   fd.append('bio',   data.bio);
    if (imageFile)  fd.append('coverImage', imageFile);

    await updateMutation.mutateAsync(fd);
    navigate(PATH.profile);
  };

  return (
    <MainLayout>
      <PageWrapper>
        <PageTitle>تعديل الملف الشخصي</PageTitle>

        <Card>
          {/* Avatar Upload */}
          <AvatarSection>
            <AvatarUpload onClick={() => fileRef.current?.click()}>
              {preview
                ? <img src={preview} alt="avatar" />
                : <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
              }
              <AvatarOverlay className="overlay">
                <Camera size={20} />
              </AvatarOverlay>
            </AvatarUpload>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
                صورة الملف الشخصي
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94A3B8' }}>
                اضغط لتغيير الصورة
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </AvatarSection>

          {/* Form */}
          <FormGrid>
            <Input
              id="name"
              label="الاسم الكامل"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              id="email"
              type="email"
              label="البريد الإلكتروني"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              dir="ltr"
              {...register('email')}
            />
            <Input
              id="phone"
              type="tel"
              label="رقم الهاتف"
              leftIcon={<Phone size={16} />}
              error={errors.phone?.message}
              dir="ltr"
              {...register('phone')}
            />
            <div>
              <Label htmlFor="bio">
                <FileText size={14} style={{ display: 'inline', marginLeft: 4 }} />
                نبذة شخصية
              </Label>
              <Textarea
                id="bio"
                placeholder="اكتب نبذة مختصرة عن نفسك..."
                {...register('bio')}
              />
            </div>
          </FormGrid>

          <Actions>
            <Button variant="ghost" onClick={() => navigate(PATH.profile)}>
              إلغاء
            </Button>
            <Button
              isLoading={updateMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              حفظ التغييرات
            </Button>
          </Actions>
        </Card>
      </PageWrapper>
    </MainLayout>
  );
}