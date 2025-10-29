import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { toast } = useToast();
  const userId = 'USER123';
  const referralLink = `https://card.example.com/ref/${userId}`;

  const stats = {
    totalReferrals: 8,
    activeReferrals: 5,
    totalEarned: 1000,
    pendingEarned: 600,
    completedReferrals: 5,
  };

  const referrals = [
    { id: 1, name: 'Друг 1', status: 'completed', earned: 200, date: '2024-10-15' },
    { id: 2, name: 'Друг 2', status: 'pending', earned: 0, date: '2024-10-20' },
    { id: 3, name: 'Друг 3', status: 'completed', earned: 200, date: '2024-10-18' },
    { id: 4, name: 'Друг 4', status: 'pending', earned: 0, date: '2024-10-22' },
    { id: 5, name: 'Друг 5', status: 'completed', earned: 200, date: '2024-10-25' },
  ];

  const achievements = [
    { id: 1, title: 'Первый друг', description: 'Пригласите первого друга', completed: true, icon: 'UserPlus' },
    { id: 2, title: 'Отличный старт', description: 'Пригласите 5 друзей', completed: true, icon: 'Users' },
    { id: 3, title: 'Эксперт', description: 'Пригласите 10 друзей', completed: false, icon: 'Award' },
    { id: 4, title: 'Легенда', description: 'Пригласите 25 друзей', completed: false, icon: 'Crown' },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: '🎉 Ссылка скопирована!',
      description: 'Поделитесь ей с друзьями',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                Реферальная программа
              </h1>
              <p className="text-muted-foreground text-lg">
                Приглашайте друзей и зарабатывайте вместе! 🚀
              </p>
            </div>
            <TabsList className="grid grid-cols-2 w-full md:w-auto">
              <TabsTrigger value="home" className="gap-2">
                <Icon name="Home" size={16} />
                Главная
              </TabsTrigger>
              <TabsTrigger value="cabinet" className="gap-2">
                <Icon name="LayoutDashboard" size={16} />
                Кабинет
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="home" className="space-y-8 mt-0">
            <div className="grid md:grid-cols-2 gap-6 animate-scale-in">
              <Card className="gradient-primary text-white border-0 shadow-2xl animate-pulse-glow overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-3xl flex items-center gap-3">
                    <Icon name="Gift" size={32} />
                    Получите 200₽
                  </CardTitle>
                  <CardDescription className="text-white/90 text-lg">
                    За каждого друга, который оформит карту
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg backdrop-blur">
                      <Icon name="Check" size={20} />
                      <span>Друг оформляет карту</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg backdrop-blur">
                      <Icon name="Check" size={20} />
                      <span>Выполняет условия программы</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg backdrop-blur">
                      <Icon name="Coins" size={20} className="animate-bounce-coin" />
                      <span className="font-bold text-xl">Вы получаете 200₽!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="Link" size={24} className="text-primary" />
                    Ваша реферальная ссылка
                  </CardTitle>
                  <CardDescription>Поделитесь с друзьями</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1 p-4 bg-muted rounded-lg font-mono text-sm break-all">
                      {referralLink}
                    </div>
                    <Button onClick={copyLink} size="lg" className="shrink-0 gradient-primary">
                      <Icon name="Copy" size={20} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="gap-2">
                      <Icon name="MessageCircle" size={18} className="text-green-600" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Send" size={18} className="text-blue-600" />
                      Telegram
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Mail" size={18} className="text-red-600" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Trophy" size={24} className="text-accent" />
                  Достижения
                </CardTitle>
                <CardDescription>Прогресс и награды</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        achievement.completed
                          ? 'gradient-primary text-white border-transparent shadow-lg'
                          : 'bg-muted border-dashed'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <Icon
                          name={achievement.icon as any}
                          size={32}
                          className={achievement.completed ? '' : 'text-muted-foreground'}
                        />
                        <h3 className="font-bold">{achievement.title}</h3>
                        <p className={`text-sm ${achievement.completed ? 'text-white/90' : 'text-muted-foreground'}`}>
                          {achievement.description}
                        </p>
                        {achievement.completed && (
                          <Badge className="bg-white/20 text-white border-0">
                            <Icon name="Check" size={12} />
                            Получено
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="HelpCircle" size={24} className="text-primary" />
                  Условия программы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="Circle" size={8} className="text-primary mt-2" />
                  <p className="text-muted-foreground">
                    Бонус начисляется после того, как приглашённый друг оформит карту и выполнит условия
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Circle" size={8} className="text-primary mt-2" />
                  <p className="text-muted-foreground">
                    Условия: совершить первую покупку на сумму от 1000₽ в течение 30 дней
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Circle" size={8} className="text-primary mt-2" />
                  <p className="text-muted-foreground">
                    Бонусы зачисляются на карту в течение 3 рабочих дней после выполнения условий
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Circle" size={8} className="text-primary mt-2" />
                  <p className="text-muted-foreground">Количество приглашений не ограничено</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cabinet" className="space-y-6 mt-0">
            <div className="grid md:grid-cols-4 gap-4 animate-fade-in">
              <Card className="gradient-primary text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium opacity-90">Всего приглашено</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold flex items-center gap-2">
                    <Icon name="Users" size={32} />
                    {stats.totalReferrals}
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-accent text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium opacity-90">Выполнили условия</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold flex items-center gap-2">
                    <Icon name="CheckCircle" size={32} />
                    {stats.completedReferrals}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium opacity-90">Заработано</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold flex items-center gap-2">
                    <Icon name="Coins" size={32} className="animate-bounce-coin" />
                    {stats.totalEarned}₽
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium opacity-90">В ожидании</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold flex items-center gap-2">
                    <Icon name="Clock" size={32} />
                    {stats.pendingEarned}₽
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} className="text-primary" />
                  Прогресс до следующего уровня
                </CardTitle>
                <CardDescription>Пригласите ещё {10 - stats.totalReferrals} друзей для достижения "Эксперт"</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={(stats.totalReferrals / 10) * 100} className="h-4" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{stats.totalReferrals} из 10</span>
                    <span>{Math.round((stats.totalReferrals / 10) * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="History" size={24} className="text-primary" />
                  История приглашений
                </CardTitle>
                <CardDescription>Отслеживайте статус ваших рефералов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {referrals.map((referral, index) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                          {referral.name.charAt(referral.name.length - 1)}
                        </div>
                        <div>
                          <p className="font-semibold">{referral.name}</p>
                          <p className="text-sm text-muted-foreground">{referral.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {referral.status === 'completed' ? (
                          <>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <Icon name="CheckCircle" size={14} />
                              Выполнено
                            </Badge>
                            <span className="font-bold text-green-600 text-lg">+{referral.earned}₽</span>
                          </>
                        ) : (
                          <>
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                              <Icon name="Clock" size={14} />
                              Ожидание
                            </Badge>
                            <span className="font-semibold text-muted-foreground text-lg">—</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
