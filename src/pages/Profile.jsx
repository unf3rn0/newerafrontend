import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useI18n } from '../contexts/I18nContext'
import { ordersAPI } from '../services/api'
import ProfileInfo from '../components/profile/ProfileInfo'
import OrderFilters from '../components/profile/OrderFilters'
import OrderCard from '../components/profile/OrderCard'
import OrderPagination from '../components/profile/OrderPagination'

const Profile = () => {
  const { user } = useAuth()
  const { t } = useI18n()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    loadOrders()
  }, [page, statusFilter, dateFrom, dateTo])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const params = { page, page_size: pageSize }
      if (statusFilter) params.status = statusFilter
      if (dateFrom) params.date_from = dateFrom
      if (dateTo) params.date_to = dateTo

      const response = await ordersAPI.getAll(params)
      setOrders(response.data.orders)
      setTotal(response.data.total)
      setTotalPages(response.data.total_pages)
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
  }

  const handleClearFilters = () => {
    setStatusFilter('')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>{t('profile.title')}</h1>

        <ProfileInfo user={user} />

        <div className="orders-section">
          <h2>{t('profile.order_history')}</h2>

          <OrderFilters
            statusFilter={statusFilter}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onStatusChange={handleFilterChange(setStatusFilter)}
            onDateFromChange={handleFilterChange(setDateFrom)}
            onDateToChange={handleFilterChange(setDateTo)}
            onClear={handleClearFilters}
          />

          {loading ? (
            <div className="loading">{t('common.loading')}</div>
          ) : orders.length === 0 ? (
            <p>{t('profile.no_orders')}</p>
          ) : (
            <>
              <div className="orders-list">
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>

              <OrderPagination
                page={page}
                totalPages={totalPages}
                total={total}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

