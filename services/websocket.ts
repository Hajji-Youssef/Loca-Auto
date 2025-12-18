import { ChatMessage, WorkerStatus } from '../types';

// Simulation d'un service WebSocket
// Dans une vraie app, on utiliserait socket.io-client ou l'API WebSocket native

type Listener = (data: any) => void;

class MockWebSocketService {
  private listeners: Map<string, Listener[]> = new Map();
  private intervalId: any;

  constructor() {
    this.startSimulation();
  }

  // S'abonner à un événement (ex: 'message', 'status_change', 'calendar_update')
  subscribe(event: string, callback: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  unsubscribe(event: string, callback: Listener) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      this.listeners.set(event, eventListeners.filter(l => l !== callback));
    }
  }

  // Emettre un événement (utilisé par le client pour envoyer des messages)
  emit(event: string, data: any) {
    // Echo local immédiat
    this.notify(event, data);
    
    // Simulation de réponse serveur ou broadcast
    if (event === 'send_message') {
        // Rien à faire, le broadcast est simulé par le notify ci-dessus pour l'émetteur
    }
  }

  private notify(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(cb => cb(data));
    }
  }

  private startSimulation() {
    // 1. Simuler des collègues qui se connectent/déconnectent
    setInterval(() => {
      const statuses: WorkerStatus[] = [
        { id: 2, name: 'Sophie Martin', status: 'ONLINE', lastActive: 'Maintenant' },
        { id: 3, name: 'Lucas Dubois', status: 'BUSY', lastActive: 'Il y a 5 min' },
        { id: 4, name: 'Admin Système', status: 'ONLINE', lastActive: 'Maintenant' }
      ];
      // Randomly change a status
      if(Math.random() > 0.7) {
        statuses[1].status = Math.random() > 0.5 ? 'ONLINE' : 'OFFLINE';
        this.notify('online_users_update', statuses);
      }
    }, 5000);

    // 2. Simuler des messages entrants de clients ou notifications système
    setInterval(() => {
      if (Math.random() > 0.8) {
        const msg: ChatMessage = {
          id: Date.now().toString(),
          sender: "Système",
          content: "Nouvelle réservation confirmée pour Tesla Model 3 (12-14 Dec).",
          timestamp: new Date(),
          isSystem: true
        };
        this.notify('incoming_message', msg);
        // Cela devrait aussi trigger un refresh du calendrier
        this.notify('calendar_refresh_needed', null);
      }
    }, 15000);
  }
}

export const wsService = new MockWebSocketService();