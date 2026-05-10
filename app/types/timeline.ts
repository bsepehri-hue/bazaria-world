// app/types/timeline.ts

export interface TimelineEvent {
  id: string;
  sellerId?: string;
  type: string;       // REQUIRED
  label: string;      // REQUIRED
  amount?: number;
  timestamp: number;  // Firestore stores this as a number
  [key: string]: any;
}
