import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Story } from '../backend';

export function useGetAllStories() {
  const { actor, isFetching } = useActor();

  return useQuery<Story[]>({
    queryKey: ['stories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStory(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Story | null>({
    queryKey: ['story', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStory(id);
    },
    enabled: !!actor && !isFetching,
  });
}
