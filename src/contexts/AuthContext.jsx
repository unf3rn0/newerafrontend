import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const response = await authAPI.getCurrentUser()
        setUser(response.data)
      } catch (error) {
        localStorage.removeItem('authToken')
      }
    }
    setLoading(false)
  }

  const login = async (username, password) => {
    const response = await authAPI.login(username, password)
    localStorage.setItem('authToken', response.data.access_token)
    const userResponse = await authAPI.getCurrentUser()
    setUser(userResponse.data)
    return userResponse.data
  }

  const register = async (username, email, password) => {
    await authAPI.register(username, email, password)
    return login(username, password)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('cart')
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser(userData)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

