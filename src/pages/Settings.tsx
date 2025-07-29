import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Bell, CreditCard, Shield, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Settings = () => {
  const { user, organization } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  if (!user || !organization) return null;

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da organização e do sistema
        </p>
      </div>

      <Tabs defaultValue="organization" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="organization">Organização</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="billing">Faturamento</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações da Organização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Nome da Organização</Label>
                  <Input id="org-name" defaultValue={organization.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-type">Tipo</Label>
                  <Input id="org-type" defaultValue={organization.type} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-address">Endereço</Label>
                <Input id="org-address" defaultValue={organization.address} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-description">Descrição</Label>
                <Textarea 
                  id="org-description" 
                  placeholder="Descrição da organização..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações importantes por email
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações em tempo real no navegador
                  </p>
                </div>
                <Switch 
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Tipos de Notificação</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Novos agendamentos</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cancelamentos</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lembretes de eventos</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Atualizações do sistema</span>
                    <Switch />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informações de Faturamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Plano Atual: Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Próxima cobrança: 15 de agosto de 2024 - R$ 199,90
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Método de Pagamento</h4>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">**** **** **** 1234</p>
                  <p className="text-sm text-muted-foreground">Expires 12/26</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Alterar Plano</Button>
                <Button variant="outline">Atualizar Pagamento</Button>
                <Button variant="outline">Histórico de Faturas</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Ativar 2FA</Label>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Sessões Ativas</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Chrome - Windows</p>
                      <p className="text-xs text-muted-foreground">São Paulo, Brasil - Sessão atual</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Atual
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Safari - macOS</p>
                      <p className="text-xs text-muted-foreground">Rio de Janeiro, Brasil - 2 horas atrás</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Encerrar
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Ações Perigosas</h4>
                <div className="flex gap-2">
                  <Button variant="outline">Alterar Senha</Button>
                  <Button variant="destructive">Excluir Conta</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};