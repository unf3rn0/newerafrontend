import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useI18n } from '../contexts/I18nContext'
import { ordersAPI, paymentAPI } from '../services/api'
import PaymentMethodSelector from '../components/PaymentMethodSelector'

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart()
  const { user } = useAuth()
  const { success, error } = useToast()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [payerPhone, setPayerPhone] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!selectedPaymentMethod) {
      error(t('payment.select_method'))
      return
    }

    if (selectedPaymentMethod.code === 'alif' && !payerPhone.trim()) {
      error(t('payment.phone_required'))
      return
    }

    setIsProcessing(true)

    try {
      // Create order
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.discount_percentage > 0
            ? item.price * (1 - item.discount_percentage / 100)
            : item.price
        })),
        payment_method_id: selectedPaymentMethod.id
      }

      const orderResponse = await ordersAPI.create(orderData)
      const order = orderResponse.data

      // Create payment
      const paymentData = {
        order_id: order.id,
        payment_method_code: selectedPaymentMethod.code,
        amount: order.total_amount,
        currency: selectedPaymentMethod.code === 'alif' ? 'TJS' : 'RUB',
        description: `Order #${order.id}`,
        email: user.email,
        language: user.preferred_language || 'ru',
        phone: selectedPaymentMethod.code === 'alif' ? payerPhone : undefined
      }

      const paymentResponse = await paymentAPI.createPayment(paymentData)
      const payment = paymentResponse.data

      if (payment.success && payment.payment_url) {
        // Clear cart and redirect to payment page
        clearCart()
        success(t('payment.redirect'))

        // Redirect to payment URL
        window.location.href = payment.payment_url
      } else {
        error(payment.message || t('payment.creation_failed'))
        setIsProcessing(false)
      }
    } catch (err) {
      error(t('cart.order_failed'))
      console.error(err)
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <h1>{t('cart.title')}</h1>
          <p>{t('cart.empty')}</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            {t('cart.continue_shopping')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>{t('cart.title')}</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => {
              const finalPrice = item.discount_percentage > 0
                ? item.price * (1 - item.discount_percentage / 100)
                : item.price

              return (
                <div key={item.id} className="cart-item">
                  <img 
                    src={item.images?.[0] || item.image_url || '/placeholder.svg'} 
                    alt={item.name} 
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">
                      {finalPrice.toFixed(2)} сом.
                      {item.discount_percentage > 0 && (
                        <span className="original-price"> {item.price.toFixed(2)} сом.</span>
                      )}
                    </p>
                  </div>
                  <div className="cart-item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn btn-sm"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn btn-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    {(finalPrice * item.quantity).toFixed(2)} сом.
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    {t('cart.remove')}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="cart-summary">
            <h2>{t('cart.order_summary')}</h2>
            <div className="summary-row">
              <span>{t('cart.subtotal')}</span>
              <span>{getTotal().toFixed(2)} сом.</span>
            </div>
            <div className="summary-row total">
              <span>{t('cart.total')}:</span>
              <span>{getTotal().toFixed(2)} сом.</span>
            </div>

            <div className="payment-method-section" style={{ marginTop: '20px', marginBottom: '20px' }}>
              <PaymentMethodSelector
                value={selectedPaymentMethod?.id || null}
                onChange={setSelectedPaymentMethod}
                disabled={isProcessing}
              />

              {selectedPaymentMethod?.code === 'alif' && (
                <div style={{ marginTop: '12px' }}>
                  <label htmlFor="payer-phone">{t('payment.phone_label')}</label>
                  <input
                    id="payer-phone"
                    type="tel"
                    className="form-control"
                    placeholder={t('payment.phone_placeholder')}
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-lg btn-block"
              disabled={isProcessing || !selectedPaymentMethod}
            >
              {isProcessing ? t('payment.processing') : t('cart.checkout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
