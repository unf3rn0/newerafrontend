import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useI18n } from '../contexts/I18nContext'
import { categoriesAPI } from '../services/api'
import { CartIcon, UserIcon, LogOutIcon, ShoppingBagIcon } from './Icons'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { getItemCount } = useCart()
  const { t, language, changeLanguage } = useI18n()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [showMensDropdown, setShowMensDropdown] = useState(false)
  const [showWomensDropdown, setShowWomensDropdown] = useState(false)
  const mensDropdownRef = useRef(null)
  const womensDropdownRef = useRef(null)

  useEffect(() => {
    loadCategories()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mensDropdownRef.current && !mensDropdownRef.current.contains(event.target)) {
        setShowMensDropdown(false)
      }
      if (womensDropdownRef.current && !womensDropdownRef.current.contains(event.target)) {
        setShowWomensDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll()
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const mensCategories = categories.filter(cat => cat.gender === 'male')
  const womensCategories = categories.filter(cat => cat.gender === 'female')

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Newera" />
          </Link>

          <Link to="/" className="nav-link">
            {t('nav.home')}
          </Link>

          <div className="nav-dropdown" ref={mensDropdownRef}>
            <button
              className="nav-link"
              onClick={() => setShowMensDropdown(!showMensDropdown)}
            >
              {t('nav.mens')} ▾
            </button>
            {showMensDropdown && (
              <div className="dropdown-content">
                <Link
                  to="/men"
                  onClick={() => setShowMensDropdown(false)}
                >
                  {t('nav.all_mens')}
                </Link>
                {mensCategories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/men/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setShowMensDropdown(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="nav-dropdown" ref={womensDropdownRef}>
            <button
              className="nav-link"
              onClick={() => setShowWomensDropdown(!showWomensDropdown)}
            >
              {t('nav.womens')} ▾
            </button>
            {showWomensDropdown && (
              <div className="dropdown-content">
                <Link
                  to="/women"
                  onClick={() => setShowWomensDropdown(false)}
                >
                  {t('nav.all_womens')}
                </Link>
                {womensCategories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/women/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setShowWomensDropdown(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/cart" className="cart-link">
            <CartIcon size={22} />
            {getItemCount() > 0 && (
              <span className="cart-badge">{getItemCount()}</span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="nav-link">
                <UserIcon size={20} />
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  <ShoppingBagIcon size={20} />
                </Link>
              )}
              <button onClick={handleLogout} className="nav-link btn-link">
                <LogOutIcon size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <UserIcon size={20} />
              </Link>
              <Link to="/register" className="btn btn-primary">
                {t('nav.register')}
              </Link>
            </>
          )}

          <div className="language-selector-wrapper">
            <i className="fas fa-globe language-icon"></i>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="language-selector"
            >
              <option value="en">{t('nav.language.en')}</option>
              <option value="ru">{t('nav.language.ru')}</option>
              <option value="tj">{t('nav.language.tj')}</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

