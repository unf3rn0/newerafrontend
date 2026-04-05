import { useI18n } from '../../contexts/I18nContext'

const ProfileInfo = ({ user }) => {
  const { t } = useI18n()

  return (
    <div className="profile-info">
      <h2>{t('profile.account_info')}</h2>
      <p><strong>{t('profile.username')}</strong> {user?.username}</p>
      <p><strong>{t('profile.email')}</strong> {user?.email}</p>
      <p><strong>{t('profile.role')}</strong> {user?.is_admin ? t('profile.role_admin') : t('profile.role_user')}</p>
    </div>
  )
}

export default ProfileInfo

