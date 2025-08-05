export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  picture?: string;
  role: 'admin' | 'teacher' | 'student';
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  type?: string;
  address?: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  equipment: string[];
  organizationId: string;
  availability: {
    days: number[]; // 0-6 (Sun-Sat)
    startTime: string; // "09:00"
    endTime: string; // "18:00"
  };
  pricePerHour: number;
  location?: string;
  isAvailable?: boolean;
  resources?: string[];
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  roomId: string;
  organizerId: string;
  startDate: Date;
  endDate: Date;
  isPublic: boolean;
  maxAttendees?: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  publicLink?: string;
  attendees: Attendee[];
  // Propriedades derivadas para compatibilidade
  organizationId?: string;
  createdBy?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  roomName?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  userId?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
}