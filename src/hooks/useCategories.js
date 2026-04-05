import { useState } from 'react'
import { categoriesAPI } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import { useI18n } from '../contexts/I18nContext'

export const useCategories = () => {
  const { success, error } = useToast()
  const { t } = useI18n()
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    gender: 'male'
  })

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll()
      setCategories(response.data)
    } catch (err) {
      error(t('admin.categories_load_failed'))
      console.error(err)
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, categoryForm)
        success(t('admin.category_updated'))
      } else {
        await categoriesAPI.create(categoryForm)
        success(t('admin.category_created'))
      }

      resetCategoryForm()
      await loadCategories()
      return true
    } catch (err) {
      const errorKey = err.response?.data?.detail
      // Backend returns translation keys directly
      error(t(errorKey) || t('admin.categories_load_failed'))
      return false
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm(t('common.confirm_delete'))) return

    try {
      await categoriesAPI.delete(id)
      success(t('admin.category_deleted'))
      await loadCategories()
    } catch (err) {
      const errorKey = err.response?.data?.detail
      // Backend returns translation keys directly
      error(t(errorKey) || t('admin.categories_load_failed'))
    }
  }

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        name: category.name,
        gender: category.gender
      })
    } else {
      resetCategoryForm()
    }
  }

  const resetCategoryForm = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: '',
      gender: 'male'
    })
  }

  return {
    categories,
    editingCategory,
    categoryForm,
    setCategoryForm,
    loadCategories,
    handleCategorySubmit,
    handleDeleteCategory,
    openCategoryModal,
    resetCategoryForm
  }
}

