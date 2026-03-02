type VoiceCatalogProduct = {
  id: string;
  name: string;
  description?: string;
  price?: string;
  priceRange?: string;
  image?: string;
  category?: string;
  customizationOptions?: any[];
};

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export async function syncVoiceCatalog(products: VoiceCatalogProduct[]): Promise<void> {
  const baseUrl = (import.meta.env.VITE_VOICE_API_URL as string | undefined) || '/api';

  const endpoint = `${normalizeBaseUrl(baseUrl)}/v1/catalog/sync`;
  const apiKey = (import.meta.env.VITE_VOICE_API_KEY as string | undefined) || '';

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
      body: JSON.stringify({
        source: 'website',
        version: Date.now().toString(),
        products,
      }),
    });
  } catch (error) {
    console.warn('[voice-catalog-sync] sync failed:', error);
  }
}
