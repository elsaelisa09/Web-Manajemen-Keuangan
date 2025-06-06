import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import AuthPage from '@/components/AuthPage';
import InteractiveSummaryCard from '@/components/InteractiveSummaryCard';
import FinanceChart from '@/components/FinanceChart';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import DebtTracker from '@/components/DebtTracker';
import SavingsGoals from '@/components/SavingsGoals';
import ExportData from '@/components/ExportData';
import { useTransactions } from '@/hooks/useTransactions';
import { useDebts } from '@/hooks/useDebts';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { FinancialSummary } from '@/types';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, HandCoins, Target, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealtimePieChart from '@/components/RealtimePieChart';

const DashboardContent = () => {
  const { transactions } = useTransactions();
  const { debts } = useDebts();
  const { goals } = useSavingsGoals();
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    totalSavings: 0,
    balance: 0,
    totalOwed: 0,
    totalOwe: 0,
  });

  useEffect(() => {
    const newSummary = transactions.reduce((acc, transaction) => {
      switch (transaction.type) {
        case 'income':
          acc.totalIncome += transaction.amount;
          break;
        case 'expense':
          acc.totalExpense += transaction.amount;
          break;
        case 'savings':
          acc.totalSavings += transaction.amount;
          break;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0, totalSavings: 0, balance: 0, totalOwed: 0, totalOwe: 0 });

    // Calculate debt summary
    debts.forEach(debt => {
      if (!debt.is_paid) {
        if (debt.type === 'owed') {
          newSummary.totalOwed += debt.amount;
        } else {
          newSummary.totalOwe += debt.amount;
        }
      }
    });

    newSummary.balance = newSummary.totalIncome - newSummary.totalExpense - newSummary.totalSavings;
    setSummary(newSummary);
  }, [transactions, debts]);

  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const existing = acc.find(item => item.name === transaction.category);
      if (existing) {
        existing.value += transaction.amount;
      } else {
        acc.push({
          name: transaction.category,
          value: transaction.amount,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        });
      }
      return acc;
    }, [] as Array<{ name: string; value: number; color: string }>);

  const monthlyData = transactions
    .reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('id-ID', { month: 'short' });
      const existing = acc.find(item => item.name === month);
      
      if (existing) {
        if (transaction.type === 'income') existing.income += transaction.amount;
        if (transaction.type === 'expense') existing.expense += transaction.amount;
      } else {
        acc.push({
          name: month,
          income: transaction.type === 'income' ? transaction.amount : 0,
          expense: transaction.type === 'expense' ? transaction.amount : 0,
          value: transaction.amount,
          color: transaction.type === 'income' ? '#10b981' : '#ef4444',
        });
      }
      return acc;
    }, [] as Array<{ name: string; income: number; expense: number; value: number; color: string }>);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = "Elsa";
    
    if (hour < 10) return `Selamat pagi, ${name}! ☀️`;
    if (hour < 15) return `Selamat siang, ${name}! 🌤️`;
    if (hour < 18) return `Selamat sore, ${name}! 🌅`;
    return `Selamat malam, ${name}! 🌙`;
  };

  return (
    <div className="min-h-screen bg-background emoji-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {getGreeting()}
          </h2>
          <p className="text-lg text-muted-foreground font-semibold">
            Mari kita lihat kondisi keuanganmu hari ini! 💪✨
          </p>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <InteractiveSummaryCard
            title="Total Pemasukan"
            amount={summary.totalIncome}
            icon={TrendingUp}
            color="#10b981"
            emoji="💰"
            trend={5.2}
            subtitle="Hasil kerja keras kamu!"
          />
          <InteractiveSummaryCard
            title="Total Pengeluaran"
            amount={summary.totalExpense}
            icon={TrendingDown}
            color="#ef4444"
            emoji="💸"
            trend={-2.1}
            subtitle="Hati-hati jangan boros ya!"
          />
          <InteractiveSummaryCard
            title="Total Tabungan"
            amount={summary.totalSavings}
            icon={PiggyBank}
            color="#3b82f6"
            emoji="🐷"
            trend={8.7}
            subtitle="Rajin menabung = masa depan cerah!"
          />
          <InteractiveSummaryCard
            title="Saldo Tersisa"
            amount={summary.balance}
            icon={DollarSign}
            color="#8b5cf6"
            emoji="💳"
            subtitle="Uang yang bisa kamu pakai"
          />
          <InteractiveSummaryCard
            title="PIUTANG"
            amount={summary.totalOwed}
            icon={HandCoins}
            color="#f59e0b"
            emoji="😊"
            subtitle="Piutang yang belum dibayar"
          />
          <InteractiveSummaryCard
            title="HUTANG"
            amount={summary.totalOwe}
            icon={HandCoins}
            color="#dc2626"
            emoji="😰"
            subtitle="Jangan lupa bayar ya!"
          />
        </div>

        {/* Enhanced Tabs Navigation */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-2 white-card rounded-xl">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 font-bold data-[state=active]:bg-purple-100 data-[state=active]:text-purple-600">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2 font-bold data-[state=active]:bg-purple-100 data-[state=active]:text-purple-600">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Transaksi</span>
            </TabsTrigger>
            <TabsTrigger value="debts" className="flex items-center gap-2 font-bold data-[state=active]:bg-purple-100 data-[state=active]:text-purple-600">
              <HandCoins className="h-4 w-4" />
              <span className="hidden sm:inline">Hutang</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2 font-bold data-[state=active]:bg-purple-100 data-[state=active]:text-purple-600">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Target</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2 font-bold data-[state=active]:bg-purple-100 data-[state=active]:text-purple-600">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Real-time Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 justify-center items-center">
              <RealtimePieChart />
              {/* {monthlyData.length > 0 && (
                <FinanceChart
                  data={monthlyData}
                  type="bar"
                  title="Trend Bulanan 📈"
                />
              )} */}
            </div>

            {/* Quick Transaction Form and List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TransactionForm onSubmit={() => {}} />
              </div>
              <div className="lg:col-span-2">
                <TransactionList 
                  transactions={transactions.slice(0, 6)} 
                  showPagination={false}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TransactionForm onSubmit={() => {}} />
              </div>
              <div className="lg:col-span-2">
                <TransactionList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="debts">
            <DebtTracker />
          </TabsContent>

          <TabsContent value="goals">
            <SavingsGoals />
          </TabsContent>

          <TabsContent value="export">
            <ExportData />
          </TabsContent>
        </Tabs>

        {/* Enhanced Footer */}
        <footer className="mt-16 text-center">
          <div className="white-card rounded-2xl p-8 mb-8 emoji-bg">
            <h3 className="text-2xl font-black text-purple-800 mb-2">
              Keep Going, Elsa! 💪
            </h3>
            <p className="text-purple-600 font-semibold">
              Setiap langkah kecil menuju financial freedom itu berharga! ✨
            </p>
          </div>
          {/* <p className="text-sm text-muted-foreground font-medium">
            Dibuat dengan ❤️ untuk membantu Elsa mengelola keuangan dengan lebih bijak! 🎯
          </p> */}
        </footer>
      </main>
    </div>
  );
};

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold">Loading Elsa Finance... 💫</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <DashboardContent />;
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <Index />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
