
import { Product, ProductCategory, Rental, RentalStatus, PaymentStatus, RentalRequest, DayAvailability, WorkerSession, Worker } from '../types';

const USE_MOCK = true; 
const API_BASE_URL = "http://localhost:8080/api";

export interface ApiClient {
    getAllProducts(): Promise<Product[]>;
    getMyRentals(): Promise<Rental[]>;
    checkAvailability(productId: number, startDate: string, endDate: string): Promise<boolean>;
    findAvailableProducts(startDate: string, endDate: string): Promise<number[]>;
    fetchCarAvailabilityCalendar(productId: number | string): Promise<DayAvailability[]>;
    createRental(rentalData: RentalRequest): Promise<boolean>;
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

// ==========================================
// MOCK DATA GENERATOR (ACCURATE & MASSIVE)
// ==========================================

const generateMassiveFleet = (): Product[] => {
    const baseFleet: any[] = [
        // TESLA
        { id: 1, title: "Tesla Model 3 Performance", category: ProductCategory.ELECTRIQUE, imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800", price: 120 },
        { id: 2, title: "Tesla Model Y Long Range", category: ProductCategory.ELECTRIQUE, imageUrl: "https://hips.hearstapps.com/hmg-prod/images/2026-tesla-model-y-long-range-awd-121-688bc237a2711.jpg?crop=0.615xw:0.519xh;0.0865xw,0.365xh&resize=2048:*", price: 140 },
        { id: 3, title: "Tesla Model S Plaid", category: ProductCategory.LUXE, imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800", price: 250 },
        // PEUGEOT
        { id: 4, title: "Peugeot 3008 GT", category: ProductCategory.SUV, imageUrl: "https://tunisieauto.tn/wp-content/uploads/2020/03/3008-GT-01.jpg", price: 85 },
        { id: 5, title: "Peugeot 208 e-208", category: ProductCategory.ELECTRIQUE, imageUrl: "https://media.drivingelectric.com/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1726664991/drivingelectric/2024/09/Peugeot%20E-208%201_vcs4rs.jpg", price: 65 },
        { id: 6, title: "Peugeot 508 SW", category: ProductCategory.BERLINE, imageUrl: "https://www.topgear.com/sites/default/files/2024/01/1%20Peugeot%20508%20SW%20review.jpg", price: 95 },
        // AUDI
        { id: 7, title: "Audi Q3 Sportback", category: ProductCategory.SUV, imageUrl: "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=800https://catalogue.automobile.tn/big/2025/06/47407.jpg?t=1761130530", price: 210 },
        { id: 8, title: "Audi A4 Avant", category: ProductCategory.BERLINE, imageUrl: "https://www.topgear.com/sites/default/files/cars-car/image/2021/03/audiuk0002285520audi20a420avant.jpg", price: 105 },
        { id: 9, title: "Audi e-tron GT", category: ProductCategory.LUXE, imageUrl: "https://www.bauerparis.fr/wp-content/uploads/2024/06/Nouvelle-Audi-RS-e-tron-GT-Performance-BD.webp", price: 280 },
        // BMW
        { id: 10, title: "BMW Série 4 Cabriolet", category: ProductCategory.SPORTIVE, imageUrl: "https://images.caradisiac.com/logos-ref/modele/modele--bmw-serie-4-f33-cabriolet/S0-modele--bmw-serie-4-f33-cabriolet.jpg", price: 150 },
        { id: 11, title: "BMW X5 xDrive", category: ProductCategory.SUV, imageUrl: "https://www.largus.fr/images/styles/max_1300x1300/public/images/bmw-x5-hybride-2020-01.jpg?itok=94JHZrKf", price: 180 },
        { id: 12, title: "Hyundai i 10", category: ProductCategory.SPORTIVE, imageUrl: "https://catalogue.automobile.tn/big/2023/12/46462.jpg?t=1", price: 220 },
        // MERCEDES
        { id: 13, title: "Mercedes Classe S", category: ProductCategory.LUXE, imageUrl: "https://news.automobile.tn/2020/09/nouvelle-mercedes-classe-s-1592_max_home.jpg?t=1600116118", price: 350 },
        { id: 14, title: "Mercedes Classe G", category: ProductCategory.LUXE, imageUrl: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800", price: 450 },
        { id: 15, title: "Mercedes Sprinter", category: ProductCategory.UTILITAIRE, imageUrl: "https://assets.mbvans.com/e_trim/Mercedes-Benz-Vans/Canada/BYO/2021/Sprinter/cargo-van/MY19_2C1444_SI_SR_9147_DS", price: 90 },
        // FIAT
        { id: 16, title: "Fiat 500 Hybrid", category: ProductCategory.BERLINE, imageUrl: "https://www.fiat-official.tn/content/dam/fiat2023/cross/models/500/500/canvas/canvas-4/mobile.jpg", price: 45 },
        { id: 17, title: "Fiat 500e Cabriolet", category: ProductCategory.ELECTRIQUE, imageUrl: "https://0cd4706d-085c-470e-97c9-b10facf8e101.svc.edge.scw.cloud/photos/1e2f4dd4e75c039967d8cb733324d0a9/stock_698/image_2230122_15.jpg", price: 75 },
        // PORSCHE
        { id: 18, title: "Kia Picanto", category: ProductCategory.SPORTIVE, imageUrl: "https://images.caradisiac.com/logos/2/6/2/2/282622/S0-la-kia-picanto-2024-plus-chere-que-la-citroen-c3-208617.jpg", price: 80 },
        { id: 19, title: "Kia rio", category: ProductCategory.ELECTRIQUE, imageUrl: "https://im.qccdn.fr/node/actualite-kia-rio-premieres-impressions-24289/thumbnail_1000x600px-135166.jpg", price: 75 },
        // VOLKSWAGEN
        { id: 20, title: "kia rio ", category: ProductCategory.BERLINE, imageUrl: "https://vitotrip.com/uploads/0000/273/2025/10/30/capture3.JPG", price: 85 },
        { id: 21, title: "Dacia Sandero", category: ProductCategory.SUV, imageUrl: "https://www.dacia.tn/CountriesData/Tunisia/images/cars/SanderoBJIph12020/Beautyshot/sandero-banner_ig_w1500_h517.jpg", price: 95 },
        // FORD
        { id: 22, title: "Ford Mustang GT", category: ProductCategory.SPORTIVE, imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800", price: 190 },
        { id: 23, title: "Ford Ranger Raptor", category: ProductCategory.UTILITAIRE, imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800", price: 130 },
        //RENAULT
        { id: 24, title: "Megane", category: ProductCategory.UTILITAIRE, imageUrl: "https://images.caradisiac.com/logos/7/2/3/3/187233/S0-Renault-Megane-la-star-de-l-occasion-en-France-103777.jpg", price: 100 },
        { id: 25, title: "Renault kwid", category: ProductCategory.UTILITAIRE, imageUrl: "https://www.car2020.fr/wp-content/uploads/renault-kwid-2020.jpg", price: 100 },
    ];

    // Générer jusqu'à 50 véhicules en variant les noms
    const fullFleet: Product[] = [];
    for (let i = 0; i < 50; i++) {
        const base = baseFleet[i % baseFleet.length];
        fullFleet.push({
            id: i + 1,
            title: i < baseFleet.length ? base.title : `${base.title} Ed. ${i}`,
            description: "Véhicule premium, révisé et prêt pour la route. Confort et sécurité garantis par LocaAuto.",
            pricePerDay: base.price,
            category: base.category,
            imageUrl: base.imageUrl,
            available: true,
            transmission: i % 2 === 0 ? 'Automatique' : 'Manuelle',
            fuelType: i % 3 === 0 ? 'Essence' : (i % 3 === 1 ? 'Diesel' : 'Électrique'),
            seats: base.category === ProductCategory.SUV ? 5 : (base.category === ProductCategory.LUXE ? 4 : 5),
            options: ["GPS", "Bluetooth", "Climatisation"],
            usageCategory: i % 5 === 0 ? 'FOR_SALE' : 'FOR_RENT'
        });
    }
    return fullFleet;
};

// ÉTAT GLOBAL PERSISTANT (SIMULATION BDD)
let MOCK_PRODUCTS: Product[] = generateMassiveFleet();
let MOCK_RENTALS: Rental[] = [
    {
        id: 101,
        productId: 1,
        productTitle: "Tesla Model 3 Performance",
        productImage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
        startDate: "2024-03-01",
        endDate: "2024-03-05",
        totalPrice: 480,
        status: RentalStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        clientName: "Alice Durand"
    }
];

const isOverlapping = (start1: string, end1: string, start2: string, end2: string) => {
    const s1 = new Date(start1).getTime();
    const e1 = new Date(end1).getTime();
    const s2 = new Date(start2).getTime();
    const e2 = new Date(end2).getTime();
    return s1 <= e2 && e1 >= s2;
};

export const MockApi: ApiClient = {
    getAllProducts: async () => MOCK_PRODUCTS,
    getMyRentals: async () => MOCK_RENTALS,
    checkAvailability: async (productId, start, end) => !MOCK_RENTALS.some(r => r.productId === productId && r.status !== RentalStatus.CANCELLED && isOverlapping(start, end, r.startDate, r.endDate)),
    findAvailableProducts: async (start, end) => {
        const unavailable = new Set(MOCK_RENTALS.filter(r => r.status !== RentalStatus.CANCELLED && isOverlapping(start, end, r.startDate, r.endDate)).map(r => r.productId));
        return MOCK_PRODUCTS.filter(p => !unavailable.has(p.id) && p.available).map(p => p.id);
    },
    fetchCarAvailabilityCalendar: async (productId) => {
        const productRentals = MOCK_RENTALS.filter(r => r.productId === Number(productId) && r.status !== RentalStatus.CANCELLED);
        const days: DayAvailability[] = [];
        const today = new Date();
        for (let i = -10; i < 40; i++) {
            const d = new Date(today); d.setDate(today.getDate() + i);
            const dStr = d.toISOString().split('T')[0];
            const isReserved = productRentals.some(r => isOverlapping(dStr, dStr, r.startDate, r.endDate));
            days.push({ date: d, isReserved });
        }
        return days;
    },
    createRental: async (data) => {
        const p = MOCK_PRODUCTS.find(x => x.id === data.productId);
        MOCK_RENTALS.push({
            id: Date.now(),
            productId: data.productId,
            productTitle: p?.title || "Véhicule",
            productImage: p?.imageUrl || "",
            startDate: data.startDate,
            endDate: data.endDate,
            totalPrice: data.totalPrice,
            status: RentalStatus.ACTIVE,
            paymentStatus: PaymentStatus.PAID,
            clientName: "Client Connecté"
        });
        return true;
    },
    updateProductMission: async (id, mission) => {
        const p = MOCK_PRODUCTS.find(x => x.id === id);
        if (p) p.currentMission = mission;
        return true;
    },
    updateProductStatus: async (id, avail) => {
        const p = MOCK_PRODUCTS.find(x => x.id === id);
        if (p) p.available = avail;
        return true;
    },
    getAllRentalsForCalendar: async () => MOCK_RENTALS,
    cancelRental: async (id) => {
        const r = MOCK_RENTALS.find(x => x.id === id);
        if (r) r.status = RentalStatus.CANCELLED;
        return true;
    },
    updateRental: async (id, data) => {
        const idx = MOCK_RENTALS.findIndex(x => x.id === id);
        if (idx !== -1) MOCK_RENTALS[idx] = { ...MOCK_RENTALS[idx], ...data };
        return true;
    },
    getAllWorkers: async () => [],
    saveWorker: async () => true,
    deleteWorker: async () => true,
    getWorkerSessions: async () => [],
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
        return true;
    }
};

export const ApiService = USE_MOCK ? MockApi : MockApi; // Fallback real-api omitted for brevity
