import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories, stores } from '../data/mockData';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedStore, setSelectedStore] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search'));
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedStore) {
      result = result.filter(p => p.storeId === parseInt(selectedStore));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => {
          const discA = (a.originalPrice - a.price) / a.originalPrice;
          const discB = (b.originalPrice - b.price) / b.originalPrice;
          return discB - discA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedStore, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStore('');
    setPriceRange([0, 10000]);
    setSortBy('relevance');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedStore || priceRange[0] > 0 || priceRange[1] < 10000;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50 md:hidden"
              >
                <SlidersHorizontal size={20} />
                Filtros
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="relevance">Relevância</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Melhor Avaliação</option>
                <option value="discount">Maior Desconto</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {selectedCategory && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('')}>
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedStore && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {stores.find(s => s.id === parseInt(selectedStore))?.name}
                  <button onClick={() => setSelectedStore('')}>
                    <X size={14} />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-gray-500 hover:text-primary text-sm underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-xl p-4 shadow-sm sticky top-36">
              <h3 className="font-semibold text-dark mb-4">Categorias</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Todas
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <h3 className="font-semibold text-dark mb-4 mt-6">Lojas</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedStore('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedStore ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Todas
                </button>
                {stores.map(store => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store.id.toString())}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedStore === store.id.toString() ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {store.name}
                  </button>
                ))}
              </div>

              <h3 className="font-semibold text-dark mb-4 mt-6">Faixa de Preço</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={priceRange[0] || ''}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={priceRange[1] === 10000 ? '' : priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-4 text-gray-600">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">Nenhum produto encontrado</p>
                <button
                  onClick={clearFilters}
                  className="text-primary hover:underline"
                >
                  Limpar filtros e ver todos os produtos
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
