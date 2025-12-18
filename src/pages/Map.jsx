import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Navigation, Phone, Filter, X, ChevronRight } from 'lucide-react';
import { stores, categories, products } from '../data/mockData';

export default function Map() {
  const [searchParams] = useSearchParams();
  const [selectedStore, setSelectedStore] = useState(
    searchParams.get('store') ? parseInt(searchParams.get('store')) : null
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredStores = useMemo(() => {
    if (!selectedCategory) return stores;
    return stores.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  const store = selectedStore ? stores.find(s => s.id === selectedStore) : null;
  const storeProducts = store ? products.filter(p => p.storeId === store.id).slice(0, 4) : [];

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat?.name || catId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-dark">Mapa de Lojas</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-white"
          >
            <Filter size={18} />
            Filtrar
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Filtrar por Categoria</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  !selectedCategory
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl h-96 lg:h-[500px] relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-dark mb-2">Mapa Interativo do SCS</h3>
                  <p className="text-gray-600">Visualização do bairro com lojas parceiras</p>
                </div>
              </div>

              {filteredStores.map((s, index) => {
                const positions = [
                  { top: '20%', left: '30%' },
                  { top: '35%', left: '60%' },
                  { top: '55%', left: '25%' },
                  { top: '40%', left: '45%' },
                  { top: '65%', left: '70%' },
                  { top: '25%', left: '75%' },
                  { top: '70%', left: '40%' },
                  { top: '45%', left: '15%' },
                ];
                const pos = positions[index % positions.length];

                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStore(s.id)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                      selectedStore === s.id ? 'scale-125 z-10' : 'hover:scale-110'
                    }`}
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      selectedStore === s.id ? 'bg-primary' : 'bg-white'
                    }`}>
                      <MapPin size={20} className={selectedStore === s.id ? 'text-white' : 'text-primary'} />
                    </div>
                    <div className={`absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-xs font-medium ${
                      selectedStore === s.id ? 'bg-primary text-white' : 'bg-white shadow'
                    }`}>
                      {s.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {store ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-dark">{store.name}</h2>
                    <button
                      onClick={() => setSelectedStore(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-3">
                    {getCategoryName(store.category)}
                  </span>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{store.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-accent fill-accent" />
                      <span>{store.rating} estrelas</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button className="flex-1 bg-primary text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90">
                      <Navigation size={18} />
                      Como Chegar
                    </button>
                    <button className="flex-1 border border-primary text-primary py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/5">
                      <Phone size={18} />
                      Ligar
                    </button>
                  </div>

                  {storeProducts.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-dark mb-3">Produtos desta loja</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {storeProducts.map(p => (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100"
                          >
                            <img src={p.image} alt={p.name} className="w-full h-20 object-cover rounded mb-1" />
                            <p className="text-xs line-clamp-1">{p.name}</p>
                            <p className="text-primary font-bold text-sm">R$ {p.price.toFixed(2)}</p>
                          </Link>
                        ))}
                      </div>
                      <Link
                        to={`/catalog?store=${store.id}`}
                        className="mt-3 text-primary text-sm flex items-center justify-center gap-1 hover:underline"
                      >
                        Ver todos os produtos <ChevronRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-bold text-dark mb-4">
                  Lojas no Bairro ({filteredStores.length})
                </h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {filteredStores.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStore(s.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-dark">{s.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{s.address}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star size={14} className="text-accent fill-accent" />
                        <span>{s.rating}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
