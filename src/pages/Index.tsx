import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const REFERRAL_API = 'https://functions.poehali.dev/48a1fc61-c1b4-41da-9d4b-2e0bd9dd8789';
const WITHDRAWAL_API = 'https://functions.poehali.dev/61f2a443-2e9f-4147-b9aa-cc99ba2fd219';

const Index = () => {
  const [activeTab, setActiveTab] = useState('card');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [withdrawBank, setWithdrawBank] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [withdrawRequests, setWithdrawRequests] = useState<any[]>([]);
  
  const { toast } = useToast();
  const userId = localStorage.getItem('user_id') || `USER_${Date.now()}`;
  const alfaLink = 'https://alfa.me/ASQWHN';
  const ADMIN_CODE = '2025';
  
  const referralLink = userData?.user?.referral_code 
    ? `${window.location.origin}?ref=${userData.user.referral_code}`
    : `${window.location.origin}?ref=LOADING`;

  const stats = userData?.stats || {
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarned: 0,
    pendingEarned: 0,
    completedReferrals: 0,
  };

  const referrals = userData?.referrals || [];

  const achievements = [
    { id: 1, title: 'Первый друг', description: 'Пригласите первого друга', completed: false, icon: 'UserPlus' },
    { id: 2, title: 'Отличный старт', description: 'Пригласите 5 друзей', completed: false, icon: 'Users' },
    { id: 3, title: 'Эксперт', description: 'Пригласите 10 друзей', completed: false, icon: 'Award' },
    { id: 4, title: 'Легенда', description: 'Пригласите 25 друзей', completed: false, icon: 'Crown' },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    
    if (!localStorage.getItem('user_id')) {
      localStorage.setItem('user_id', userId);
      if (refCode) {
        localStorage.setItem('referred_by', refCode);
      }
    }
    
    registerOrFetchUser();
  }, []);
  
  const registerOrFetchUser = async () => {
    try {
      const storedUserId = localStorage.getItem('user_id');
      const referredBy = localStorage.getItem('referred_by');
      
      const checkResponse = await fetch(`${REFERRAL_API}?user_id=${storedUserId}`);
      
      if (checkResponse.status === 404) {
        const registerResponse = await fetch(REFERRAL_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register',
            user_id: storedUserId,
            referred_by: referredBy
          })
        });
        
        if (registerResponse.ok) {
          localStorage.removeItem('referred_by');
        }
      }
      
      await fetchUserData();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${REFERRAL_API}?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const fetchWithdrawRequests = async () => {
    try {
      const response = await fetch(`${WITHDRAWAL_API}?admin=true`);
      if (response.ok) {
        const data = await response.json();
        setWithdrawRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: '🎉 Ссылка скопирована!',
      description: 'Поделитесь ей с друзьями',
    });
  };

  const handleAdminLogin = async () => {
    if (adminCode === ADMIN_CODE) {
      setIsAdmin(true);
      await fetchWithdrawRequests();
      toast({
        title: '✅ Вход выполнен',
        description: 'Добро пожаловать в админ-панель',
      });
    } else {
      toast({
        title: '❌ Неверный код',
        description: 'Попробуйте ещё раз',
        variant: 'destructive',
      });
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawPhone || !withdrawBank || !withdrawAmount) {
      toast({
        title: '❌ Заполните все поля',
        description: 'Укажите телефон, банк и сумму',
        variant: 'destructive',
      });
      return;
    }

    if (Number(withdrawAmount) > stats.totalEarned) {
      toast({
        title: '❌ Недостаточно средств',
        description: 'Вы не можете вывести больше, чем заработали',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(WITHDRAWAL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          phone: withdrawPhone,
          bank: withdrawBank,
          amount: Number(withdrawAmount)
        })
      });
      
      if (response.ok) {
        toast({
          title: '✅ Заявка отправлена!',
          description: 'Ожидайте обработки в течение 1-3 дней',
        });
        
        setWithdrawDialogOpen(false);
        setWithdrawPhone('');
        setWithdrawBank('');
        setWithdrawAmount('');
      } else {
        const error = await response.json();
        toast({
          title: '❌ Ошибка',
          description: error.error || 'Не удалось создать заявку',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось отправить заявку',
        variant: 'destructive'
      });
    }
  };

  const handleApproveWithdraw = async (id: number) => {
    try {
      const response = await fetch(WITHDRAWAL_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id, status: 'approved' })
      });
      
      if (response.ok) {
        toast({
          title: '✅ Заявка одобрена',
          description: `Выплата #${id} обработана`,
        });
        await fetchWithdrawRequests();
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось обработать заявку',
        variant: 'destructive'
      });
    }
  };

  const handleRejectWithdraw = async (id: number) => {
    try {
      const response = await fetch(WITHDRAWAL_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id, status: 'rejected' })
      });
      
      if (response.ok) {
        toast({
          title: '❌ Заявка отклонена',
          description: `Выплата #${id} отклонена`,
        });
        await fetchWithdrawRequests();
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось обработать заявку',
        variant: 'destructive'
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

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

            {stats.totalEarned === 0 && referrals.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Icon name="Users" size={48} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Пока пусто</h3>
                    <p className="text-muted-foreground max-w-md">
                      Начните приглашать друзей, и здесь появится информация о ваших рефералах и заработке!
                    </p>
                    <Button size="lg" className="gradient-primary mt-4" onClick={copyLink}>
                      <Icon name="Share2" size={20} />
                      Поделиться ссылкой
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
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
              </>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gradient-primary h-16 text-lg" disabled={stats.totalEarned === 0}>
                    <Icon name="Wallet" size={24} />
                    Вывод средств через СПБ
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Вывод средств</DialogTitle>
                    <DialogDescription>Заполните данные для перевода через Систему Быстрых Платежей</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="phone">Номер телефона</Label>
                      <Input
                        id="phone"
                        placeholder="+7 999 123-45-67"
                        value={withdrawPhone}
                        onChange={(e) => setWithdrawPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank">Банк получателя</Label>
                      <Select value={withdrawBank} onValueChange={setWithdrawBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите банк" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sber">Сбербанк</SelectItem>
                          <SelectItem value="tinkoff">Тинькофф</SelectItem>
                          <SelectItem value="alfa">Альфа-Банк</SelectItem>
                          <SelectItem value="vtb">ВТБ</SelectItem>
                          <SelectItem value="raif">Райффайзен</SelectItem>
                          <SelectItem value="open">Открытие</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Сумма вывода</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Доступно: {stats.totalEarned}₽</p>
                    </div>
                    <Button className="w-full gradient-primary" onClick={handleWithdraw}>
                      <Icon name="Send" size={20} />
                      Отправить заявку
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="h-16 text-lg border-2">
                    <Icon name="Shield" size={24} />
                    Админ-панель
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Админ-панель</DialogTitle>
                    <DialogDescription>Управление заявками на вывод средств</DialogDescription>
                  </DialogHeader>
                  {!isAdmin ? (
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="adminCode">Код доступа</Label>
                        <Input
                          id="adminCode"
                          type="password"
                          placeholder="Введите код"
                          value={adminCode}
                          onChange={(e) => setAdminCode(e.target.value)}
                        />
                      </div>
                      <Button className="w-full gradient-primary" onClick={handleAdminLogin}>
                        <Icon name="LogIn" size={20} />
                        Войти
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Заявки на вывод</h3>
                        <Badge className="bg-green-500 text-white">Авторизован</Badge>
                      </div>
                      <div className="space-y-3">
                        {withdrawRequests.map((request) => (
                          <Card key={request.id} className={`${
                            request.status === 'approved' ? 'bg-green-50 border-green-200' :
                            request.status === 'rejected' ? 'bg-red-50 border-red-200' :
                            'bg-amber-50 border-amber-200'
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">ID: {request.user}</Badge>
                                    <span className="text-sm text-muted-foreground">{request.date}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Телефон:</span>
                                      <p className="font-mono">{request.phone}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Банк:</span>
                                      <p className="font-semibold">{request.bank}</p>
                                    </div>
                                  </div>
                                  <div className="text-2xl font-bold text-gradient">
                                    {request.amount}₽
                                  </div>
                                </div>
                                {request.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleApproveWithdraw(request.id)}
                                    >
                                      <Icon name="Check" size={16} />
                                      Принять
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleRejectWithdraw(request.id)}
                                    >
                                      <Icon name="X" size={16} />
                                      Отклонить
                                    </Button>
                                  </div>
                                )}
                                {request.status === 'approved' && (
                                  <Badge className="bg-green-600 text-white">
                                    <Icon name="CheckCircle" size={14} />
                                    Одобрено
                                  </Badge>
                                )}
                                {request.status === 'rejected' && (
                                  <Badge className="bg-red-600 text-white">
                                    <Icon name="XCircle" size={14} />
                                    Отклонено
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
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