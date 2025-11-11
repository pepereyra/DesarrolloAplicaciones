import './CategoryFilter.css';

function CategoryFilter({ categories, selectedCategory, onCategoryChange, sortBy, onSortChange }) {
  return (
    <div className="category-filter">
      <div className="filter-section">
        <h3>Filtrar por categoría</h3>
        <div className="category-buttons">
          <button
            className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => onCategoryChange('')}
          >
            Todas las categorías
          </button>
          {categories.map(categoria => (
            <button
              key={categoria.id || categoria.name}
              className={`category-btn ${selectedCategory === categoria.name ? 'active' : ''}`}
              onClick={() => onCategoryChange(categoria.name)}
            >
              {categoria.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="sort-section">
        <label htmlFor="sort-select">Ordenar por:</label>
        <select 
          id="sort-select"
          value={sortBy} 
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="name-asc">Nombre A-Z</option>
          <option value="name-desc">Nombre Z-A</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
        </select>
      </div>
    </div>
  );
}

export default CategoryFilter;
