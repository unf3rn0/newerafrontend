import { useI18n } from '../../contexts/I18nContext'

const ProductsTab = ({ products, onEdit, onDelete }) => {
  const { t } = useI18n()

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>{t('admin.products')}</h2>
        <button onClick={() => onEdit(null)} className="btn btn-primary">
          {t('admin.add_product')}
        </button>
      </div>
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>{t('admin.table.id')}</th>
              <th>{t('admin.table.name')}</th>
              <th>{t('admin.table.price')}</th>
              <th>{t('admin.table.discount')}</th>
              <th>{t('admin.table.category')}</th>
              <th>{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price.toFixed(2)} сом.</td>
                <td>{product.discount_percentage}%</td>
                <td>{product.category?.name}</td>
                <td>
                  <button onClick={() => onEdit(product)} className="btn btn-sm">
                    {t('common.edit')}
                  </button>
                  <button onClick={() => onDelete(product.id)} className="btn btn-danger btn-sm">
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductsTab

