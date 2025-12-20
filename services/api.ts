
import { Product, ProductCategory, Rental, RentalStatus, PaymentStatus, RentalRequest, DayAvailability, WorkerSession, Worker } from '../types';
import { wsService } from './websocket';

const USE_MOCK = true; 

export interface ApiClient {
    getAllProducts(): Promise<Product[]>;
    getMyRentals(): Promise<Rental[]>;
    checkAvailability(productId: number, startDate: string, endDate: string): Promise<boolean>;
    findAvailableProducts(startDate: string, endDate: string): Promise<number[]>;
    fetchCarAvailabilityCalendar(productId: number | string): Promise<DayAvailability[]>;
    createRental(rentalData: RentalRequest & { clientName?: string }): Promise<boolean>;
    updateProductMission(productId: number, mission: string, workerName: string, startDate?: string, endDate?: string): Promise<boolean>;
    updateProductStatus(productId: number, available: boolean, reason?: string): Promise<boolean>;
    getAllRentalsForCalendar(startDate: string, endDate: string): Promise<Rental[]>;
    cancelRental(rentalId: number): Promise<boolean>;
    updateRental(rentalId: number, data: Partial<Rental>): Promise<boolean>;
    getAllWorkers(): Promise<Worker[]>;
    saveWorker(worker: Partial<Worker>): Promise<boolean>;
    deleteWorker(id: number): Promise<boolean>;
    getWorkerSessions(workerId?: number): Promise<WorkerSession[]>; 
    addProduct(product: Omit<Product, 'id'>): Promise<Product>;
    updateProduct(id: number, product: Partial<Product>): Promise<Product>;
    deleteProduct(id: number): Promise<boolean>;
}

const generateMassiveFleet = (): Product[] => {
    const baseFleet: any[] = [
        { id: 1, title: "Tesla Model 3 Performance", category: ProductCategory.ELECTRIQUE, imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800", price: 120 },
        { id: 2, title: "Tesla Model Y Long Range", category: ProductCategory.ELECTRIQUE, imageUrl: "https://hips.hearstapps.com/hmg-prod/images/2026-tesla-model-y-long-range-awd-121-688bc237a2711.jpg?crop=0.615xw:0.519xh;0.0865xw,0.365xh&resize=2048:*", price: 140 },
        { id: 3, title: "Tesla Model S Plaid", category: ProductCategory.LUXE, imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800", price: 250 },
        { id: 4, title: "Peugeot 3008 GT", category: ProductCategory.SUV, imageUrl: "https://tunisieauto.tn/wp-content/uploads/2020/03/3008-GT-01.jpg", price: 85 },
        { id: 12, title: "Hyundai i 10", category: ProductCategory.SPORTIVE, imageUrl: "https://catalogue.automobile.tn/big/2023/12/46462.jpg?t=1", price: 220 },
        { id: 16, title: "Fiat 500 Hybrid", category: ProductCategory.BERLINE, imageUrl: "https://www.fiat-official.tn/content/dam/fiat2023/cross/models/500/500/canvas/canvas-4/mobile.jpg", price: 45 },
    ];

    const fullFleet: Product[] = [];
    for (let i = 0; i < 50; i++) {
        const base = baseFleet[i % baseFleet.length];
        fullFleet.push({
            id: i + 1,
            title: i < baseFleet.length ? base.title : `${base.title} Ed. ${i}`,
            description: "Véhicule premium LocaAuto.",
            pricePerDay: base.price,
            category: base.category,
            imageUrl: base.imageUrl,
            available: true,
            transmission: i % 2 === 0 ? 'Automatique' : 'Manuelle',
            fuelType: i % 3 === 0 ? 'Essence' : (i % 3 === 1 ? 'Diesel' : 'Électrique'),
            seats: base.category === ProductCategory.SUV ? 5 : 4,
            options: ["GPS", "Bluetooth"],
            usageCategory: i % 5 === 0 ? 'FOR_SALE' : 'FOR_RENT'
        });
    }
    return fullFleet;
};

let MOCK_PRODUCTS: Product[] = generateMassiveFleet();
let MOCK_RENTALS: Rental[] = [
    { id: 101, productId: 1, productTitle: "Tesla Model 3 Performance", productImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800", startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], totalPrice: 480, status: RentalStatus.ACTIVE, paymentStatus: PaymentStatus.PAID, clientName: "Alice Durand", type: 'RENTAL' },
    { id: 2001, productId: 3, productTitle: "Tesla Model S Plaid", productImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800", startDate: "2024-05-15", endDate: "2024-05-15", totalPrice: 62500, status: RentalStatus.COMPLETED, paymentStatus: PaymentStatus.PAID, clientName: "Jean-Pierre Martin", type: 'SALE' }
];

let MOCK_WORKERS: Worker[] = [
    { id: 777, fullName: "Marc Admin", email: "admin@locaauto.com", role: "ADMIN", status: "ONLINE", salary: 4500 },
    { id: 888, fullName: "Sophie Martin", email: "sophie.worker@locaauto.com", role: "WORKER", status: "ONLINE", salary: 2200 },
    { id: 999, fullName: "Lucas Dubois", email: "lucas.worker@locaauto.com", role: "WORKER", status: "BUSY", salary: 2100 },
    { id: 1000, fullName: "Emma Leroy", email: "emma.worker@locaauto.com", role: "WORKER", status: "OFFLINE", salary: 2350 }
];

let MOCK_SESSIONS: WorkerSession[] = [
    { id: 1, workerId: 777, workerName: "Marc Admin", status: "ONLINE", date: new Date().toISOString().split('T')[0], loginTime: new Date(Date.now() - 3600000 * 8).toISOString() },
    { id: 2, workerId: 888, workerName: "Sophie Martin", status: "ONLINE", date: new Date().toISOString().split('T')[0], loginTime: new Date(Date.now() - 3600000 * 4).toISOString() }
];

export const MockApi: ApiClient = {
    getAllProducts: async () => [...MOCK_PRODUCTS],
    getMyRentals: async () => {
        const user = JSON.parse(localStorage.getItem('locaauto_user') || '{}');
        return MOCK_RENTALS.filter(r => r.clientName === user.fullName);
    },
    checkAvailability: async (productId, start, end) => true,
    findAvailableProducts: async (start, end) => MOCK_PRODUCTS.map(p => p.id),
    fetchCarAvailabilityCalendar: async (productId) => {
        const days: DayAvailability[] = [];
        const today = new Date();
        for (let i = -10; i < 40; i++) {
            const d = new Date(today); d.setDate(today.getDate() + i);
            days.push({ date: d, isReserved: false });
        }
        return days;
    },
    createRental: async (data) => {
        const p = MOCK_PRODUCTS.find(x => x.id === Number(data.productId));
        const user = JSON.parse(localStorage.getItem('locaauto_user') || '{"fullName": "Client Web"}');
        const newRental: Rental = {
            id: Date.now(),
            productId: Number(data.productId),
            productTitle: p?.title || "Véhicule",
            productImage: p?.imageUrl || "",
            startDate: data.startDate,
            endDate: data.endDate,
            totalPrice: data.totalPrice,
            status: RentalStatus.ACTIVE,
            paymentStatus: data.type === 'SALE' ? PaymentStatus.PENDING : PaymentStatus.PAID,
            clientName: data.clientName || user.fullName,
            type: data.type || 'RENTAL'
        };
        MOCK_RENTALS.push(newRental);
        wsService.emit('calendar_refresh_needed', null);
        return true;
    },
    updateProductMission: async (id, mission, workerName, start, end) => {
        const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
        if (idx !== -1) {
            MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], currentMission: mission, assignedWorker: workerName, missionStartDate: start, missionEndDate: end };
        }
        return true;
    },
    updateProductStatus: async (id, avail, reason) => {
        const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
        if (idx !== -1) {
            MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], available: avail, currentMission: avail ? "" : reason };
        }
        return true;
    },
    getAllRentalsForCalendar: async () => [...MOCK_RENTALS],
    cancelRental: async (id) => {
        MOCK_RENTALS = MOCK_RENTALS.filter(x => String(x.id) !== String(id));
        wsService.emit('calendar_refresh_needed', null);
        return true;
    },
    updateRental: async (id, data) => {
        const idx = MOCK_RENTALS.findIndex(x => String(x.id) === String(id));
        if (idx !== -1) {
            MOCK_RENTALS[idx] = { ...MOCK_RENTALS[idx], ...data };
            wsService.emit('calendar_refresh_needed', null);
        }
        return true;
    },
    getAllWorkers: async () => [...MOCK_WORKERS],
    saveWorker: async (worker) => {
        if(worker.id) {
            const idx = MOCK_WORKERS.findIndex(w => w.id === worker.id);
            if(idx !== -1) MOCK_WORKERS[idx] = { ...MOCK_WORKERS[idx], ...worker } as Worker;
        } else {
            const newWorker = { ...worker, id: Date.now(), status: 'OFFLINE', salary: worker.salary || 2000 } as Worker;
            MOCK_WORKERS.push(newWorker);
        }
        return true;
    },
    deleteWorker: async (id) => {
        MOCK_WORKERS = MOCK_WORKERS.filter(w => w.id !== id);
        MOCK_SESSIONS = MOCK_SESSIONS.filter(s => s.workerId !== id);
        return true;
    },
    getWorkerSessions: async (workerId) => {
        if(workerId) return MOCK_SESSIONS.filter(s => s.workerId === workerId);
        return [...MOCK_SESSIONS];
    },
    addProduct: async (p) => {
        const newP = { ...p, id: Date.now() } as Product;
        MOCK_PRODUCTS.push(newP);
        return newP;
    },
    updateProduct: async (id, p) => {
        const idx = MOCK_PRODUCTS.findIndex(x => x.id === id);
        MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...p };
        return MOCK_PRODUCTS[idx];
    },
    deleteProduct: async (id) => {
        MOCK_PRODUCTS = MOCK_PRODUCTS.filter(x => x.id !== id);
        MOCK_RENTALS = MOCK_RENTALS.filter(r => r.productId !== id);
        wsService.emit('calendar_refresh_needed', null);
        return true;
    }
};

export const ApiService = USE_MOCK ? MockApi : MockApi;
