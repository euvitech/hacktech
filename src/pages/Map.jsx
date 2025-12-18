import { useEffect, useMemo, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import QRCode from "react-qr-code";
import Container from "../components/Container";

// ✅ Ajuste para o ponto EXATO onde o TOTEM fica no SCS
const kioskOrigin = { lat: -15.7971, lng: -47.88949 };

export default function MapGoogle() {
  const mapDivRef = useRef(null);

  const mapRef = useRef(null);
  const placesServiceRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const markersRef = useRef([]);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); // places list
  const [selected, setSelected] = useState(null); // { placeId, name, address, lat, lng }
  const [routeInfo, setRouteInfo] = useState(null); // { distanceText, durationText }
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // QR abre rota a pé no celular (Google Maps)
  const qrUrl = useMemo(() => {
    if (!selected?.placeId) return "";
    return `https://www.google.com/maps/dir/?api=1&origin=${kioskOrigin.lat},${kioskOrigin.lng}&destination_place_id=${selected.placeId}&travelmode=walking`;
  }, [selected]);

  const clearMarkers = () => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  };

  const addMarkerForPlace = (place) => {
    if (!mapRef.current || !place?.geometry?.location) return;

    const marker = new google.maps.Marker({
      map: mapRef.current,
      position: place.geometry.location,
      title: place.name,
    });

    marker.addListener("click", () => {
      if (place.place_id) {
        selectPlaceById(place.place_id);
      }
    });

    markersRef.current.push(marker);
  };

  const selectPlaceById = (placeId) => {
    const svc = placesServiceRef.current;
    const dirSvc = directionsServiceRef.current;
    const dirRend = directionsRendererRef.current;

    if (!svc || !dirSvc || !dirRend) return;

    setLoadingRoute(true);
    setRouteInfo(null);

    svc.getDetails(
      {
        placeId,
        fields: ["place_id", "name", "formatted_address", "geometry"],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) {
          setLoadingRoute(false);
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setSelected({
          placeId: place.place_id,
          name: place.name || "Destino",
          address: place.formatted_address || "",
          lat,
          lng,
        });

        setResults((prev) => {
          const item = {
            place_id: place.place_id,
            name: place.name,
            formatted_address: place.formatted_address || "",
            geometry: place.geometry,
          };

          // evita duplicado
          if (prev.some((p) => p.place_id === item.place_id)) return prev;

          // coloca o selecionado no topo
          return [item, ...prev].slice(0, 20);
        });

        // Centraliza no destino
        mapRef.current.panTo({ lat, lng });

        // Rota a pé até o lugar (placeId)
        dirSvc.route(
          {
            origin: kioskOrigin,
            destination: { placeId },
            travelMode: google.maps.TravelMode.WALKING,
          },
          (result, dStatus) => {
            if (dStatus === "OK" && result) {
              dirRend.setDirections(result);

              const leg = result.routes?.[0]?.legs?.[0];
              setRouteInfo({
                distanceText: leg?.distance?.text || "",
                durationText: leg?.duration?.text || "",
              });
            } else {
              setRouteInfo(null);
              console.error("Directions status:", dStatus);
            }
            setLoadingRoute(false);
          }
        );
      }
    );
  };

  const runSearch = () => {
    const svc = placesServiceRef.current;
    if (!svc || !query.trim()) return;

    setLoadingSearch(true);
    setSelected(null);
    setRouteInfo(null);

    // limpa rota anterior
    try {
      directionsRendererRef.current?.set("directions", null);
    } catch {}

    clearMarkers();

    // Busca lugares "cadastrados no Google" perto do totem (SCS)
    svc.textSearch(
      {
        query: query.trim(),
        location: kioskOrigin,
        radius: 2500, // ajuste conforme o tamanho do SCS/área desejada
      },
      (places, status) => {
        setLoadingSearch(false);

        if (status !== google.maps.places.PlacesServiceStatus.OK || !places?.length) {
          setResults([]);
          return;
        }

        setResults(places);

        // coloca pins e enquadra
        places.forEach(addMarkerForPlace);

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(kioskOrigin);
        places.forEach((p) => p.geometry?.location && bounds.extend(p.geometry.location));
        mapRef.current.fitBounds(bounds, 60);
      }
    );
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
        if (!key) {
          throw new Error(
            'Chave não encontrada. Crie ".env" com VITE_GOOGLE_MAPS_KEY=... e reinicie o npm run dev.'
          );
        }

        setOptions({ key, v: "weekly" });

        const { Map } = await importLibrary("maps");
        await importLibrary("places");
        await importLibrary("routes");

        if (cancelled) return;

        const map = new Map(mapDivRef.current, {
          center: kioskOrigin,
          zoom: 16,
          disableDefaultUI: true, // totem-friendly
          gestureHandling: "greedy",
          clickableIcons: true, 
        });

        mapRef.current = map;

        // ✅ Clicar em qualquer POI do Google no mapa -> traça rota
        map.addListener("click", (e) => {
          if (!e.placeId) return;
          // Isso impede o popup padrão do Google e deixa você controlar o clique
          e.stop();
          // Seleciona o local do Google e traça rota a pé
          selectPlaceById(e.placeId);
        });

        // marcador do totem
        new google.maps.Marker({
          map,
          position: kioskOrigin,
          title: "Totem (Você está aqui)",
        });

        // services
        placesServiceRef.current = new google.maps.places.PlacesService(map);
        directionsServiceRef.current = new google.maps.DirectionsService();
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: false,
        });

        setReady(true);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Erro ao carregar Google Maps.");
      }
    })();

    return () => {
      cancelled = true;
      clearMarkers();
      try {
        directionsRendererRef.current?.setMap(null);
      } catch {}
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Mapa (Google) • SCS</h1>
          <p className="text-gray-600 text-sm">
            Busque um estabelecimento, toque nele e veja a rota <b>a pé</b>. Use o QR para abrir no celular.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-4">
            <b>Erro:</b> {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* MAPA */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border overflow-hidden h-[520px]">
              <div ref={mapDivRef} className="w-full h-full" />
            </div>
          </div>

          {/* PAINEL TOTEM */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border p-4">
              <div className="font-semibold text-gray-900 mb-2">Buscar no Google</div>

              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runSearch();
                  }}
                  placeholder="Ex.: farmácia, restaurante, loja de roupa..."
                  className="w-full px-4 py-4 border rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={runSearch}
                  disabled={!ready || loadingSearch}
                  className="px-5 py-4 rounded-2xl bg-blue-600 text-white font-semibold disabled:opacity-60"
                  style={{ minWidth: 120 }}
                >
                  {loadingSearch ? "Buscando..." : "Buscar"}
                </button>
              </div>

              {!ready && !error && <div className="text-sm text-gray-500 mt-3">Carregando mapa…</div>}
            </div>

            

            {/* LISTA DE RESULTADOS (clique = rota + QR) */}
            <div className="bg-white rounded-2xl border p-4">

              

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Resultados</h2>
                <span className="text-sm text-gray-600">{results.length}</span>
              </div>

              <div className="mt-3 space-y-3 max-h-[240px] overflow-y-auto pr-1">
                {results.map((p) => (
                  <button
                    key={p.place_id}
                    onClick={() => selectPlaceById(p.place_id)}
                    className="w-full text-left p-4 rounded-2xl border border-gray-200 hover:bg-gray-50"
                    style={{ minHeight: 72 }}
                  >
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="text-sm text-gray-600">
                      {p.formatted_address || p.vicinity || ""}
                    </div>
                  </button>
                ))}

                {results.length === 0 && (
                  <div className="text-sm text-gray-600">
                    Faça uma busca para listar estabelecimentos próximos.
                  </div>
                )}
              </div>
            </div>

            {/* ROTA + QR */}
            <div className="bg-white rounded-2xl border p-4">
              <h3 className="text-lg font-bold text-gray-900">Rota a pé</h3>

              {!selected && (
                <p className="text-sm text-gray-600 mt-2">
                  Toque em um resultado ou em um pin no mapa para traçar o caminho.
                </p>
              )}

              {selected && (
                <div className="mt-2 text-sm text-gray-700 space-y-2">
                  <div className="font-semibold text-gray-900">{selected.name}</div>
                  <div className="text-gray-600">{selected.address}</div>

                  {loadingRoute && <div className="text-gray-600">Calculando rota…</div>}

                  {!loadingRoute && routeInfo && (
                    <>
                      <div><b>Distância:</b> {routeInfo.distanceText}</div>
                      <div><b>Tempo a pé:</b> {routeInfo.durationText}</div>
                    </>
                  )}

                  {/* QR CODE */}
                  {qrUrl && (
                    <div className="mt-3 bg-gray-50 rounded-2xl border p-4">
                      <div className="font-semibold text-gray-900">Abrir no celular</div>
                      <p className="text-sm text-gray-600 mt-1">
                        Escaneie para abrir a rota a pé no Google Maps.
                      </p>
                      <div className="mt-3 bg-white p-3 rounded-xl inline-block">
                        <QRCode value={qrUrl} size={180} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
