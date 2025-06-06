import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTransactions } from '@/hooks/useTransactions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp } from 'lucide-react';

const RealtimePieChart: React.FC = () => {
  const { transactions } = useTransactions();
  const { user } = useAuth();
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getRandomColor = () => {
    const colors = [
      '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
      '#EF4444', '#6366F1', '#84CC16', '#F97316', '#06B6D4'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    // Calculate expense data by category
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
            color: getRandomColor(),
          });
        }
        return acc;
      }, [] as Array<{ name: string; value: number; color: string }>);

    setRealtimeData(expenseData);
  }, [transactions]);

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // The useTransactions hook will automatically refetch data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (realtimeData.length === 0) {
    return (
      <Card className="interactive-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            📊 Pengeluaran Real-time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="font-semibold">Belum ada data pengeluaran</p>
              <p className="text-sm">Mulai catat pengeluaranmu dulu ya!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-950 dark:border-gray-800 rounded-2xl shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white">
          <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          📊 Pengeluaran Real-time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={realtimeData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {realtimeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }: any) =>
                active && payload && payload.length ? (
                  <div className="p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{payload[0].name}</p>
                    <p className="text-purple-600 dark:text-purple-300 font-bold">
                      {formatCurrency(payload[0].value)}
                    </p>
                  </div>
                ) : null
              }
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: 24 }}
              formatter={(value, entry) => (
                <span
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline cursor-pointer transition"
                  style={{ marginRight: 16 }}
                >
                  {value} - {formatCurrency(entry.payload.value)}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center flex items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900 p-1">
            <svg className="w-4 h-4 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582M20 20v-5h-.581M5 9a7 7 0 0114 0v6a7 7 0 01-14 0V9zm7 7v.01"></path></svg>
          </span>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Data diperbarui secara real-time
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimePieChart;
