import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('card');
  const { toast } = useToast();
  const userId = 'USER123';
  const referralLink = `https://card.example.com/ref/${userId}`;
  const alfaLink = 'https://alfa.me/ASQWHN';

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
                Получи 1000₽ и приглашай друзей! 🚀
              </p>
            </div>
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="card" className="gap-2">
                <Icon name="CreditCard" size={16} />
                Карта
              </TabsTrigger>
              <TabsTrigger value="home" className="gap-2">
                <Icon name="Gift" size={16} />
                Программа
              </TabsTrigger>
              <TabsTrigger value="cabinet" className="gap-2">
                <Icon name="LayoutDashboard" size={16} />
                Кабинет
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="card" className="space-y-8 mt-0">
            <div className="grid lg:grid-cols-2 gap-6 animate-scale-in">
              <Card className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white border-0 shadow-2xl animate-pulse-glow overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-4xl font-black">1000₽</CardTitle>
                    <Icon name="Sparkles" size={48} className="animate-bounce-coin" />
                  </div>
                  <CardDescription className="text-white/90 text-2xl font-bold">
                    Привет, друзья! 🌟
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-6">
                  <p className="text-lg leading-relaxed">
                    У нас отличная новость! Вы можете получить <span className="font-bold text-2xl">500₽</span> от нас и еще{' '}
                    <span className="font-bold text-2xl">500₽</span> от Альфа-Банка! В итоге ваша сумма составит{' '}
                    <span className="font-black text-3xl">1000₽</span>!
                  </p>

                  <div className="space-y-3 bg-white/10 backdrop-blur p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4">Что нужно сделать?</h3>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white text-green-600 flex items-center justify-center font-bold shrink-0">
                        1
                      </div>
                      <p>Оформить Альфа-Карту по нашей ссылке</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white text-green-600 flex items-center justify-center font-bold shrink-0">
                        2
                      </div>
                      <p>Активировать карту в приложении</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white text-green-600 flex items-center justify-center font-bold shrink-0">
                        3
                      </div>
                      <p>Сделать покупку от <span className="font-bold">200₽</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="shadow-lg hover:shadow-2xl transition-all">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Icon name="Gift" size={24} className="text-emerald-500" />
                      Двойная выгода!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="Coins" size={24} className="text-primary" />
                        <span className="font-bold text-lg">500₽ от нас</span>
                      </div>
                      <p className="text-sm text-muted-foreground">За оформление карты по нашей ссылке</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name="Coins" size={24} className="text-blue-600" />
                        <span className="font-bold text-lg">500₽ от Альфа-Банка</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Официальный бонус банка за активацию</p>
                    </div>
                    <div className="pt-4 border-t-2 border-dashed">
                      <div className="flex items-center justify-between text-2xl font-black">
                        <span>Итого:</span>
                        <span className="text-gradient">1000₽</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Icon name="Clock" size={20} className="text-accent" />
                      Быстро и просто
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Icon name="Check" size={20} className="text-green-600" />
                      <span>Оформление за 5 минут онлайн</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="Check" size={20} className="text-green-600" />
                      <span>Бесплатное обслуживание</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="Check" size={20} className="text-green-600" />
                      <span>Кэшбэк до 10% с покупок</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon name="Check" size={20} className="text-green-600" />
                      <span>Бонусы за каждого друга</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <Icon name="Rocket" size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Готовы получить 1000₽?</h3>
                      <p className="text-muted-foreground">Оформите карту прямо сейчас!</p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="gradient-primary text-xl px-8 py-6 shadow-lg hover:shadow-xl transition-all animate-pulse-glow"
                    onClick={() => window.open(alfaLink, '_blank')}
                  >
                    <Icon name="CreditCard" size={24} />
                    Оформить карту
                    <Icon name="ArrowRight" size={24} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="HelpCircle" size={24} className="text-primary" />
                  Частые вопросы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2">Когда я получу бонусы?</h4>
                  <p className="text-muted-foreground">
                    500₽ от нас поступят после совершения первой покупки. 500₽ от Альфа-Банка начисляются согласно
                    условиям банка.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Можно ли заработать больше?</h4>
                  <p className="text-muted-foreground">
                    Да! После оформления карты вы получите свою реферальную ссылку и сможете приглашать друзей,
                    зарабатывая по 200₽ за каждого!
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Есть ли скрытые платежи?</h4>
                  <p className="text-muted-foreground">
                    Нет! Карта полностью бесплатна при выполнении условий банка. Все бонусы — это реальные деньги на
                    вашу карту.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Button
            size="lg"
            variant="outline"
            className="gap-2 h-16 text-lg hover:bg-green-50 hover:border-green-500 hover:text-green-700 transition-all"
            onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(referralLink), '_blank')}
          >
            <Icon name="MessageCircle" size={24} className="text-green-600" />
            Поделиться в WhatsApp
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 h-16 text-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-all"
            onClick={() => window.open('https://t.me/share/url?url=' + encodeURIComponent(referralLink), '_blank')}
          >
            <Icon name="Send" size={24} className="text-blue-600" />
            Поделиться в Telegram
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 h-16 text-lg hover:bg-purple-50 hover:border-purple-500 hover:text-purple-700 transition-all"
            onClick={copyLink}
          >
            <Icon name="Copy" size={24} className="text-purple-600" />
            Скопировать ссылку
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
