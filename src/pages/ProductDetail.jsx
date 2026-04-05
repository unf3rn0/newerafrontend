import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsAPI } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useI18n } from '../contexts/I18nContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { success, error } = useToast()
  const { t } = useI18n()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getById(id)
      setProduct(response.data)
    } catch (error) {
      console.error('Failed to load product:', error)
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      error(t('auth.login_required'))
      navigate('/login')
      return
    }

    addToCart(product)
    success(t('products.add_to_cart'))
  }

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>
  }

  if (!product) {
    return <div className="error">{t('products.not_found')}</div>
  }

  const finalPrice = product.discount_percentage > 0
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url || '/placeholder.svg']

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          {t('products.back')}
        </button>
        
        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <img src={images[selectedImage]} alt={product.name} />
              {product.discount_percentage > 0 && (
                <span className="discount-badge">-{product.discount_percentage}%</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="product-description">{product.description}</p>
            
            <div className="product-price-section">
              <div className="price-info">
                <span className="current-price">{finalPrice.toFixed(2)} сом.</span>
                {product.discount_percentage > 0 && (
                  <span className="original-price">{product.price.toFixed(2)} сом.</span>
                )}
              </div>
              {product.discount_percentage > 0 && (
                <span className="savings">
                  {t('products.you_save')} {(product.price - finalPrice).toFixed(2)} сом.
                </span>
              )}
            </div>

            <button onClick={handleAddToCart} className="btn btn-primary btn-lg">
              {t('products.add_to_cart')}
            </button>

            {product.category && (
              <div className="product-meta">
                <p><strong>{t('products.category')}</strong> {product.category.name}</p>
                <p><strong>{t('products.gender')}</strong> {product.category.gender === 'male' ? t('admin.gender.male') : t('admin.gender.female')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

