import React, { useState, useEffect } from 'react';
import { DayAvailability } from '../types';
import { ApiService } from '../services/api';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, MousePointerClick } from 'lucide-react';

interface CalendarProps {
    carId: number;
    readOnly?: boolean;
    onDateSelect?: (start: string | null, end: string | null) => void;
    selectedStart?: string;
    selectedEnd?: string;
    compact?: boolean; // Nouvelle prop pour l'affichage en mode carte
}

const Calendar: React.FC<CalendarProps> = ({ 
    carId, 
    readOnly = false, 
    onDateSelect,
    selectedStart,
    selectedEnd,
    compact = false
}) => {
    const [days, setDays] = useState<DayAvailability[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewOffset, setViewOffset] = useState(30);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await ApiService.fetchCarAvailabilityCalendar(carId);
                setDays(data);
            } catch (error) {
                console.error("Failed to load calendar", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [carId]);

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        setViewOffset(prev => Math.min(prev + 5, days.length - 10)); // Déplacement plus fluide
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        setViewOffset(prev => Math.max(prev - 5, 0));
    };

    const handleDayClick = (day: DayAvailability) => {
        if (readOnly || day.isReserved) return;
        if (!onDateSelect) return;

        const dateStr = day.date.toISOString().split('T')[0];

        if (!selectedStart || (selectedStart && selectedEnd)) {
            onDateSelect(dateStr, ""); 
        } else if (selectedStart && !selectedEnd) {
            if (new Date(dateStr) < new Date(selectedStart)) {
                onDateSelect(dateStr, "");
            } else {
                onDateSelect(selectedStart, dateStr);
            }
        }
    };

    const isInRange = (date: Date) => {
        if (!selectedStart || !selectedEnd) return false;
        const s = new Date(selectedStart);
        const e = new Date(selectedEnd);
        return date > s && date < e;
    };

    const isStart = (date: Date) => selectedStart && date.toISOString().split('T')[0] === selectedStart;
    const isEnd = (date: Date) => selectedEnd && date.toISOString().split('T')[0] === selectedEnd;

    if (loading) return (
        <div className={`flex flex-col items-center justify-center text-gray-400 bg-gray-50 animate-pulse border border-gray-100 ${compact ? 'h-32 rounded-xl' : 'h-40 rounded-3xl'}`}>
            <CalendarIcon size={24} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">Chargement...</span>
        </div>
    );

    // On affiche 10 jours. En mode compact/mobile, cela fera 2 lignes de 5.
    const DISPLAY_COUNT = 10;
    const currentVisibleDays = days.slice(viewOffset, viewOffset + DISPLAY_COUNT);

    const currentMonthLabel = currentVisibleDays.length > 0 
        ? currentVisibleDays[0].date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }) 
        : '';

    // Styles dynamiques selon le mode compact ou complet
    const containerClasses = compact 
        ? "bg-gray-50/50 rounded-xl border border-gray-100 p-3 w-full"
        : "bg-white rounded-3xl shadow-sm border border-gray-200 p-6 w-full";

    const headerClasses = compact ? "mb-3 text-sm" : "mb-6 text-lg";
    
    // Grille : 5 cols sur mobile/tablette, 10 cols sur grand écran (sauf si compact, on garde 5 cols pour lisibilité)
    const gridClasses = compact 
        ? "grid grid-cols-5 gap-1.5" // En compact: toujours 5 colonnes (donc 2 lignes) pour être plus large
        : "grid grid-cols-5 lg:grid-cols-10 gap-2"; 

    return (
        <div className={`${containerClasses} select-none relative overflow-hidden`}>
            {/* Header du calendrier */}
            <div className={`flex justify-between items-center ${headerClasses}`}>
                <div className="flex items-center gap-2 text-gray-800 font-bold capitalize">
                    {!compact && (
                        <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600 shadow-sm">
                            <CalendarIcon size={20} />
                        </div>
                    )}
                    <span>{currentMonthLabel}</span>
                </div>
                <div className="flex gap-1">
                    <button onClick={handlePrev} className={`hover:bg-gray-200 border border-gray-200 rounded-lg transition-all text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent ${compact ? 'p-1' : 'p-2'}`} disabled={viewOffset === 0}>
                        <ChevronLeft size={compact ? 16 : 20} />
                    </button>
                    <button onClick={handleNext} className={`hover:bg-gray-200 border border-gray-200 rounded-lg transition-all text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent ${compact ? 'p-1' : 'p-2'}`} disabled={viewOffset >= days.length - DISPLAY_COUNT}>
                        <ChevronRight size={compact ? 16 : 20} />
                    </button>
                </div>
            </div>

            {/* Grille des jours */}
            <div className={gridClasses}>
                {currentVisibleDays.map((day, idx) => {
                    const isToday = day.date.toDateString() === new Date().toDateString();
                    const dayName = day.date.toLocaleString('fr-FR', { weekday: 'short' }).replace('.', '');
                    
                    const isSelectedStart = isStart(day.date);
                    const isSelectedEnd = isEnd(day.date);
                    const isRange = isInRange(day.date);
                    
                    let bgClass = 'bg-white border-gray-100 text-gray-700 hover:border-primary-300';
                    let textClass = 'text-gray-800';
                    
                    if (day.isReserved) {
                        bgClass = 'bg-gray-100 border-transparent opacity-60 cursor-not-allowed';
                        textClass = 'text-gray-400 decoration-red-400/50 line-through';
                    } else if (isSelectedStart || isSelectedEnd) {
                        bgClass = 'bg-primary-600 border-primary-600 text-white shadow-md scale-105 z-10';
                        textClass = 'text-white';
                    } else if (isRange) {
                        bgClass = 'bg-primary-50 border-primary-100 text-primary-700';
                    }

                    return (
                        <div 
                            key={idx}
                            onClick={() => handleDayClick(day)}
                            className={`
                                relative flex flex-col items-center justify-center rounded-xl border transition-all duration-200 ease-out
                                ${compact ? 'h-16 text-sm' : 'h-24'}
                                ${bgClass}
                                ${!readOnly && !day.isReserved ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}
                                ${isToday && !isSelectedStart && !isSelectedEnd ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
                            `}
                        >
                            <span className={`uppercase font-bold mb-0.5 tracking-wide ${isSelectedStart || isSelectedEnd ? 'text-primary-100' : 'text-gray-400'} ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
                                {dayName}
                            </span>
                            <span className={`font-bold ${textClass} ${compact ? 'text-base' : 'text-xl'}`}>
                                {day.date.getDate()}
                            </span>
                            
                            {!isSelectedStart && !isSelectedEnd && !isRange && (
                                <div className={`mt-1 rounded-full ${day.isReserved ? 'bg-red-400' : 'bg-emerald-400'} ${compact ? 'w-1 h-1' : 'w-1.5 h-1.5'}`}></div>
                            )}

                            {(isSelectedStart) && <span className="absolute -bottom-2 bg-primary-700 text-white text-[8px] px-1.5 py-0.5 rounded-full z-20">DÉPART</span>}
                            {(isSelectedEnd) && <span className="absolute -bottom-2 bg-gray-900 text-white text-[8px] px-1.5 py-0.5 rounded-full z-20">RETOUR</span>}
                        </div>
                    );
                })}
            </div>

            {/* Légende */}
            <div className={`flex items-center justify-between text-xs text-gray-500 font-medium px-1 ${compact ? 'mt-4' : 'mt-8'}`}>
                {!readOnly ? (
                    <div className="hidden sm:flex items-center gap-2 text-primary-600 bg-primary-50 px-2 py-1 rounded-lg animate-pulse">
                         <MousePointerClick size={14} />
                         <span>Sélectionner</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5">
                        <Info size={14} />
                        <span>Disponibilités</span>
                    </div>
                )}

                <div className="flex gap-3 ml-auto">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-400 rounded-full"></div> Libre</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-gray-300 rounded-full opacity-50"></div> Occupé</div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;