import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { Entry, EntryType, Time } from '../../backend';

export function useGetEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Entry[]>({
    queryKey: ['entries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEntries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOrUpdateEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint | null;
      date: Time;
      entryType: EntryType;
      amount: number;
      category: string | null;
      note: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrUpdateEntry(
        params.id,
        params.date,
        params.entryType,
        params.amount,
        params.category,
        params.note
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
