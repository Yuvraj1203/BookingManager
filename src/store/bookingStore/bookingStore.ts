import { zustandStorage } from '@/App';
import { nanoid } from 'nanoid/non-secure';
import { ImagePickerResponse } from 'react-native-image-picker';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type BookingType = {
  id: string;
  clientName: string;
  mobile: string;
  date: string;
  time: string;
  horses: string;
  venue: string;
  totalAmount: string;
  duration?: string;
  addOns?: string;
  advancePaid?: string;
  status?: string;
  notes?: string;
  images?: ImagePickerResponse[];
  createdAt: string;
  updatedAt: string;
};

export type CurrentWeekBookingDetails = BookingType & {
  day: string;
  dayShort: string;
  isToday: boolean;
};

export type AddBookingInput = Omit<
  BookingType,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateBookingInput = Partial<AddBookingInput>;

type BookingStoreProps = {
  bookings: BookingType[];
  addBooking: (value: AddBookingInput) => BookingType;
  getBookings: () => BookingType[];
  getBookingById: (id: string) => BookingType | undefined;
  updateBooking: (id: string, value: UpdateBookingInput) => void;
  deleteBooking: (id: string) => void;
};

export const useBookingStore = create<BookingStoreProps>()(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: (value: AddBookingInput) => {
        const now = new Date().toISOString();
        const newBooking: BookingType = {
          ...value,
          id: nanoid(),
          createdAt: now,
          updatedAt: now,
        };
        set({ bookings: [newBooking, ...get().bookings] });
        return newBooking;
      },

      getBookings: () => get().bookings,

      getBookingById: (id: string) =>
        get().bookings.find(booking => booking.id === id),

      updateBooking: (id: string, value: UpdateBookingInput) => {
        set({
          bookings: get().bookings.map(booking =>
            booking.id === id
              ? { ...booking, ...value, updatedAt: new Date().toISOString() }
              : booking,
          ),
        });
      },

      deleteBooking: (id: string) => {
        set({
          bookings: get().bookings.filter(booking => booking.id !== id),
        });
      },
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
