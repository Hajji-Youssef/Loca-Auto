import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { ChatMessage } from '../../types';
import { wsService } from '../../services/websocket';

const SharedInbox: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'Client (Jean)', content: 'Bonjour, est-ce que le SUV est dispo demain ?', timestamp: new Date(Date.now() - 3600000) },
        { id: '2', sender: 'Agence (Sophie)', content: 'Oui, tout à fait. Vous pouvez réserver en ligne.', timestamp: new Date(Date.now() - 1800000) }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        wsService.subscribe('incoming_message', (msg: ChatMessage) => {
            setMessages(prev => [...prev, msg]);
        });
        return () => wsService.unsubscribe('incoming_message', () => {});
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newMessage.trim()) return;

        const msg: ChatMessage = {
            id: Date.now().toString(),
            sender: "Agence (Moi)",
            content: newMessage,
            timestamp: new Date()
        };
        
        // Optimistic update
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
        
        // Emit via WS (mock)
        wsService.emit('send_message', msg);
    };

    return (
        <div className="h-[calc(100vh-8rem)] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="font-bold text-slate-800">Boîte de réception partagée</h2>
                    <p className="text-xs text-slate-500">Tous les agents voient ces messages</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {messages.map((msg) => {
                    const isMe = msg.sender.includes("Agence");
                    const isSystem = msg.isSystem;
                    
                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center">
                                <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">{msg.content}</span>
                            </div>
                        );
                    }

                    return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMe ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                                <User size={14} />
                            </div>
                            <div className={`max-w-[70%]`}>
                                <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'justify-end' : ''}`}>
                                    <span className="text-xs font-bold text-slate-700">{msg.sender}</span>
                                    <span className="text-[10px] text-slate-400">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div className={`p-3 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-3">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrire une réponse..."
                    className="flex-1 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors">
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default SharedInbox;