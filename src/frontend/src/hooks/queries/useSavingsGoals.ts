import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { SavingsGoal, Time } from '../../backend';

export function useGetSavingsGoals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SavingsGoal[]>({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSavingsGoals();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOrUpdateSavingsGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint | null;
      name: string;
      targetAmount: number;
      currentAmount: number;
      deadline: Time | null;
      note: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrUpdateSavingsGoal(
        params.id,
        params.name,
        params.targetAmount,
        params.currentAmount,
        params.deadline,
        params.note
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
    },
  });
}

export function useDeleteSavingsGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSavingsGoal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
    },
  });
}
