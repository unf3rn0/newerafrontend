import { useI18n } from '../../contexts/I18nContext'

const OrderFilters = ({ statusFilter, dateFrom, dateTo, onStatusChange, onDateFromChange, onDateToChange, onClear }) => {
  const { t } = useI18n()

  return (
    <div className="orders-filters" style={{
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: 'var(--card-bg)',
      borderRadius: '8px',
      border: '1px solid var(--border)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            {t('profile.filter_status')}
          </label>
          <select
            value={statusFilter}
            onChange={onStatusChange}
            className="form-control"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              border: '2px solid var(--border)',
              borderRadius: '6px'
            }}
          >
            <option value="">{t('profile.filter_all')}</option>
            <option value="pending">{t('profile.status.pending')}</option>
            <option value="completed">{t('profile.status.completed')}</option>
            <option value="cancelled">{t('profile.status.cancelled')}</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            {t('profile.filter_date_from')}
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={onDateFromChange}
            className="form-control"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              border: '2px solid var(--border)',
              borderRadius: '6px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            {t('profile.filter_date_to')}
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={onDateToChange}
            className="form-control"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              border: '2px solid var(--border)',
              borderRadius: '6px'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            onClick={onClear}
            className="btn btn-secondary"
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              width: '100%'
            }}
          >
            {t('profile.filter_clear')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderFilters

