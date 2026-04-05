import { useState, useEffect } from 'react'
import { useI18n } from '../contexts/I18nContext'
import { paymentAPI } from '../services/api'

const PaymentMethodSelector = ({ value, onChange, disabled = false }) => {
  const { t } = useI18n()
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      const response = await paymentAPI.getMethods()
      setMethods(response.data)
      
      // Auto-select first method if none selected
      if (response.data.length > 0 && !value) {
        onChange(response.data[0])
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="payment-method-selector loading">Loading...</div>
  }

  if (methods.length === 0) {
    return (
      <div className="payment-method-selector empty">
        <p>{t('payment.no_methods')}</p>
      </div>
    )
  }

  return (
    <div className="payment-method-selector">
      <label htmlFor="payment-method">{t('payment.select_method')}</label>
      <select
        id="payment-method"
        value={value || ''}
        onChange={(e) => {
          const selectedId = Number(e.target.value)
          const selectedMethod = methods.find((method) => method.id === selectedId) || null
          onChange(selectedMethod)
        }}
        disabled={disabled}
        className="form-control"
      >
        {methods.map((method) => (
          <option key={method.id} value={method.id}>
            {method.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default PaymentMethodSelector
