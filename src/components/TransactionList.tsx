import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction } from '@/types';
import { Search, Calendar, Filter, Trash2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
interface TransactionListProps {
  transactions?: Transaction[];
  showPagination?: boolean;
  itemsPerPage?: number;
}
const TransactionList: React.FC<TransactionListProps> = ({
  transactions: propTransactions,
  showPagination = true,
  itemsPerPage = 6
}) => {
  const {
    transactions: allTransactions,
    deleteTransaction
  } = useTransactions();
  const transactions = propTransactions || allTransactions;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getTypeEmoji = (type: string) => {
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
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expense':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'savings':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter dan sort transaksi (terbaru dulu)
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) || transaction.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = showPagination ? filteredTransactions.slice(startIndex, endIndex) : filteredTransactions;
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <Card className="animate-fade-in border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 overflow-hidden relative bg-gradient-to-br from-white to-purple-50 dark:bg-gray-950 dark:border-gray-800">
      {/* Background motif lucu */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-4 left-4 text-2xl">🌟</div>
        <div className="absolute top-8 right-8 text-xl">💫</div>
        <div className="absolute top-16 left-16 text-lg">✨</div>
        <div className="absolute top-20 right-20 text-2xl">🎉</div>
        <div className="absolute bottom-4 left-8 text-xl">🌈</div>
        <div className="absolute bottom-8 right-4 text-lg">🦄</div>
        <div className="absolute bottom-16 left-32 text-2xl">💎</div>
        <div className="absolute top-32 right-32 text-xl">🎨</div>
        <div className="absolute bottom-32 right-16 text-lg">🎪</div>
        <div className="absolute top-24 left-48 text-xl">🎭</div>
      </div>

      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg relative z-10 dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800">
        <CardTitle className="flex items-center gap-2 text-xl font-black text-purple-800 dark:text-purple-200">
          <Calendar className="h-6 w-6" />
          Riwayat Transaksi Elsa 📊
        </CardTitle>
        <p className="text-sm text-purple-600 font-semibold dark:text-purple-300">
          Semua catatan keuangan kamu ada di sini! ✨
        </p>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
            <Input
              placeholder="Cari transaksi... 🔍"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-12 border-2 focus:border-purple-400 font-semibold bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>
          <Select onValueChange={value => {
            setFilterType(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full md:w-[200px] border-2 focus:border-purple-400 font-semibold bg-white dark:bg-gray-800 dark:text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-semibold">Semua Tipe</SelectItem>
              <SelectItem value="income" className="font-semibold">💰 Pemasukan</SelectItem>
              <SelectItem value="expense" className="font-semibold">💸 Pengeluaran</SelectItem>
              <SelectItem value="savings" className="font-semibold">🐷 Tabungan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 relative z-10 bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {currentTransactions.length === 0 ? <div className="text-center py-12">
              <Heart className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-purple-600 mb-2">
                {filteredTransactions.length === 0 ? "Belum ada transaksi nih! 🤷‍♀️" : "Tidak ada hasil pencarian! 🔍"}
              </h3>
              <p className="text-purple-500 font-medium">
                {filteredTransactions.length === 0 ? "Yuk mulai catat keuanganmu dari sekarang! ✨" : "Coba ubah kata kunci atau filter pencarian! 💫"}
              </p>
            </div> : currentTransactions.map(transaction => (
  <div
    key={transaction.id}
    className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-5 rounded-xl border-2
    bg-gradient-to-r from-white to-gray-50 hover:from-purple-50 hover:to-pink-50
    dark:from-gray-900 dark:to-gray-950 dark:hover:from-gray-800 dark:hover:to-gray-900
    border-gray-200 hover:border-purple-300 dark:border-purple-900 dark:hover:border-purple-700
    transition-all duration-300 hover:shadow-lg relative overflow-hidden gap-3"
  >
    {/* Mini motif per card */}
    <div className="absolute top-2 right-2 text-xs opacity-20">🌟</div>
    <div className="absolute bottom-2 left-2 text-xs opacity-20">✨</div>

    <div className="flex items-center space-x-3 md:space-x-4 w-full md:w-auto">
      <div className="text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-300">
        {getTypeEmoji(transaction.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-base md:text-lg text-gray-800 dark:text-gray-100 truncate">
          {transaction.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge className={`
          ${getTypeColor(transaction.type)}
          font-bold border-2 text-xs md:text-sm px-2 py-0.5
          dark:bg-opacity-80
          ${transaction.type === 'income' && 'dark:bg-green-900 dark:text-green-200 dark:border-green-700'}
          ${transaction.type === 'expense' && 'dark:bg-red-900 dark:text-red-200 dark:border-red-700'}
          ${transaction.type === 'savings' && 'dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'}
        `}>
            {transaction.category}
          </Badge>
          <span className="text-xs md:text-sm text-purple-600 dark:text-purple-300 font-semibold whitespace-nowrap">
            📅 {formatDate(transaction.date)}
          </span>
        </div>
        {transaction.note && (
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium italic break-words">
            💭 {transaction.note}
          </p>
        )}
      </div>
    </div>

    <div className="flex flex-row md:flex-col items-end md:items-end space-x-2 md:space-x-0 md:space-y-3 mt-3 md:mt-0 w-full md:w-auto justify-between md:justify-end">
      <div className="text-right">
        <p className={`
        font-black text-base md:text-xl
        ${transaction.type === 'income' && 'text-green-600 dark:text-green-300'}
        ${transaction.type === 'expense' && 'text-red-600 dark:text-red-400'}
        ${transaction.type === 'savings' && 'text-blue-600 dark:text-blue-300'}
      `}>
          {transaction.type === 'expense' ? '-' : '+'}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
      <Button
        onClick={() => deleteTransaction(transaction.id)}
        size="sm"
        variant="outline"
        className="text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/40 dark:hover:border-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
))}
        </div>
        
        {/* Pagination */}
        {showPagination && filteredTransactions.length > itemsPerPage && <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-purple-100"} />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (page === 1 || page === totalPages || page >= currentPage - 1 && page <= currentPage + 1) {
                return <PaginationItem key={page}>
                        <PaginationLink onClick={() => handlePageChange(page)} isActive={page === currentPage} className="cursor-pointer font-bold">
                          {page}
                        </PaginationLink>
                      </PaginationItem>;
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>;
              }
              return null;
            })}
                
                <PaginationItem>
                  <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-purple-100"} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>}
        
        {filteredTransactions.length > 0 && <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-center border-2 border-purple-200 relative">
            <div className="absolute top-1 right-2 text-sm opacity-30">🎉</div>
            <p className="text-purple-700 font-bold">
              {showPagination ? `Menampilkan ${startIndex + 1}-${Math.min(endIndex, filteredTransactions.length)} dari ${filteredTransactions.length} transaksi ✨` : `Total ${filteredTransactions.length} transaksi ditampilkan ✨`}
            </p>
          </div>}
      </CardContent>
    </Card>
  );
};
export default TransactionList;