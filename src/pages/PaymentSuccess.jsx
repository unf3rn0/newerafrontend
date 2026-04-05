import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'

const PaymentSuccess = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const orderId = searchParams.get('order_id')
  const amount = searchParams.get('amount')
  const currency = searchParams.get('currency')

  useEffect(() => {
    // Optional: You could verify the payment status with your backend here
  }, [orderId])

  return (
    <div className="payment-result-page">
      <div className="container">
        <div className="payment-result success">
          <div className="icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="40" fill="#4CAF50" />
              <path 
                d="M25 40L35 50L55 30" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <h1>{t('payment.success_title')}</h1>
          <p className="message">{t('payment.success_message')}</p>
          
          {orderId && (
            <div className="order-details">
              <p><strong>{t('profile.order_number')}</strong> {orderId}</p>
              {amount && currency && (
                <p><strong>{t('cart.total')}:</strong> {amount} {currency}</p>
              )}
            </div>
          )}
          
          <div className="actions">
            <button 
              onClick={() => navigate('/profile')} 
              className="btn btn-primary btn-lg"
            >
              {t('payment.return_to_orders')}
            </button>
            <button 
              onClick={() => navigate('/products')} 
              className="btn btn-secondary btn-lg"
            >
              {t('cart.continue_shopping')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess

