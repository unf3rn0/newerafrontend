import { useI18n } from '../../contexts/I18nContext'

const CategoriesTab = ({ categories, onEdit, onDelete }) => {
  const { t } = useI18n()

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>{t('admin.categories')}</h2>
        <button onClick={() => onEdit(null)} className="btn btn-primary">
          {t('admin.add_category')}
        </button>
      </div>
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>{t('admin.table.id')}</th>
              <th>{t('admin.table.name')}</th>
              <th>{t('admin.table.gender')}</th>
              <th>{t('admin.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.gender === 'male' ? t('admin.gender.male') : t('admin.gender.female')}</td>
                <td>
                  <button onClick={() => onEdit(category)} className="btn btn-sm">
                    {t('common.edit')}
                  </button>
                  <button onClick={() => onDelete(category.id)} className="btn btn-danger btn-sm">
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

export default CategoriesTab

