import { Attendee, Event, Organization, Room, User } from "@/types";

export const organizations: Organization[] = [
  {
    id: "1",
    name: "Mp acessorios de bateria",
    slug: "uni-tech",
    description: "Centro de inovação e tecnologia",
    logo: "🎓",
    type: "Universidade",
    address: "Av. Tecnologia, 123 - São Paulo, SP",
  },
];

export const users: User[] = [
  {
    id: "1",
    name: "Admin Bruno",
    email: "admin@unitech.com",
    role: "admin",
    organizationId: "1",
    avatar: "👨‍💼",
  },
  {
    id: "2",
    name: "Prof. Max pau no cu",
    email: "maria@unitech.com",
    role: "teacher",
    organizationId: "1",
    avatar: "👩‍🏫",
  },
  {
    id: "3",
    name: "João Estudante",
    email: "joao@unitech.com",
    role: "student",
    organizationId: "1",
    avatar: "🧑‍🎓",
  },
  {
    id: "4",
    name: "Ana Designer",
    email: "ana@creative.com",
    role: "teacher",
    organizationId: "2",
    avatar: "👩‍🎨",
  },
];

export const rooms: Room[] = [
  {
    id: "1",
    name: "Sala de bateria premium",
    description: "Auditório com capacidade para grandes eventos",
    capacity: 4,
    equipment: [
      "Projetor 4K",
      "Sistema de Som",
      "bateria pearl",
      "Ar Condicionado",
      "metronomo",
    ],
    organizationId: "1",
    availability: {
      days: [1, 2, 3, 4, 5], // Mon-Fri
      startTime: "08:00",
      endTime: "22:00",
    },
    pricePerHour: 150,
    location: "Mp - 1º Andar",
    isAvailable: true,
    resources: ["Wi-Fi", "Estacionamento"],
  },
  {
    id: "2",
    name: "Sala de bateria basica",
    description: "Laboratório com 30 computadores",
    capacity: 2,
    equipment: ["30 Computadores", "Projetor", "Quadro Digital", "Wi-Fi"],
    organizationId: "1",
    availability: {
      days: [1, 2, 3, 4, 5],
      startTime: "07:00",
      endTime: "23:00",
    },
    pricePerHour: 80,
    location: "Mp - 1º Andar",
    isAvailable: true,
    resources: [""],
  },
];

export const events: Event[] = [
  {
    id: "1",
    title: "Workshop de React Avançado",
    description: "Aprenda técnicas avançadas de React e hooks personalizados",
    roomId: "2",
    organizerId: "2",
    startDate: new Date(2025, 0, 30, 14, 0), // 30/01/2025 14:00
    endDate: new Date(2025, 0, 30, 17, 0), // 30/01/2025 17:00
    isPublic: true,
    maxAttendees: 25,
    price: 240,
    status: "confirmed",
    publicLink: "workshop-react-avancado-123",
    attendees: [
      {
        id: "1",
        name: "João Estudante",
        email: "joao@unitech.com",
        userId: "3",
        status: "confirmed",
      },
      {
        id: "2",
        name: "Pedro Silva",
        email: "pedro@email.com",
        status: "pending",
      },
    ],
    // Propriedades derivadas
    organizationId: "1",
    createdBy: "2",
    date: "2025-01-30",
    startTime: "14:00",
    endTime: "17:00",
    roomName: "Lab de Informática",
  },
  {
    id: "2",
    title: "Palestra: IA no Futuro",
    description: "Como a Inteligência Artificial moldará os próximos 10 anos",
    roomId: "1",
    organizerId: "2",
    startDate: new Date(2025, 1, 5, 19, 0), // 05/02/2025 19:00
    endDate: new Date(2025, 1, 5, 21, 0), // 05/02/2025 21:00
    isPublic: true,
    maxAttendees: 180,
    price: 300,
    status: "confirmed",
    publicLink: "palestra-ia-futuro-456",
    attendees: [
      {
        id: "3",
        name: "Maria Costa",
        email: "maria@email.com",
        status: "confirmed",
      },
      {
        id: "4",
        name: "Carlos Tech",
        email: "carlos@tech.com",
        status: "confirmed",
      },
      {
        id: "5",
        name: "Ana Developer",
        email: "ana@dev.com",
        status: "pending",
      },
    ],
    // Propriedades derivadas
    organizationId: "1",
    createdBy: "2",
    date: "2025-02-05",
    startTime: "19:00",
    endTime: "21:00",
    roomName: "Auditório Principal",
  },
  {
    id: "3",
    title: "Reunião de Planejamento",
    description: "Planejamento estratégico para Q1 2025",
    roomId: "3",
    organizerId: "1",
    startDate: new Date(2025, 1, 10, 9, 0), // 10/02/2025 09:00
    endDate: new Date(2025, 1, 10, 12, 0), // 10/02/2025 12:00
    isPublic: false,
    price: 360,
    status: "pending",
    attendees: [],
    // Propriedades derivadas
    organizationId: "1",
    createdBy: "1",
    date: "2025-02-10",
    startTime: "09:00",
    endTime: "12:00",
    roomName: "Sala de Reunião VIP",
  },
];

// Mock do usuário logado atual
export const currentUser: User = users[1]; // Prof. Maria Santos

// Função para simular login
export const loginUser = (email: string): User | null => {
  return users.find((user) => user.email === email) || null;
};

// Função para obter salas por organização
export const getRoomsByOrganization = (organizationId: string): Room[] => {
  return rooms.filter((room) => room.organizationId === organizationId);
};

// Função para obter eventos por organização
export const getEventsByOrganization = (organizationId: string): Event[] => {
  const orgRooms = getRoomsByOrganization(organizationId);
  const roomIds = orgRooms.map((room) => room.id);
  return events.filter((event) => roomIds.includes(event.roomId));
};

// Função para obter eventos públicos
export const getPublicEvents = (): Event[] => {
  return events.filter(
    (event) => event.isPublic && event.status === "confirmed"
  );
};
