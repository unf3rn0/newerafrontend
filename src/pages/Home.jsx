import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import { productsAPI } from '../services/api'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const { t } = useI18n()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll()
      setFeaturedProducts(response.data.slice(0, 6))
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{t('home.title')}</h1>
            <p className="hero-subtitle">{t('home.subtitle')}</p>
            <div className="hero-buttons">
              <Link to="/women" className="btn btn-primary btn-lg">
                {t('nav.womens')}
              </Link>
              <Link to="/men" className="btn btn-secondary btn-lg">
                {t('nav.mens')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>{t('home.featured')}</h2>
          {loading ? (
            <div className="loading">{t('common.loading')}</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

