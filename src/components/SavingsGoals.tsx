import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { Target, Plus, TrendingUp, Calendar, Crown } from 'lucide-react';

const SavingsGoals: React.FC = () => {
  const { goals, addGoal, updateGoalProgress } = useSavingsGoals();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    deadline: '',
    description: '',
    emoji: '🎯',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.target_amount) return;

    addGoal({
      title: formData.title,
      target_amount: parseFloat(formData.target_amount),
      current_amount: 0,
      deadline: formData.deadline || undefined,
      description: formData.description,
      emoji: formData.emoji,
      is_completed: false,
    });

    setFormData({
      title: '',
      target_amount: '',
      deadline: '',
      description: '',
      emoji: '🎯',
    });
    setShowForm(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeGoals = goals.filter(goal => !goal.is_completed);
  const completedGoals = goals.filter(goal => goal.is_completed);

  return (
    <div className="space-y-6">
      {/* Header dengan tombol tambah */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl font-black">
                <Target className="h-7 w-7" />
                Target Tabungan Elsa! 🎯
              </CardTitle>
              <p className="text-purple-100 font-medium">
                Yuk wujudkan impian kamu dengan menabung! ✨
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Target Baru!
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Form tambah target */}
      {showForm && (
        <Card className="animate-fade-in border-2 border-purple-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-purple-600">
              Bikin Target Baru! 🌟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-bold">Judul Target</Label>
                  <Input
                    id="title"
                    placeholder="Contoh: Beli iPhone baru! 📱"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="border-2 focus:border-purple-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target_amount" className="font-bold">Target Jumlah (Rp)</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    placeholder="Berapa target kamu? 💰"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    required
                    className="border-2 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="font-bold">Deadline (opsional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="border-2 focus:border-purple-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emoji" className="font-bold">Emoji</Label>
                  <Input
                    id="emoji"
                    placeholder="🎯"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="border-2 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">Deskripsi (opsional)</Label>
                <Textarea
                  id="description"
                  placeholder="Ceritain kenapa kamu pengen ini... 💭"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border-2 focus:border-purple-400"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold">
                  <Target className="h-4 w-4 mr-2" />
                  Buat Target! 🎯
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Target aktif */}
      {activeGoals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeGoals.map((goal) => {
            const progress = getProgressPercentage(goal.current_amount, goal.target_amount);
            const daysLeft = goal.deadline ? getDaysLeft(goal.deadline) : null;
            
            return (
              <Card 
                key={goal.id} 
                className="overflow-hidden border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-xl
                  bg-gradient-to-br from-white to-purple-50
                  dark:from-gray-900 dark:to-gray-950 dark:border-gray-800"
              >
                <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100
                  dark:from-gray-900 dark:to-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{goal.emoji}</span>
                      <div>
                        <CardTitle className="text-lg font-black text-purple-800 dark:text-purple-200">
                          {goal.title}
                        </CardTitle>
                        {goal.description && (
                          <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {progress >= 100 && (
                      <Crown className="h-6 w-6 text-yellow-500 animate-bounce" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4 bg-white dark:bg-gray-900">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-200">Progress</span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-300">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-200">Terkumpul:</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(goal.current_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-200">Target:</span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-300">
                        {formatCurrency(goal.target_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-200">Kurang:</span>
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                        {formatCurrency(goal.target_amount - goal.current_amount)}
                      </span>
                    </div>
                  </div>
                  
                  {daysLeft && (
                    <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-300">
                        {daysLeft > 0 ? `${daysLeft} hari lagi!` : 'Deadline terlewat! 😱'}
                      </span>
                    </div>
                  )}
                  
                  {progress >= 100 && (
                    <div className="text-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-lg">
                      <p className="text-lg font-black text-green-700 dark:text-green-300">
                        🎉 TARGET TERCAPAI! 🎉
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-200">
                        Selamat Elsa! Kamu berhasil! ✨
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Target selesai */}
      {completedGoals.length > 0 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-green-600">
              <Crown className="h-6 w-6" />
              Target yang Udah Tercapai! 🏆
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg border-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div>
                      <p className="font-bold text-green-800">{goal.title}</p>
                      <p className="text-sm text-green-600">
                        {formatCurrency(goal.target_amount)} ✅
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeGoals.length === 0 && completedGoals.length === 0 && !showForm && (
        <Card className="text-center p-8 bg-gray-50 border-2 border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all duration-300">
          <div className="space-y-4">
            <Target className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-100">
                Belum ada target nih! 🤔
              </h3>
              <p className="text-gray-500 dark:text-gray-300">
                Yuk bikin target tabungan pertama kamu!
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Target Sekarang! 🎯
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SavingsGoals;
