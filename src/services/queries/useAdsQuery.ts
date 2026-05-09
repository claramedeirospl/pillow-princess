import { useQuery } from "@tanstack/react-query";
import { fetchAds } from "@/services/adsService";
import type { AdsData } from "@/@types/ads";

const ADS_KEY = ["ads"] as const;

export function useAds() {
  return useQuery<AdsData>({
    queryKey: ADS_KEY,
    queryFn: fetchAds,
    staleTime: 1000 * 60 * 10, // 10 minutes — ads don't change often
  });
}
