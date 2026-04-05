import { useI18n } from '../../contexts/I18nContext'

const OrderPagination = ({ page, totalPages, total, onPageChange }) => {
  const { t } = useI18n()

  if (totalPages <= 1) return null

  return (
    <div style={{
      marginTop: '30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px'
    }}>
      <div style={{ fontSize: '14px', color: '#666' }}>
        {t('profile.page_of').replace('{page}', page).replace('{total}', totalPages)}
        {' '}({total} {total === 1 ? 'order' : 'orders'})
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="btn btn-sm"
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            opacity: page === 1 ? 0.5 : 1
          }}
        >
          ← {t('common.previous')}
        </button>

        <span style={{ fontSize: '14px', fontWeight: '500' }}>
          {page} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="btn btn-sm"
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
            opacity: page === totalPages ? 0.5 : 1
          }}
        >
          {t('common.next')} →
        </button>
      </div>
    </div>
  )
}

export default OrderPagination

