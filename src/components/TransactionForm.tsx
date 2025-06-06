import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionType, TransactionCategory } from '@/types';
import { Plus, Sparkles } from 'lucide-react';
interface TransactionFormProps {
  onSubmit: () => void;
}
const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit
}) => {
  const {
    addTransaction,
    isAddingTransaction
  } = useTransactions();
  const [formData, setFormData] = useState({
    amount: '',
    type: '' as TransactionType,
    category: '' as TransactionCategory,
    description: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });
  const categories = {
    income: ['salary', 'bonus', 'gift', 'investment'],
    expense: ['food', 'transport', 'entertainment', 'shopping', 'bills', 'health', 'education'],
    savings: ['emergency', 'vacation', 'investment', 'general']
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.type || !formData.category || !formData.description) {
      return;
    }
    addTransaction({
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      description: formData.description,
      note: formData.note,
      date: formData.date
    });
    setFormData({
      amount: '',
      type: '' as TransactionType,
      category: '' as TransactionCategory,
      description: '',
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
    onSubmit();
  };
  const getTypeEmoji = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return '💰';
      case 'expense':
        return '💸';
      case 'savings':
        return '🐷';
      default:
        return '💳';
    }
  };
  return (
    <Card className="animate-fade-in border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 bg-gradient-to-br from-white to-purple-50 dark:bg-gray-950 dark:border-gray-800">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800">
        <CardTitle className="flex items-center gap-2 text-xl font-black text-purple-800 dark:text-purple-200">
          <Plus className="h-6 w-6" />
          <Sparkles className="h-5 w-5" />
          Tambah Transaksi Baru!
        </CardTitle>
        <p className="text-sm text-purple-600 font-semibold dark:text-purple-300">
          Catat semua uang masuk & keluar ya! 📝✨
        </p>
      </CardHeader>
      <CardContent className="p-6 bg-gray-50 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="font-bold text-gray-700 dark:text-gray-100">Jumlah (Rp) 💰</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Contoh: 50000"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                required
                className="border-2 focus:border-purple-400 font-semibold text-lg bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="font-bold text-gray-700 dark:text-gray-100">Tanggal 📅</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
                className="border-2 focus:border-purple-400 font-semibold bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="font-bold text-gray-700 dark:text-gray-100">Tipe Transaksi</Label>
            <Select onValueChange={(value: TransactionType) => setFormData({ ...formData, type: value, category: '' as TransactionCategory })}>
              <SelectTrigger className="border-2 focus:border-purple-400 font-semibold bg-white dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Pilih tipe transaksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income" className="font-semibold">💰 Pemasukan (uang masuk)</SelectItem>
                <SelectItem value="expense" className="font-semibold">💸 Pengeluaran (uang keluar)</SelectItem>
                <SelectItem value="savings" className="font-semibold">🐷 Tabungan (disimpan)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.type && (
            <div className="space-y-2">
              <Label htmlFor="category" className="font-bold text-gray-700 dark:text-gray-100">
                Kategori {getTypeEmoji(formData.type)}
              </Label>
              <Select onValueChange={(value: TransactionCategory) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="border-2 focus:border-purple-400 font-semibold bg-white dark:bg-gray-800 dark:text-white">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories[formData.type].map(cat => (
                    <SelectItem key={cat} value={cat} className="font-semibold">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-bold text-gray-700 dark:text-gray-100">Deskripsi 📝</Label>
            <Input
              id="description"
              placeholder="Contoh: Beli kopi di café favorit ☕"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
              className="border-2 focus:border-purple-400 font-semibold bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note" className="font-bold text-gray-700 dark:text-gray-100">Catatan (opsional) 💭</Label>
            <Textarea
              id="note"
              placeholder="Tambahkan catatan atau emoji lucu! 😊✨"
              value={formData.note}
              onChange={e => setFormData({ ...formData, note: e.target.value })}
              rows={2}
              className="border-2 focus:border-purple-400 font-semibold bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 text-lg transition-all duration-300 transform hover:scale-105"
            disabled={isAddingTransaction}
          >
            {isAddingTransaction ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </div>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Tambah Transaksi! 🚀
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
export default TransactionForm;