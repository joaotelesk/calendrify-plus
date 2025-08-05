import axios from 'axios';
import { User, Organization, Room, Event, Attendee, Booking } from '@/types';

// Configure axios with base URL - replace with your API URL
const api = axios.create({
  baseURL: 'https://your-api-url.com/api/v1', // REPLACE WITH YOUR API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (googleToken: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/google', { token: googleToken });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Organization Services
export const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    const response = await api.get('/organizations');
    return response.data;
  },

  getById: async (id: string): Promise<Organization> => {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
  },

  create: async (organization: Omit<Organization, 'id'>): Promise<Organization> => {
    const response = await api.post('/organizations', organization);
    return response.data;
  },

  update: async (id: string, organization: Partial<Organization>): Promise<Organization> => {
    const response = await api.put(`/organizations/${id}`, organization);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/organizations/${id}`);
  },
};

// User Services
export const userService = {
  getByOrganization: async (organizationId: string): Promise<User[]> => {
    const response = await api.get(`/users?organizationId=${organizationId}`);
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post('/users', user);
    return response.data;
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  invite: async (email: string, organizationId: string, role: string): Promise<void> => {
    await api.post('/users/invite', { email, organizationId, role });
  },
};

// Room Services
export const roomService = {
  getByOrganization: async (organizationId: string): Promise<Room[]> => {
    const response = await api.get(`/rooms?organizationId=${organizationId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Room> => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  getAvailable: async (organizationId: string, startDate: string, endDate: string): Promise<Room[]> => {
    const response = await api.get(`/rooms/available?organizationId=${organizationId}&startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  create: async (room: Omit<Room, 'id'>): Promise<Room> => {
    const response = await api.post('/rooms', room);
    return response.data;
  },

  update: async (id: string, room: Partial<Room>): Promise<Room> => {
    const response = await api.put(`/rooms/${id}`, room);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/rooms/${id}`);
  },

  checkAvailability: async (roomId: string, startDate: string, endDate: string): Promise<boolean> => {
    const response = await api.get(`/rooms/${roomId}/availability?startDate=${startDate}&endDate=${endDate}`);
    return response.data.available;
  },
};

// Event Services
export const eventService = {
  getAll: async (filters?: { organizationId?: string; isPublic?: boolean; status?: string }): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (filters?.organizationId) params.append('organizationId', filters.organizationId);
    if (filters?.isPublic !== undefined) params.append('isPublic', String(filters.isPublic));
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/events?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  getByOrganizer: async (organizerId: string): Promise<Event[]> => {
    const response = await api.get(`/events?organizerId=${organizerId}`);
    return response.data;
  },

  getUserEvents: async (userId: string): Promise<Event[]> => {
    const response = await api.get(`/events/user/${userId}`);
    return response.data;
  },

  getPublic: async (): Promise<Event[]> => {
    const response = await api.get('/events/public');
    return response.data;
  },

  create: async (event: Omit<Event, 'id' | 'attendees'>): Promise<Event> => {
    const response = await api.post('/events', event);
    return response.data;
  },

  update: async (id: string, event: Partial<Event>): Promise<Event> => {
    const response = await api.put(`/events/${id}`, event);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  addAttendee: async (eventId: string, attendee: Omit<Attendee, 'id'>): Promise<Attendee> => {
    const response = await api.post(`/events/${eventId}/attendees`, attendee);
    return response.data;
  },

  removeAttendee: async (eventId: string, attendeeId: string): Promise<void> => {
    await api.delete(`/events/${eventId}/attendees/${attendeeId}`);
  },

  updateAttendeeStatus: async (eventId: string, attendeeId: string, status: string): Promise<Attendee> => {
    const response = await api.put(`/events/${eventId}/attendees/${attendeeId}`, { status });
    return response.data;
  },
};

// Booking Services
export const bookingService = {
  create: async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },

  getByUser: async (userId: string): Promise<Booking[]> => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updatePaymentStatus: async (id: string, status: string, paymentId?: string): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}/payment`, { status, paymentId });
    return response.data;
  },

  cancel: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};

// Payment Services
export const paymentService = {
  createPayment: async (bookingId: string, amount: number): Promise<{ paymentUrl: string; paymentId: string }> => {
    const response = await api.post('/payments/create', { bookingId, amount });
    return response.data;
  },

  confirmPayment: async (paymentId: string): Promise<{ status: string }> => {
    const response = await api.post(`/payments/${paymentId}/confirm`);
    return response.data;
  },

  getPaymentStatus: async (paymentId: string): Promise<{ status: string }> => {
    const response = await api.get(`/payments/${paymentId}/status`);
    return response.data;
  },
};

// Statistics Services
export const statsService = {
  getDashboardStats: async (organizationId: string): Promise<{
    totalRooms: number;
    totalEvents: number;
    upcomingEvents: number;
    totalRevenue: number;
  }> => {
    const response = await api.get(`/stats/dashboard?organizationId=${organizationId}`);
    return response.data;
  },

  getRevenueStats: async (organizationId: string, period: string): Promise<any[]> => {
    const response = await api.get(`/stats/revenue?organizationId=${organizationId}&period=${period}`);
    return response.data;
  },
};

export default api;