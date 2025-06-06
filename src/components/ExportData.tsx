import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { useDebts } from '@/hooks/useDebts';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { Download, FileText, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ExportData: React.FC = () => {
  const { transactions } = useTransactions();
  const { debts } = useDebts();
  const { goals } = useSavingsGoals();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    if (data.length === 0) {
      toast({
        variant: "destructive",
        title: "Oops! Data kosong 😅",
        description: "Belum ada data untuk diekspor nih!"
      });
      return;
    }

    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header.toLowerCase().replace(' ', '_')] || '';
        return `"${value}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Yeay! Data berhasil diekspor! 🎉",
      description: `File ${filename}.csv udah siap didownload!`
    });
  };

  const exportTransactions = () => {
    const formattedTransactions = transactions.map(transaction => ({
      tanggal: transaction.date,
      tipe: transaction.type === 'income' ? 'Pemasukan' : 
            transaction.type === 'expense' ? 'Pengeluaran' : 'Tabungan',
      kategori: transaction.category,
      deskripsi: transaction.description,
      jumlah: transaction.amount,
      catatan: transaction.note || '',
    }));

    exportToCSV(
      formattedTransactions,
      `elsa-transaksi-${new Date().toISOString().split('T')[0]}`,
      ['Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Jumlah', 'Catatan']
    );
  };

  const exportDebts = () => {
    const formattedDebts = debts.map(debt => ({
      nama_orang: debt.person_name,
      tipe: debt.type === 'owe' ? 'Saya hutang ke orang' : 'Orang hutang ke saya',
      jumlah: debt.amount,
      deskripsi: debt.description || '',
      jatuh_tempo: debt.due_date || '',
      status: debt.is_paid ? 'Lunas' : 'Belum Lunas',
    }));

    exportToCSV(
      formattedDebts,
      `elsa-hutang-piutang-${new Date().toISOString().split('T')[0]}`,
      ['Nama Orang', 'Tipe', 'Jumlah', 'Deskripsi', 'Jatuh Tempo', 'Status']
    );
  };

  const exportGoals = () => {
    const formattedGoals = goals.map(goal => ({
      judul: goal.title,
      target: goal.target_amount,
      terkumpul: goal.current_amount,
      progress: `${((goal.current_amount / goal.target_amount) * 100).toFixed(1)}%`,
      deadline: goal.deadline || '',
      deskripsi: goal.description || '',
      status: goal.is_completed ? 'Tercapai' : 'Aktif',
    }));

    exportToCSV(
      formattedGoals,
      `elsa-target-tabungan-${new Date().toISOString().split('T')[0]}`,
      ['Judul', 'Target', 'Terkumpul', 'Progress', 'Deadline', 'Deskripsi', 'Status']
    );
  };

  const exportAllData = () => {
    // Create a comprehensive financial report
    const summary = {
      tanggal_ekspor: new Date().toLocaleDateString('id-ID'),
      total_transaksi: transactions.length,
      total_hutang_piutang: debts.length,
      total_target: goals.length,
      total_pemasukan: transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      total_pengeluaran: transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      total_tabungan: transactions
        .filter(t => t.type === 'savings')
        .reduce((sum, t) => sum + t.amount, 0),
    };

    exportToCSV(
      [summary],
      `elsa-laporan-keuangan-lengkap-${new Date().toISOString().split('T')[0]}`,
      ['Tanggal Ekspor', 'Total Transaksi', 'Total Hutang Piutang', 'Total Target', 
       'Total Pemasukan', 'Total Pengeluaran', 'Total Tabungan']
    );
  };

  return (
    <Card className="animate-fade-in border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 bg-gradient-to-br from-white to-purple-50 dark:bg-gray-950 dark:border-gray-800">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800">
        <CardTitle className="flex items-center gap-2 text-xl font-black text-purple-600 dark:text-purple-200">
          <Database className="h-6 w-6" />
          Export Data Keuangan 📊
        </CardTitle>
        <p className="text-sm text-gray-600 font-medium dark:text-purple-300">
          Download data keuangan kamu dalam format CSV! 💾
        </p>
      </CardHeader>
      <CardContent className="space-y-4 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={exportTransactions}
            variant="outline"
            className="h-16 flex-col gap-2 border-2 hover:border-green-400 hover:bg-green-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-green-400 dark:hover:bg-green-900/30"
          >
            <FileText className="h-6 w-6 text-green-600" />
            <div className="text-center">
              <p className="font-bold text-green-600 dark:text-green-400">Transaksi</p>
              {/* <p className="text-xs text-gray-500 dark:text-gray-300">{transactions.length} data</p> */}
            </div>
          </Button>

          <Button
            onClick={exportDebts}
            variant="outline"
            className="h-16 flex-col gap-2 border-2 hover:border-orange-400 hover:bg-orange-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-orange-400 dark:hover:bg-orange-900/30"
          >
            <FileText className="h-6 w-6 text-orange-600" />
            <div className="text-center">
              <p className="font-bold text-orange-600 dark:text-orange-400">Hutang Piutang</p>
              {/* <p className="text-xs text-gray-500 dark:text-gray-300">{debts.length} data</p> */}
            </div>
          </Button>

          <Button
            onClick={exportGoals}
            variant="outline"
            className="h-16 flex-col gap-2 border-2 hover:border-blue-400 hover:bg-blue-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/30"
          >
            <FileText className="h-6 w-6 text-blue-600" />
            <div className="text-center">
              <p className="font-bold text-blue-600 dark:text-blue-400">Target Tabungan</p>
              {/* <p className="text-xs text-gray-500 dark:text-gray-300">{goals.length} data</p> */}
            </div>
          </Button>

          <Button
            onClick={exportAllData}
            className="h-16 flex-col gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold dark:from-purple-700 dark:to-pink-700"
          >
            <Download className="h-6 w-6" />
            <div className="text-center">
              {/* <p>Semua Data</p> */}
              <p className="text-xs opacity-90">Laporan lengkap</p>
            </div>
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 dark:from-gray-800 dark:to-gray-900 dark:border-purple-700">
          <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">💡 Tips Export:</h4>
          <ul className="text-sm text-purple-700 dark:text-purple-200 space-y-1">
            <li>• File CSV bisa dibuka di Excel atau Google Sheets</li>
            <li>• Data yang diekspor sesuai dengan data real-time dari database</li>
            <li>• Gunakan "Semua Data" untuk laporan lengkap bulanan/tahunan</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportData;
