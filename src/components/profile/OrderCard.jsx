import { useI18n } from '../../contexts/I18nContext'

const OrderCard = ({ order }) => {
  const { t } = useI18n()

  const getStatusDisplay = (status) => {
    const statusKey = `profile.status.${status}`
    return t(statusKey)
  }

  return (
    <div className="order-card">
      <div className="order-header">
        <span className="order-id">{t('profile.order_number')}{order.id}</span>
        <span className="order-date">
          {new Date(order.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="order-details">
        <p><strong>{t('profile.order_status')}</strong> {getStatusDisplay(order.status)}</p>
        <p><strong>{t('profile.order_total')}</strong> {order.total_amount.toFixed(2)} сом.</p>
        <p><strong>{t('profile.order_items')}</strong> {order.items?.length || 0}</p>
      </div>
    </div>
  )
}

export default OrderCard

