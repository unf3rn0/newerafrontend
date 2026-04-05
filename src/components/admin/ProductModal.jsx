import { useI18n } from '../../contexts/I18nContext'

const ProductModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  productForm, 
  setProductForm, 
  categories, 
  isEditing 
}) => {
  const { t } = useI18n()

  if (!show) return null

  const handleImageAdd = () => {
    setProductForm({
      ...productForm,
      images: [...productForm.images, '']
    })
  }

  const handleImageChange = (index, value) => {
    const newImages = [...productForm.images]
    newImages[index] = value
    setProductForm({
      ...productForm,
      images: newImages
    })
  }

  const handleImageRemove = (index) => {
    const newImages = productForm.images.filter((_, i) => i !== index)
    setProductForm({
      ...productForm,
      images: newImages
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? t('admin.edit_product') : t('admin.add_product')}</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>{t('admin.form.name')}</label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>{t('admin.form.description')}</label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="form-control"
              rows="3"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('admin.form.price')}</label>
              <input
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>{t('admin.form.discount')}</label>
              <input
                type="number"
                min="0"
                max="100"
                value={productForm.discount_percentage}
                onChange={(e) => setProductForm({ ...productForm, discount_percentage: e.target.value })}
                className="form-control"
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('admin.form.category')}</label>
            <select
              value={productForm.category_id}
              onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
              required
              className="form-control"
            >
              <option value="">{t('admin.form.select_category')}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.gender === 'male' ? t('admin.gender.male') : t('admin.gender.female')})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>{t('admin.form.images')}</label>
            {productForm.images.map((img, index) => (
              <div key={index} className="image-input-group">
                <input
                  type="url"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder={t('admin.form.image_url')}
                  className="form-control"
                />
                <button type="button" onClick={() => handleImageRemove(index)} className="btn btn-danger btn-sm">
                  {t('admin.form.remove')}
                </button>
              </div>
            ))}
            <button type="button" onClick={handleImageAdd} className="btn btn-secondary btn-sm">
              {t('admin.form.add_image')}
            </button>
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

export default ProductModal

