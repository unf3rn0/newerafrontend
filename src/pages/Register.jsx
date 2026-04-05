import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useI18n } from '../contexts/I18nContext'

const Register = () => {
  const { register } = useAuth()
  const { success, error } = useToast()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      error(t('auth.passwords_no_match'))
      return
    }

    setLoading(true)

    try {
      await register(formData.username, formData.email, formData.password)
      success(t('auth.register_success'))
      navigate('/')
    } catch (err) {
      const errorKey = err.response?.data?.detail
      // Backend returns translation keys directly
      error(t(errorKey) || t('auth.register_failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>{t('auth.register')}</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('auth.username')}</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>{t('auth.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>{t('auth.password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>{t('auth.confirm_password')}</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? t('common.loading') : t('auth.register')}
            </button>
          </form>
          <p className="auth-link">
            {t('auth.have_account')} <Link to="/login">{t('auth.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

