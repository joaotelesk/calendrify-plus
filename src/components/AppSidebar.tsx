import { useAuth } from '@/contexts/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Users,
  Settings,
  PlusCircle,
  CalendarCheck,
  Globe,
} from 'lucide-react';

export const AppSidebar = () => {
  const { user, isAdmin, isTeacher, isStudent } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();

  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  // Menu items baseados no papel do usuário
  const getMenuItems = () => {
    const baseItems = [
      { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
      { title: 'Minha Agenda', url: '/agenda', icon: Calendar },
    ];

    if (isAdmin) {
      return [
        ...baseItems,
        { title: 'Gerenciar Salas', url: '/rooms', icon: MapPin },
        { title: 'Usuários', url: '/users', icon: Users },
        { title: 'Configurações', url: '/settings', icon: Settings },
      ];
    }

    if (isTeacher) {
      return [
        ...baseItems,
        { title: 'Criar Evento', url: '/create-event', icon: PlusCircle },
        { title: 'Meus Eventos', url: '/my-events', icon: CalendarCheck },
        { title: 'Salas Disponíveis', url: '/available-rooms', icon: MapPin },
      ];
    }

    if (isStudent) {
      return [
        ...baseItems,
        { title: 'Eventos Públicos', url: '/public-events', icon: Globe },
        { title: 'Minhas Inscrições', url: '/my-registrations', icon: CalendarCheck },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && 'Menu Principal'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'hover:bg-muted/50'
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Seção de acesso rápido */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && 'Acesso Rápido'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/public"
                    className="hover:bg-muted/50"
                  >
                    <Globe className="h-4 w-4" />
                    {!isCollapsed && <span>Área Pública</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};