import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Clock, ChevronRight, Smartphone, Shirt, Home as HomeIcon, Heart, UtensilsCrossed, PawPrint, Dumbbell, BookOpen } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories, promotions } from '../data/mockData';

const iconMap = {
  Smartphone, Shirt, Home: HomeIcon, Heart, UtensilsCrossed, PawPrint, Dumbbell, BookOpen
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isHappyHour, setIsHappyHour] = useState(false);
  const [happyHourTimer, setHappyHourTimer] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkHappyHour = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const isActive = hours >= 17 && hours < 19;
      setIsHappyHour(isActive);

      if (isActive) {
        const endTime = new Date();
        endTime.setHours(19, 0, 0);
        const diff = endTime - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setHappyHourTimer(`${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    };

    checkHappyHour();
    const interval = setInterval(checkHappyHour, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const featuredProducts = products.slice(0, 4);
  const discountedProducts = products.filter(p => p.originalPrice > p.price).slice(0, 4);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-white text-gray-900 py-32 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-6 leading-[1.05] tracking-tight">
            Descubra o melhor<br />do seu bairro
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 font-normal">
            Encontre produtos locais, retire na loja ou receba em casa
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative bg-gray-100 rounded-full shadow-sm hover:shadow-md transition-apple">
              <div className="flex items-center px-6 py-4 gap-3">
                <Search className="text-gray-400 flex-shrink-0" size={24} />
                <input
                  type="text"
                  placeholder="O que você procura hoje?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-gray-900 text-[17px] bg-transparent focus:outline-none placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-apple font-medium text-[17px] min-h-[44px] flex-shrink-0"
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {isHappyHour && (
        <section className="bg-gray-900 py-4 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
            <Clock className="text-white" size={24} />
            <span className="font-semibold text-white text-lg">Happy Hour do SCS</span>
            <span className="text-gray-300 font-normal text-[17px]">Descontos exclusivos por mais</span>
            <span className="bg-white/10 text-white px-4 py-2 rounded-full font-mono font-medium text-[17px]">
              {happyHourTimer}
            </span>
          </div>
        </section>
      )}

      <section className="py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              Explore por Categoria
            </h2>
            <p className="text-gray-600 text-lg">Encontre exatamente o que você precisa</p>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
            {categories.map(category => {
              const Icon = iconMap[category.icon] || Smartphone;
              return (
                <Link
                  key={category.id}
                  to={`/catalog?category=${category.id}`}
                  className="group flex flex-col items-center gap-3 p-4 rounded-3xl hover:bg-gray-50 transition-apple min-h-[120px] justify-center"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-200 transition-apple">
                    <Icon size={24} className="text-gray-900 md:hidden" />
                    <Icon size={32} className="text-gray-900 hidden md:block" />
                  </div>
                  <span className="text-xs md:text-sm text-center font-normal text-gray-700">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {promotions.map(promo => (
              <div key={promo.id} className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group hover:shadow-xl transition-apple">
                <div className="relative z-10">
                  <h3 className="font-semibold text-2xl md:text-3xl mb-4">{promo.title}</h3>
                  <p className="text-gray-300 mb-6 text-base md:text-lg">{promo.description}</p>
                  {promo.discount > 0 && (
                    <span className="inline-block bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                      Até {promo.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-2 tracking-tight">
                Ofertas Imperdíveis
              </h2>
              <p className="text-gray-600 text-base md:text-lg">Aproveite antes que acabe!</p>
            </div>
            <Link to="/catalog" className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-[17px] min-h-[44px]">
              Ver todos
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {discountedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-2 tracking-tight">
                Produtos em Destaque
              </h2>
              <p className="text-gray-600 text-base md:text-lg">Os mais populares do momento</p>
            </div>
            <Link to="/catalog" className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-[17px] min-h-[44px]">
              Ver todos
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 px-4 md:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 leading-[1.08] tracking-tight">
            Retire no SCS e ganhe mais benefícios
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Compre online e retire em qualquer loja do bairro. Economize no frete e ganhe pontos em dobro para usar em suas próximas compras!
          </p>
          <Link
            to="/catalog"
            className="group inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-8 py-4 rounded-full hover:bg-blue-700 transition-apple text-[17px] min-h-[44px]"
          >
            Começar a Comprar
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
