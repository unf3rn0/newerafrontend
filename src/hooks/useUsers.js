import { useState } from 'react'
import { useI18n } from '../contexts/I18nContext'
import { useToast } from '../contexts/ToastContext'
import { adminAPI } from '../services/api'

export const useUsers = () => {
  const { t } = useI18n()
  const { error, success } = useToast()
  const [users, setUsers] = useState([])
  const [usersTotal, setUsersTotal] = useState(0)
  const [usersPage, setUsersPage] = useState(1)
  const [usersTotalPages, setUsersTotalPages] = useState(1)
  const [usersSearch, setUsersSearch] = useState('')

  const loadUsers = async () => {
    try {
      const params = {
        page: usersPage,
        page_size: 20
      }
      if (usersSearch) {
        params.search = usersSearch
      }
      const usersRes = await adminAPI.getUsers(params)
      setUsers(usersRes.data.users)
      setUsersTotal(usersRes.data.total)
      setUsersTotalPages(usersRes.data.total_pages)
    } catch (err) {
      error(t('admin.load_failed'))
      console.error(err)
    }
  }

  const handleUsersPageChange = (newPage) => {
    setUsersPage(newPage)
  }

  const handleUsersSearch = (searchTerm) => {
    setUsersSearch(searchTerm)
    setUsersPage(1)
  }

  const handleBanUser = async (userId) => {
    try {
      await adminAPI.banUser(userId)
      success(t('admin.user_banned'))
      await loadUsers()
    } catch (err) {
      if (err.response?.data?.detail === 'admin.cannot_ban_self') {
        error(t('admin.cannot_ban_self'))
      } else {
        error(t('admin.load_failed'))
      }
      console.error(err)
    }
  }

  const handleUnbanUser = async (userId) => {
    try {
      await adminAPI.unbanUser(userId)
      success(t('admin.user_unbanned'))
      await loadUsers()
    } catch (err) {
      error(t('admin.load_failed'))
      console.error(err)
    }
  }

  return {
    users,
    usersTotal,
    usersPage,
    usersTotalPages,
    usersSearch,
    loadUsers,
    handleUsersPageChange,
    handleUsersSearch,
    handleBanUser,
    handleUnbanUser
  }
}

