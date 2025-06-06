
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Debt } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useDebts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: debts = [], isLoading } = useQuery({
    queryKey: ['debts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Debt[];
    },
    enabled: !!user
  });

  const addDebt = useMutation({
    mutationFn: async (newDebt: Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('debts')
        .insert([{ ...newDebt, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      toast({
        title: "Catatan hutang berhasil ditambah! 📝",
        description: "Jangan lupa untuk dilunasi ya!"
      });
    }
  });

  const markAsPaid = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('debts')
        .update({ is_paid: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      toast({
        title: "Yeay! Hutang sudah lunas! 🎉",
        description: "Selamat, beban finansial berkurang!"
      });
    }
  });

  const deleteDebt = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      toast({
        title: "Catatan hutang dihapus! ✅",
        description: "Data udah diupdate!"
      });
    }
  });

  return {
    debts,
    isLoading,
    addDebt: addDebt.mutate,
    markAsPaid: markAsPaid.mutate,
    deleteDebt: deleteDebt.mutate
  };
};
