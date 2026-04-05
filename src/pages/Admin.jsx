import { useState, useEffect } from 'react'
import { useI18n } from '../contexts/I18nContext'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useUsers } from '../hooks/useUsers'
import ProductsTab from '../components/admin/ProductsTab'
import CategoriesTab from '../components/admin/CategoriesTab'
import UsersTab from '../components/admin/UsersTab'
import ProductModal from '../components/admin/ProductModal'
import CategoryModal from '../components/admin/CategoryModal'

const Admin = () => {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const {
    products,
    editingProduct,
    productForm,
    setProductForm,
    loadProducts,
    handleProductSubmit,
    handleDeleteProduct,
    openProductModal,
    resetProductForm
  } = useProducts()

  const {
    categories,
    editingCategory,
    categoryForm,
    setCategoryForm,
    loadCategories,
    handleCategorySubmit,
    handleDeleteCategory,
    openCategoryModal,
    resetCategoryForm
  } = useCategories()

  const {
    users,
    usersTotal,
    usersPage,
    usersTotalPages,
    loadUsers,
    handleUsersPageChange,
    handleUsersSearch,
    handleBanUser,
    handleUnbanUser
  } = useUsers()

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      await loadCategories()
      if (activeTab === 'products') {
        await loadProducts()
      } else if (activeTab === 'users') {
        await loadUsers()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleProductEdit = (product) => {
    openProductModal(product)
    setShowProductModal(true)
  }

  const handleCategoryEdit = (category) => {
    openCategoryModal(category)
    setShowCategoryModal(true)
  }

  const handleProductModalSubmit = async (e) => {
    const success = await handleProductSubmit(e)
    if (success) {
      setShowProductModal(false)
    }
  }

  const handleCategoryModalSubmit = async (e) => {
    const success = await handleCategorySubmit(e)
    if (success) {
      setShowCategoryModal(false)
    }
  }

  const handleProductModalClose = () => {
    setShowProductModal(false)
    resetProductForm()
  }

  const handleCategoryModalClose = () => {
    setShowCategoryModal(false)
    resetCategoryForm()
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1>{t('admin.title')}</h1>

        <div className="admin-tabs">
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            {t('admin.products')}
          </button>
          <button
            className={activeTab === 'categories' ? 'active' : ''}
            onClick={() => setActiveTab('categories')}
          >
            {t('admin.categories')}
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            {t('admin.users')}
          </button>
        </div>

        {loading ? (
          <div className="loading">{t('common.loading')}</div>
        ) : (
          <>
            {activeTab === 'products' && (
              <ProductsTab
                products={products}
                onEdit={handleProductEdit}
                onDelete={handleDeleteProduct}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesTab
                categories={categories}
                onEdit={handleCategoryEdit}
                onDelete={handleDeleteCategory}
              />
            )}

            {activeTab === 'users' && (
              <UsersTab
                users={users}
                total={usersTotal}
                page={usersPage}
                totalPages={usersTotalPages}
                onPageChange={handleUsersPageChange}
                onSearch={handleUsersSearch}
                onBanUser={handleBanUser}
                onUnbanUser={handleUnbanUser}
              />
            )}
          </>
        )}
      </div>

      <ProductModal
        show={showProductModal}
        onClose={handleProductModalClose}
        onSubmit={handleProductModalSubmit}
        productForm={productForm}
        setProductForm={setProductForm}
        categories={categories}
        isEditing={!!editingProduct}
      />

      <CategoryModal
        show={showCategoryModal}
        onClose={handleCategoryModalClose}
        onSubmit={handleCategoryModalSubmit}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        isEditing={!!editingCategory}
      />
    </div>
  )
}

export default Admin

