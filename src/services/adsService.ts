import type { AdsData } from "@/@types/ads";

// Swap this URL for the real endpoint when the backend is ready:
// const ADS_API_URL = "https://api.pillowprincess.com/v1/ads";

const MOCK_ADS: AdsData = {
  banners: [
    {
      id: "b1",
      title: "Acima de R$ 199",
      subtitle: "frete grátis",
      cta: "Comprar agora",
      icon: "🚚",
      bgColor: "#1C1018",
    },
    {
      id: "b2",
      title: "Novidades da semana",
      subtitle: "coleção verão",
      cta: "Ver coleção",
      icon: "✨",
      bgColor: "#C45C75",
    },
  ],
  promotions: [
    {
      id: "p1",
      label: "oferta relâmpago",
      title: "20% OFF em pijamas",
      description: "Somente hoje. Use o código PRINCESS20.",
      icon: "⚡",
    },
    {
      id: "p2",
      label: "frete grátis",
      title: "Para todo o Brasil",
      description: "Em compras acima de R$ 199.",
      icon: "🇧🇷",
    },
  ],
};

// Simulates a future fetch() call. When the API is ready, replace the body with:
// const res = await fetch(ADS_API_URL);
// if (!res.ok) throw new Error("Falha ao buscar anúncios");
// return res.json() as Promise<AdsData>;
export async function fetchAds(): Promise<AdsData> {
  await new Promise((r) => setTimeout(r, 300)); // simulate network latency
  return MOCK_ADS;
}
