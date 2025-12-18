import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  ChevronRight,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Heart,
  UtensilsCrossed,
  PawPrint,
  Dumbbell,
  BookOpen,
} from 'lucide-react';

import Container from '../components/Container';
import ProductCard from '../components/ProductCard';
import { products, categories, promotions } from '../data/mockData';

const iconMap = {
  Smartphone,
  Shirt,
  Home: HomeIcon,
  Heart,
  UtensilsCrossed,
  PawPrint,
  Dumbbell,
  BookOpen,
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

  const featuredProducts = useMemo(() => products.slice(0, 4), []);
  const discountedProducts = useMemo(
    () => products.filter((p) => p.originalPrice > p.price).slice(0, 4),
    []
  );

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-white" />
        <Container className="relative py-24 sm:py-28 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 mb-6 leading-[1.05] tracking-tight">
              Descubra o melhor <br className="hidden sm:block" /> do seu bairro
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 font-normal">
              Encontre produtos locais, retire na loja ou receba em casa
            </p>

            <form onSubmit={handleSearch} className="mt-10">
              <div className="mx-auto w-full max-w-3xl">
                <div className="bg-white border border-gray-200/70 rounded-3xl shadow-base p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 px-3">
                      <Search className="text-gray-400" size={22} />
                      <input
                        type="text"
                        placeholder="O que você procura hoje?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-gray-900 placeholder:text-gray-500 focus:outline-none py-3"
                      />
                    </div>

                    <button
                      type="submit"
                      className="sm:w-auto w-full bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-apple font-medium min-h-[44px]"
                    >
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
            </form>

          </div>
        </Container>
      </section>

      {/* HAPPY HOUR BAR */}
      {isHappyHour && (
        <section className="bg-gray-900">
          <Container className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-[24px,auto,auto,auto] items-center justify-center gap-3 text-center sm:text-left">
              <Clock className="text-white justify-self-center sm:justify-self-start" size={24} />
              <span className="font-semibold text-white text-lg">Happy Hour do SCS</span>
              <span className="text-gray-300 font-normal text-[17px]">Descontos exclusivos por mais</span>
              <span className="bg-white/10 text-white px-4 py-2 rounded-full font-mono font-medium text-[17px] justify-self-center sm:justify-self-start">
                {happyHourTimer}
              </span>
            </div>
          </Container>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="py-14 sm:py-16">
        <Container>
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-3 tracking-tight">
              Explore por Categoria
            </h2>
            <p className="text-gray-600 text-lg">Encontre exatamente o que você precisa</p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 md:gap-6 justify-items-center">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Smartphone;
              return (
                <Link
                  key={category.id}
                  to={`/catalog?category=${category.id}`}
                  className="w-full max-w-[140px] group flex flex-col items-center gap-3 p-4 rounded-3xl hover:bg-gray-50 transition-apple min-h-[124px] justify-center"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-2xl grid place-items-center group-hover:bg-gray-200 transition-apple">
                    <Icon size={30} className="text-gray-900" />
                  </div>
                  <span className="text-xs md:text-sm text-center font-normal text-gray-700">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* PROMOTIONS */}
      <section className="py-10 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {promotions.map((promo, idx) => {
              const isLast = idx === promotions.length - 1;
              const hasOdd = promotions.length % 2 === 1;
              const spanFix =
                hasOdd && isLast ? 'sm:col-span-2 sm:justify-self-center lg:col-span-1' : '';

              return (
                <div
                  key={promo.id}
                  className={`w-full max-w-[560px] lg:max-w-none rounded-3xl p-8 text-white relative overflow-hidden shadow-base hover:shadow-xl transition-apple ${spanFix} ${promo.bgColor || 'bg-gray-900'}`}
                >
                  <div className="relative z-10">
                    <h3 className="font-semibold text-2xl md:text-3xl mb-4">{promo.title}</h3>
                    <p className="text-gray-200/90 mb-6 text-base md:text-lg">{promo.description}</p>
                    {promo.discount > 0 && (
                      <span className="inline-block bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                        Até {promo.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -left-20 -bottom-24 w-72 h-72 rounded-full bg-blue-500/10 blur-2xl" />
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* DEALS */}
      <section className="py-14 sm:py-16 md:py-20 bg-white">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-2 tracking-tight">
                Ofertas Imperdíveis
              </h2>
              <p className="text-gray-600 text-base md:text-lg">Aproveite antes que acabe!</p>
            </div>
            <Link
              to="/catalog"
              className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-[17px] min-h-[44px]"
            >
              Ver todos
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center">
            {discountedProducts.map((product) => (
              <div key={product.id} className="w-full max-w-[340px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FEATURED */}
      <section className="py-14 sm:py-16 md:py-20 bg-gray-50">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-2 tracking-tight">
                Produtos em Destaque
              </h2>
              <p className="text-gray-600 text-base md:text-lg">Os mais populares do momento</p>
            </div>
            <Link
              to="/catalog"
              className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-[17px] min-h-[44px]"
            >
              Ver todos
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center">
            {featuredProducts.map((product) => (
              <div key={product.id} className="w-full max-w-[340px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative py-20 sm:py-24 lg:py-28 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 leading-[1.08] tracking-tight">
              Retire no SCS e ganhe mais benefícios
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Compre online e retire em qualquer loja do bairro. Economize no frete e ganhe pontos em dobro.
            </p>
            <Link
              to="/catalog"
              className="group inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-8 py-4 rounded-full hover:bg-blue-700 transition-apple text-[17px] min-h-[44px]"
            >
              Começar a Comprar
              <ChevronRight size={20} />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
