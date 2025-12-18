import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Filter, X, MapPin, Ruler, BadgeDollarSign, MessageCircle, Phone } from "lucide-react";
import Container from "../components/Container";
import { rentalSpaces, categories } from "../data/mockData";

const positions = [
  { top: "22%", left: "30%" },
  { top: "35%", left: "60%" },
  { top: "55%", left: "25%" },
  { top: "40%", left: "45%" },
  { top: "65%", left: "70%" },
  { top: "25%", left: "75%" },
  { top: "70%", left: "40%" },
  { top: "45%", left: "15%" },
];

export default function Rentals() {
  const [selected, setSelected] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSize, setMinSize] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return rentalSpaces.filter((r) => {
      if (!r.available) return false;

      if (selectedCategory) {
        const ok = (r.categoryFit || []).includes(selectedCategory);
        if (!ok) return false;
      }

      if (maxPrice !== "" && r.priceMonth > Number(maxPrice)) return false;
      if (minSize !== "" && r.sizeM2 < Number(minSize)) return false;

      return true;
    });
  }, [selectedCategory, maxPrice, minSize]);

  const current = selected ? rentalSpaces.find((r) => r.id === selected) : null;

  const catName = (id) => categories.find((c) => c.id === id)?.name || id;

  const money = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 size={22} /> Lojas para Alugar
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Veja espaços disponíveis no SCS para você expor e vender seus produtos.
            </p>
          </div>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-white"
          >
            <Filter size={18} />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Filtrar espaços</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-gray-600">Categoria ideal</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="">Todas</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Preço máx. (R$/mês)</label>
                <input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  type="number"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  placeholder="Ex.: 3000"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Área mín. (m²)</label>
                <input
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                  type="number"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  placeholder="Ex.: 20"
                />
              </div>
            </div>

            <div className="mt-3">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setMaxPrice("");
                  setMinSize("");
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* “MAPA” (mock) */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl h-96 lg:h-[520px] relative overflow-hidden border">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <MapPin size={44} className="text-blue-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Mapa de Espaços</h3>
                  <p className="text-gray-600 text-sm">Clique nos pins para ver detalhes</p>
                </div>
              </div>

              {filtered.map((r, idx) => {
                const pos = positions[idx % positions.length];
                const active = selected === r.id;

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r.id)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all ${
                      active ? "scale-125 z-10" : "hover:scale-110"
                    }`}
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      active ? "bg-blue-600" : "bg-white"
                    }`}>
                      <MapPin size={20} className={active ? "text-white" : "text-blue-600"} />
                    </div>
                    <div className={`absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-xs font-medium ${
                      active ? "bg-blue-600 text-white" : "bg-white shadow"
                    }`}>
                      {r.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PAINEL DIREITO */}
          <div className="space-y-4">
            {current ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                  src={current.photos?.[0]}
                  alt={current.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{current.name}</h2>
                      <p className="text-sm text-gray-600">{current.address}</p>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-gray-400 hover:text-gray-700"
                      title="Fechar"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {(current.categoryFit || []).slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        Ideal: {catName(c)}
                      </span>
                    ))}
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      Tipo: {current.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Ruler size={16} />
                      <span>{current.sizeM2} m²</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <BadgeDollarSign size={16} />
                      <span>{money(current.priceMonth)}/mês</span>
                    </div>
                    <div className="col-span-2 text-gray-600 text-xs">
                      Condomínio: {money(current.condoMonth || 0)}/mês
                    </div>
                  </div>

                  {current.features?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2">Detalhes</h3>
                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        {current.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <a
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                      href={`https://wa.me/${current.whatsapp}?text=${encodeURIComponent(
                        `Olá! Tenho interesse em alugar: ${current.name}. Pode me passar mais detalhes?`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={18} />
                      WhatsApp
                    </a>
                    <a
                      className="flex items-center justify-center gap-2 border border-blue-600 text-blue-700 py-2 rounded-lg hover:bg-blue-50"
                      href={`tel:${current.whatsapp}`}
                    >
                      <Phone size={18} />
                      Ligar
                    </a>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    Dica: Se você ainda não tem loja, você pode começar pelo seu{" "}
                    <Link to="/catalog" className="text-blue-600 hover:underline">
                      catálogo online
                    </Link>{" "}
                    e depois migrar para um ponto físico.
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Espaços disponíveis ({filtered.length})
                </h2>

                <div className="space-y-3 max-h-[420px] overflow-y-auto">
                  {filtered.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelected(r.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <img
                        src={r.photos?.[0]}
                        alt={r.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{r.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{r.address}</p>
                        <p className="text-sm text-blue-700 font-semibold">
                          {money(r.priceMonth)}/mês • {r.sizeM2} m²
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  *Dados demonstrativos. Depois dá pra integrar com uma planilha/API real.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
