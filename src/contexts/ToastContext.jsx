import { createContext, useContext, useState } from 'react'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (message) => addToast(message, 'success')
  const error = (message) => addToast(message, 'error')
  const info = (message) => addToast(message, 'info')
  const warning = (message) => addToast(message, 'warning')

  const value = {
    toasts,
    success,
    error,
    info,
    warning,
    removeToast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
            <button onClick={() => removeToast(toast.id)} className="toast-close">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

