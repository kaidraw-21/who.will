export interface User {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface ChartDataSegment {
  id: string;
  name: string;
  probability: number;
  color: string;
  weight: number;
}