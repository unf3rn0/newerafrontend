import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useI18n } from '../contexts/I18nContext'

const Login = () => {
  const { login } = useAuth()
  const { success, error } = useToast()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(formData.username, formData.password)
      success(t('auth.login_success'))
      navigate('/')
    } catch (err) {
      const errorKey = err.response?.data?.detail
      // Backend returns translation keys directly
      error(t(errorKey) || t('auth.login_failed'))
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
          <h1>{t('auth.login')}</h1>
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
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? t('common.loading') : t('auth.login')}
            </button>
          </form>
          <p className="auth-link">
            {t('auth.no_account')} <Link to="/register">{t('auth.register')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

