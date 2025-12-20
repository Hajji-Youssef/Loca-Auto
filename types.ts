
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
  usageCategory: 'FOR_RENT' | 'FOR_SALE';
  currentMission?: string;
  assignedWorker?: string;
  missionStartDate?: string;
  missionEndDate?: string;
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
  type: 'RENTAL' | 'SALE'; // New field to distinguish synchronized transactions
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
  type?: 'RENTAL' | 'SALE';
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

export interface Worker {
    id: number;
    fullName: string;
    email: string;
    role: 'WORKER' | 'ADMIN';
    status: 'ONLINE' | 'BUSY' | 'OFFLINE';
    salary: number; // Champ salaire ajouté
}

export interface WorkerSession {
  id: number;
  workerId: number;
  workerName: string;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
  loginTime: string;
  logoutTime?: string;
  date: string;
}
