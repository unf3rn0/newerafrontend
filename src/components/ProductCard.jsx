import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useI18n } from '../contexts/I18nContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { success, error } = useToast()
  const { t } = useI18n()
  const navigate = useNavigate()

  const handleAddToCart = (e) => {
    e.preventDefault()

    if (!user) {
      error(t('auth.login_required'))
      navigate('/login')
      return
    }

    addToCart(product)
    success(t('products.add_to_cart'))
  }

  const finalPrice = product.discount_percentage > 0
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.image_url || '/placeholder.svg'

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link">
        <img src={imageUrl} alt={product.name} className="product-image" />
        {product.discount_percentage > 0 && (
          <span className="discount-badge">-{product.discount_percentage}%</span>
        )}
      </Link>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div className="product-price">
            <span className="price">{finalPrice.toFixed(2)} сом.</span>
            {product.discount_percentage > 0 && (
              <span className="original-price">{product.price.toFixed(2)} сом.</span>
            )}
          </div>
          <button onClick={handleAddToCart} className="btn btn-primary btn-sm">
            {t('products.add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

