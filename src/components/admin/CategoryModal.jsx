import { useI18n } from '../../contexts/I18nContext'

const CategoryModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  categoryForm, 
  setCategoryForm, 
  isEditing 
}) => {
  const { t } = useI18n()

  if (!show) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? t('admin.edit_category') : t('admin.add_category')}</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>{t('admin.form.name')}</label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>{t('admin.form.gender')}</label>
            <select
              value={categoryForm.gender}
              onChange={(e) => setCategoryForm({ ...categoryForm, gender: e.target.value })}
              required
              className="form-control"
            >
              <option value="male">{t('admin.gender.male')}</option>
              <option value="female">{t('admin.gender.female')}</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryModal

