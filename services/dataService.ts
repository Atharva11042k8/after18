import { HoursData, SummaryData, BucketItem } from '../types';
import { getDateStructure } from '../utils/datePath';

// Helper to fetch JSON with error handling (returns empty object on failure)
const fetchJson = async <T,>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Return empty object (or array for lists) for 404s
      if (url.includes('bucketList')) return [] as unknown as T;
      return {} as T;
    }
    return await response.json();
  } catch (error) {
    console.warn(`Could not load ${url}`, error);
    if (url.includes('bucketList')) return [] as unknown as T;
    return {} as T;
  }
};

export const fetchMonthData = async (dateStr: string) => {
  const { year, month } = getDateStructure(dateStr);
  
  // Structure: /data/twenty-five/january/{type}.json
  const basePath = `/data/${year}/${month}`;


const datePath = `${new Date().getFullYear().toString().slice(-2).replace(/(\d{2})/, m => ["zero","one","two","three","four","five","six","seven","eight","nine"][m[0]] + "-" + ["zero","one","two","three","four","five","six","seven","eight","nine"][m[1]])}/${new Date().toLocaleString("en-US",{ month:"long" }).toLowerCase()}`;


  
  const [study, sleep, summary] = await Promise.all([
    fetchJson<HoursData>(`${datePath}/study.json`),
    fetchJson<HoursData>(`${datePath}/sleep.json`),
    fetchJson<SummaryData>(`${datePath}/summary.json`),
  ]);

  return { study, sleep, summary };
};

export const fetchBucketList = async (): Promise<BucketItem[]> => {
  return fetchJson<BucketItem[]>('/data/bucketList.json');
};
