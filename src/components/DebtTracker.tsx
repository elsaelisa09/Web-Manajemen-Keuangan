import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useDebts } from '@/hooks/useDebts';
import { Debt, DebtType } from '@/types';
import { HandCoins, UserCheck, Calendar, Trash2, CheckCircle } from 'lucide-react';

const DebtTracker: React.FC = () => {
  const { debts, addDebt, markAsPaid, deleteDebt } = useDebts();
  const [formData, setFormData] = useState({
    person_name: '',
    amount: '',
    type: '' as DebtType,
    description: '',
    due_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.person_name || !formData.amount || !formData.type) return;

    addDebt({
      person_name: formData.person_name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      description: formData.description,
      due_date: formData.due_date || undefined,
      is_paid: false,
    });

    setFormData({
      person_name: '',
      amount: '',
      type: '' as DebtType,
      description: '',
      due_date: '',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTypeInfo = (type: DebtType) => {
    if (type === 'owe') {
      return { text: 'Aku hutang ke', emoji: '😰', color: 'bg-red-100 text-red-800' };
    }
    return { text: 'Orang hutang ke aku', emoji: '😊', color: 'bg-green-100 text-green-800' };
  };

  const pendingDebts = debts.filter(debt => !debt.is_paid);
  const paidDebts = debts.filter(debt => debt.is_paid);

  return (
    <div className="space-y-6">
      {/* Form Input */}
      <Card className="animate-fade-in border-2 hover:border-purple-300 transition-all duration-300 bg-gradient-to-br from-white to-purple-50 dark:bg-gray-950 dark:border-gray-800">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800">
          <CardTitle className="flex items-center gap-2 text-xl font-black text-purple-800 dark:text-purple-200">
            <HandCoins className="h-6 w-6" />
            Catat Hutang Piutang 📝
          </CardTitle>
          <p className="text-sm text-gray-600 font-medium dark:text-purple-300">
            Biar gak lupa siapa yang hutang sama siapa! 😅
          </p>
        </CardHeader>
        <CardContent className="bg-gray-50 dark:bg-gray-900 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="person_name" className="font-bold text-gray-700 dark:text-gray-100">Nama Orang</Label>
                <Input
                  id="person_name"
                  placeholder="Siapa nih? 🤔"
                  value={formData.person_name}
                  onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
                  required
                  className="border-2 focus:border-purple-400 bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount" className="font-bold text-gray-700 dark:text-gray-100">Jumlah (Rp)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Berapa nih? 💰"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="border-2 focus:border-purple-400 bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="font-bold text-gray-700 dark:text-gray-100">Tipe Hutang</Label>
              <Select onValueChange={(value: DebtType) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="border-2 focus:border-purple-400 bg-white dark:bg-gray-800 dark:text-white">
                  <SelectValue placeholder="Pilih tipe hutang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owe">😰 Aku hutang ke orang</SelectItem>
                  <SelectItem value="owed">😊 Orang hutang ke aku</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="due_date" className="font-bold text-gray-700 dark:text-gray-100">Tanggal Jatuh Tempo (opsional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="border-2 focus:border-purple-400 bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold text-gray-700 dark:text-gray-100">Keterangan (opsional)</Label>
                <Input
                  id="description"
                  placeholder="Untuk apa nih? 🤷‍♀️"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border-2 focus:border-purple-400 bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 text-lg transition-all duration-300 transform hover:scale-105">
              <HandCoins className="h-4 w-4 mr-2" />
              Catat Hutang! 📝
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Hutang Belum Lunas */}
      {pendingDebts.length > 0 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-orange-600">
              <Calendar className="h-6 w-6" />
              Hutang Belum Lunas 🔥
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDebts.map((debt) => {
                const typeInfo = getTypeInfo(debt.type);
                return (
                  <div
                    key={debt.id}
                    className="flex items-center justify-between p-4 rounded-lg border-2 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{typeInfo.emoji}</div>
                      <div>
                        <p className="font-bold text-lg">{debt.person_name}</p>
                        <p className="text-sm text-gray-600">
                          {typeInfo.text} • {formatCurrency(debt.amount)}
                        </p>
                        {debt.description && (
                          <p className="text-xs text-gray-500">{debt.description}</p>
                        )}
                        {debt.due_date && (
                          <p className="text-xs text-orange-600 font-bold">
                            📅 Jatuh tempo: {formatDate(debt.due_date)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={typeInfo.color}>
                        {debt.type === 'owe' ? 'Hutang' : 'Piutang'}
                      </Badge>
                      <Button
                        onClick={() => markAsPaid(debt.id)}
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteDebt(debt.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hutang Sudah Lunas */}
      {paidDebts.length > 0 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-green-600">
              <UserCheck className="h-6 w-6" />
              Hutang Sudah Lunas ✅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paidDebts.map((debt) => {
                const typeInfo = getTypeInfo(debt.type);
                return (
                  <div
                    key={debt.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 opacity-75"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">✅</div>
                      <div>
                        <p className="font-semibold">{debt.person_name}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(debt.amount)} • {typeInfo.text}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Lunas
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DebtTracker;
