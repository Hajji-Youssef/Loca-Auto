import React, { useState, useEffect } from 'react';
import { WorkerStatus } from '../../types';
import { wsService } from '../../services/websocket';

const OnlineUserList: React.FC = () => {
    const [users, setUsers] = useState<WorkerStatus[]>([
        { id: 2, name: 'Sophie Martin', status: 'ONLINE', lastActive: 'Maintenant' },
        { id: 3, name: 'Lucas Dubois', status: 'BUSY', lastActive: 'Il y a 5 min' },
    ]);

    useEffect(() => {
        // Listen to real-time status updates
        wsService.subscribe('online_users_update', (updatedList: WorkerStatus[]) => {
            setUsers(updatedList);
        });
        return () => wsService.unsubscribe('online_users_update', () => {});
    }, []);

    const getStatusDot = (status: string) => {
        switch(status) {
            case 'ONLINE': return 'bg-green-500';
            case 'BUSY': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <ul className="space-y-3">
            {users.map(user => (
                <li key={user.id} className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${getStatusDot(user.status)}`}></div>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm text-slate-300 font-medium truncate group-hover:text-white transition-colors">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.status === 'BUSY' ? 'En rendez-vous' : user.status === 'ONLINE' ? 'Disponible' : 'Absent'}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default OnlineUserList;