export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'teacher' | 'student';
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
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