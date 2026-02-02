import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingSystemProps {
  title?: string;
  subtitle?: string;
  serviceName?: string;
  duration?: number; // in minutes
  availableSlots?: TimeSlot[];
  onBookingConfirm?: (date: Date, time: string) => void;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  title,
  subtitle,
  serviceName = 'Service',
  duration = 60,
  availableSlots,
  onBookingConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [step, setStep] = useState<'date' | 'time' | 'confirm'>('date');

  const generateTimeSlots = (): TimeSlot[] => {
    if (availableSlots) return availableSlots;
    
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        slots.push({
          time,
          available: Math.random() > 0.3, // 70% availability
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('confirm');
  };

  const handleConfirm = () => {
    onBookingConfirm?.(selectedDate, selectedTime);
    // Reset
    setStep('date');
    setSelectedTime('');
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl text-slate-600">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-100 p-8">
          <AnimatePresence mode="wait">
            {step === 'date' && (
              <motion.div
                key="date"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    Select Date
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <span className="text-lg font-bold text-slate-900 min-w-[200px] text-center">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
                      {day}
                    </div>
                  ))}
                  {getDaysInMonth(selectedDate).map((date, index) => {
                    if (!date) return <div key={index} />;
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isPast = date < new Date() && !isToday;
                    const isSelected = date.toDateString() === selectedDate.toDateString();

                    return (
                      <button
                        key={date.toDateString()}
                        onClick={() => !isPast && handleDateSelect(date)}
                        disabled={isPast}
                        className={`p-3 rounded-xl font-bold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : isPast
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'hover:bg-indigo-50 text-slate-700'
                        } ${isToday && !isSelected ? 'ring-2 ring-indigo-300' : ''}`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 'time' && (
              <motion.div
                key="time"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-indigo-600" />
                    Select Time
                  </h3>
                  <button
                    onClick={() => setStep('date')}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Change Date
                  </button>
                </div>

                <div className="text-center mb-6">
                  <p className="text-slate-600 mb-2">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-slate-500">Duration: {duration} minutes</p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-xl font-bold transition-all ${
                        selectedTime === slot.time
                          ? 'bg-indigo-600 text-white'
                          : slot.available
                          ? 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-2 border-slate-200 hover:border-indigo-300'
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed border-2 border-transparent'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Confirm Booking</h3>
                  <p className="text-slate-600">Review your booking details</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">Service</span>
                    <span className="font-bold text-slate-900">{serviceName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">Date</span>
                    <span className="font-bold text-slate-900">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">Time</span>
                    <span className="font-bold text-slate-900">{selectedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">Duration</span>
                    <span className="font-bold text-slate-900">{duration} minutes</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('time')}
                    className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Confirm Booking
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

