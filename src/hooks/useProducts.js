import { useState } from 'react'
import { productsAPI } from '../services/api'
import { useToast } from '../contexts/ToastContext'
import { useI18n } from '../contexts/I18nContext'

export const useProducts = () => {
  const { success, error } = useToast()
  const { t } = useI18n()
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discount_percentage: 0,
    category_id: '',
    image_url: '',
    images: []
  })

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll()
      setProducts(response.data)
    } catch (err) {
      error(t('admin.products_load_failed'))
      console.error(err)
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        discount_percentage: parseFloat(productForm.discount_percentage),
        category_id: parseInt(productForm.category_id),
        images: productForm.images.filter(img => img.trim() !== '')
      }

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, data)
        success(t('admin.product_updated'))
      } else {
        await productsAPI.create(data)
        success(t('admin.product_created'))
      }

      resetProductForm()
      await loadProducts()
      return true
    } catch (err) {
      const errorKey = err.response?.data?.detail
      // Backend returns translation keys directly
      error(t(errorKey) || t('admin.products_load_failed'))
      return false
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm(t('common.confirm_delete'))) return

    try {
      await productsAPI.delete(id)
      success(t('admin.product_deleted'))
      await loadProducts()
    } catch (err) {
      const errorKey = err.response?.data?.detail
      // Backend returns translation keys directly
      error(t(errorKey) || t('admin.product_delete_failed'))
    }
  }

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        discount_percentage: product.discount_percentage || 0,
        category_id: product.category_id.toString(),
        image_url: product.image_url || '',
        images: product.images || []
      })
    } else {
      resetProductForm()
    }
  }

  const resetProductForm = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      description: '',
      price: '',
      discount_percentage: 0,
      category_id: '',
      image_url: '',
      images: []
    })
  }

  return {
    products,
    editingProduct,
    productForm,
    setProductForm,
    loadProducts,
    handleProductSubmit,
    handleDeleteProduct,
    openProductModal,
    resetProductForm
  }
}

