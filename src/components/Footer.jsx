import { useI18n } from '../contexts/I18nContext'
import { FacebookIcon, InstagramIcon, TikTokIcon } from './Icons'

const Footer = () => {
  const { t } = useI18n()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t('footer.brand')}</h3>
            <p>{t('footer.tagline')}</p>
          </div>
          <div className="footer-section">
            <h4>{t('footer.contact')}</h4>
            <p>{t('footer.phone')}</p>
          </div>
          <div className="footer-section">
            <h4>{t('footer.follow')}</h4>
            <div className="social-links">
              <a href="https://facebook.com/newera" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon size={24} />
              </a>
              <a href="https://www.instagram.com/newerafashionhouse" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon size={24} />
              </a>
              <a href="https://tiktok.com/@newera" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <TikTokIcon size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
