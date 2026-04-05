import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { productsAPI } from '../services/api'
import { useI18n } from '../contexts/I18nContext'
import ProductCard from '../components/ProductCard'

const Products = ({ gender: propGender }) => {
  const { t } = useI18n()
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Determine gender from props (from route) or default to null (all products)
  const gender = propGender || null

  useEffect(() => {
    loadProducts()
  }, [gender, category])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const params = {}

      if (gender) params.gender = gender
      if (category) params.search = category

      const response = await productsAPI.getAll(params)
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const params = { search }
      if (gender) params.gender = gender

      const response = await productsAPI.getAll(params)
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to search products:', error)
    } finally {
      setLoading(false)
    }
  }

  const pageTitle = gender === 'male' ? t('products.mens_collection') :
                    gender === 'female' ? t('products.womens_collection') :
                    t('products.all')

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="container">
          <h1>{pageTitle}</h1>
        </div>
      </div>

      <div className="container">
        <form onSubmit={handleSearch} style={{ marginBottom: '40px', textAlign: 'center' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('products.search_placeholder')}
            className="form-control"
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              padding: '14px 20px',
              fontSize: '16px',
              border: '2px solid var(--border)',
              borderRadius: '50px'
            }}
          />
        </form>

        {loading ? (
          <div className="loading">{t('products.loading')}</div>
        ) : products.length === 0 ? (
          <div className="error">{t('products.no_products')}</div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products

