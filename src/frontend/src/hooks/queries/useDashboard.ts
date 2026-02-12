import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { Dashboard } from '../../backend';

export function useGetDashboard() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Dashboard>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboard();
    },
    enabled: !!actor && !actorFetching,
  });
}
