import { useState } from 'react'
import { useI18n } from '../../contexts/I18nContext'

const UsersTab = ({
  users,
  total,
  page,
  totalPages,
  onPageChange,
  onSearch,
  onBanUser,
  onUnbanUser
}) => {
  const { t } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleBan = (user) => {
    if (window.confirm(t('admin.confirm_ban'))) {
      onBanUser(user.id)
    }
  }

  const handleUnban = (user) => {
    if (window.confirm(t('admin.confirm_unban'))) {
      onUnbanUser(user.id)
    }
  }

  return (
    <div className="admin-section">
      <h2>{t('admin.users')}</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('admin.users_search_placeholder')}
          className="form-control"
          style={{
            maxWidth: '500px',
            padding: '10px 15px',
            fontSize: '14px',
            border: '2px solid var(--border)',
            borderRadius: '8px'
          }}
        />
      </form>

      {/* Users Table */}
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>{t('admin.table.id')}</th>
              <th>{t('admin.table.username')}</th>
              <th>{t('admin.table.email')}</th>
              <th>{t('admin.table.admin')}</th>
              <th>{t('admin.table.status')}</th>
              <th>{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  {t('products.no_products')}
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.is_admin ? t('common.yes') : t('common.no')}</td>
                  <td>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: user.is_banned ? '#fee' : '#efe',
                      color: user.is_banned ? '#c33' : '#3c3'
                    }}>
                      {user.is_banned ? t('admin.status.banned') : t('admin.status.active')}
                    </span>
                  </td>
                  <td>
                    {user.is_banned ? (
                      <button
                        onClick={() => handleUnban(user)}
                        className="btn btn-sm btn-success"
                        style={{
                          padding: '6px 12px',
                          fontSize: '13px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {t('admin.unban_user')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBan(user)}
                        className="btn btn-sm btn-danger"
                        style={{
                          padding: '6px 12px',
                          fontSize: '13px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {t('admin.ban_user')}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}>
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

          <span style={{ fontSize: '14px', color: '#666' }}>
            Page {page} of {totalPages} ({total} users)
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
      )}
    </div>
  )
}

export default UsersTab

