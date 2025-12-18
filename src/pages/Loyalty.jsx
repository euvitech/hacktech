import { Gift, Star, TrendingUp, Ticket, Clock, ChevronRight, Trophy, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { loyaltyLevels } from '../data/mockData';
import { useState, useEffect } from 'react';

export default function Loyalty() {
  const { loyalty, getCurrentLevel } = useCart();
  const currentLevel = getCurrentLevel();
  const [isHappyHour, setIsHappyHour] = useState(false);
  const [happyHourTimer, setHappyHourTimer] = useState('');

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

  const nextLevel = loyaltyLevels.find(l => l.minPoints > loyalty.points);
  const progressToNext = nextLevel
    ? ((loyalty.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;
  const pointsToNext = nextLevel ? nextLevel.minPoints - loyalty.points : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary via-primary to-accent text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Programa de Fidelidade</h1>
              <p className="text-white/80">Acumule pontos e ganhe cashback em suas compras</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 min-w-[280px]">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: currentLevel.color }}
                >
                  <Trophy size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Seu nível</p>
                  <p className="text-xl font-bold">{currentLevel.name}</p>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{loyalty.points.toLocaleString()}</div>
              <p className="text-sm opacity-80">pontos acumulados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isHappyHour && (
          <div className="bg-accent rounded-xl p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Zap size={32} className="text-dark" />
              <div>
                <h3 className="text-xl font-bold text-dark">Happy Hour Ativo!</h3>
                <p className="text-dark/80">Pontos em DOBRO para todas as compras</p>
              </div>
            </div>
            <div className="bg-dark text-white px-4 py-2 rounded-lg font-mono text-xl">
              {happyHourTimer}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Star size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pontos</p>
                <p className="text-2xl font-bold text-dark">{loyalty.points.toLocaleString()}</p>
              </div>
            </div>
            {nextLevel && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Próximo nível: {nextLevel.name}</span>
                  <span className="font-medium">{pointsToNext} pts</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-success" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cashback Disponível</p>
                <p className="text-2xl font-bold text-success">R$ {loyalty.cashback.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Taxa atual: <span className="font-medium text-dark">{currentLevel.cashbackRate}%</span> de cashback
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Gift size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Gasto</p>
                <p className="text-2xl font-bold text-dark">R$ {loyalty.totalSpent.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Economizou <span className="font-medium text-success">R$ {(loyalty.cashback + loyalty.points * 0.01).toFixed(2)}</span> com o programa
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
              <Trophy size={24} className="text-accent" />
              Níveis do Programa
            </h2>
            <div className="space-y-4">
              {loyaltyLevels.map((level, index) => {
                const isCurrentLevel = level.name === currentLevel.name;
                const isPastLevel = level.maxPoints < loyalty.points;
                return (
                  <div
                    key={level.name}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                      isCurrentLevel
                        ? 'border-primary bg-primary/5'
                        : isPastLevel
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: level.color }}
                    >
                      <Trophy size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-dark">{level.name}</span>
                        {isCurrentLevel && (
                          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {level.minPoints.toLocaleString()}+ pontos
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-success">{level.cashbackRate}%</span>
                      <p className="text-xs text-gray-500">cashback</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
              <Ticket size={24} className="text-primary" />
              Seus Cupons
            </h2>
            {loyalty.coupons.length > 0 ? (
              <div className="space-y-4">
                {loyalty.coupons.map(coupon => (
                  <div
                    key={coupon.id}
                    className="border-2 border-dashed border-primary rounded-xl p-4 bg-primary/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-primary">{coupon.code}</span>
                      {coupon.type === 'percentage' ? (
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                          {coupon.discount}% OFF
                        </span>
                      ) : (
                        <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-bold">
                          Frete Grátis
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Compras acima de R$ {coupon.minValue}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock size={14} />
                        Até {new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Ticket size={48} className="mx-auto mb-4 opacity-30" />
                <p>Você não tem cupons disponíveis</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-secondary to-dark rounded-xl p-8 text-white">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Como Funciona</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Compre</h3>
                  <p className="text-sm opacity-80">Faça compras nas lojas parceiras do SCS</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Acumule</h3>
                  <p className="text-sm opacity-80">Ganhe 1 ponto por real gasto (2x no Happy Hour)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Resgate</h3>
                  <p className="text-sm opacity-80">Use seu cashback ou troque por cupons exclusivos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
