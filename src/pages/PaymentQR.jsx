import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'

const INSTAGRAM_URL = 'https://www.instagram.com/newerafashionhouse'
const INSTAGRAM_HANDLE = '@newerafashionhouse'
const SUPPORT_PHONE = '+992886870110'

const PaymentQR = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showContacts, setShowContacts] = useState(false)

  const orderId = searchParams.get('order_id')
  const amountRaw = searchParams.get('amount')
  const currency = searchParams.get('currency') || 'TJS'

  const formattedAmount = useMemo(() => {
    const amount = Number(amountRaw)
    if (!Number.isFinite(amount)) {
      return null
    }

    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }, [amountRaw])

  return (
    <div className="payment-result-page">
      <div className="container">
        <div className="payment-result qr-payment-card">
          <div className="qr-payment-header">
            <span className="qr-payment-badge">{t('payment.qr_method')}</span>
            <h1>{t('payment.qr_page_title')}</h1>
            <p className="message">{t('payment.qr_page_message')}</p>
          </div>

          <div className="qr-payment-layout">
            <div className="qr-payment-preview">
              <img
                src="/qr_digital.png"
                alt={t('payment.qr_method')}
                className="qr-payment-image"
              />
            </div>

            <div className="qr-payment-details">
              {orderId && (
                <div className="qr-payment-order">
                  <span>{t('profile.order_number')}</span>
                  <strong>{orderId}</strong>
                </div>
              )}

              <div className="qr-payment-amount-box">
                <span>{t('payment.qr_amount_label')}</span>
                <strong>
                  {formattedAmount ? `${formattedAmount} ${currency}` : t('payment.qr_amount_missing')}
                </strong>
              </div>

              <p className="qr-payment-note">{t('payment.qr_exact_amount')}</p>

              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                onClick={() => setShowContacts(true)}
              >
                {t('payment.qr_confirm_button')}
              </button>

              {showContacts && (
                <div className="qr-contact-card">
                  <h2>{t('payment.qr_contact_title')}</h2>
                  <p>{t('payment.qr_contact_message')}</p>
                  <div className="qr-contact-actions">
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      {t('payment.contact_instagram')} {INSTAGRAM_HANDLE}
                    </a>
                    <a href={`tel:${SUPPORT_PHONE}`} className="btn btn-secondary">
                      {t('payment.contact_phone')} {SUPPORT_PHONE}
                    </a>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="btn btn-secondary btn-lg btn-block"
                onClick={() => navigate('/profile')}
              >
                {t('payment.return_to_orders')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentQR
