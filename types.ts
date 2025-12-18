
export enum ProductCategory {
  BERLINE = 'Berline',
  SUV = 'SUV',
  SPORTIVE = 'Sportive',
  LUXE = 'Luxe',
  ELECTRIQUE = 'Électrique',
  UTILITAIRE = 'Utilitaire'
}

export enum RentalStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  UNPAID = 'UNPAID',
  REFUNDED = 'REFUNDED'
}

export interface Product {
  id: number;
  title: string;
  description: string;
  pricePerDay: number;
  category: ProductCategory;
  imageUrl: string;
  available: boolean;
  transmission: string;
  fuelType: string;
  seats: number;
  options: string[];
  // New fields for Fleet Management
  usageCategory: 'FOR_RENT' | 'FOR_SALE';
  currentMission?: string; // Free text for maintenance/logistics
  assignedWorker?: string;
  missionStartDate?: string; // ISO Date YYYY-MM-DD
  missionEndDate?: string;   // ISO Date YYYY-MM-DD
}

export interface Rental {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: RentalStatus;
  paymentStatus: PaymentStatus;
  clientName?: string;
}

export interface CalendarDay {
  date: string;
  status: 'AVAILABLE' | 'RESERVED' | 'UNAVAILABLE';
}

export interface DayAvailability {
    date: Date;
    isReserved: boolean;
    price?: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'CLIENT' | 'ADMIN' | 'WORKER';
  token?: string;
  isOnline?: boolean;
}

export interface RentalRequest {
  productId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

export interface WorkerStatus {
  id: number;
  name: string;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
  lastActive: string;
}

// Pour le CRUD Employé
export interface Worker {
    id: number;
    fullName: string;
    email: string;
    role: 'WORKER' | 'ADMIN';
    status: 'ONLINE' | 'BUSY' | 'OFFLINE';
}

// Pour le Pointage et l'Historique
export interface WorkerSession {
  id: number;
  workerId: number;
  workerName: string;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
  loginTime: string; // ISO Datetime
  logoutTime?: string; // ISO Datetime
  date: string; // YYYY-MM-DD pour filtrage facile
}
