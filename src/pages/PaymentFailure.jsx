import { useNavigate, useSearchParams } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'

const PaymentFailure = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const orderId = searchParams.get('order_id')

  return (
    <div className="payment-result-page">
      <div className="container">
        <div className="payment-result failure">
          <div className="icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="40" fill="#f44336" />
              <path 
                d="M30 30L50 50M50 30L30 50" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          <h1>{t('payment.failure_title')}</h1>
          <p className="message">{t('payment.failure_message')}</p>
          
          {orderId && (
            <div className="order-details">
              <p><strong>{t('profile.order_number')}</strong> {orderId}</p>
            </div>
          )}
          
          <div className="actions">
            <button 
              onClick={() => navigate('/cart')} 
              className="btn btn-primary btn-lg"
            >
              {t('payment.try_again')}
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              className="btn btn-secondary btn-lg"
            >
              {t('payment.return_to_orders')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailure

