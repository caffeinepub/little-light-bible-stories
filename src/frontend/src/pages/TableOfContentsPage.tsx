import { useNavigate } from '@tanstack/react-router';
import { useGetAllStories } from '../hooks/useQueries';
import { BookOpen, Loader2 } from 'lucide-react';

export default function TableOfContentsPage() {
  const navigate = useNavigate();
  const { data: stories, isLoading, error } = useGetAllStories();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-orange-500" />
          <p className="mt-4 text-lg text-amber-800 dark:text-amber-200">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border-2 border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950">
        <p className="text-lg font-semibold text-red-800 dark:text-red-200">
          Oops! We couldn't load the stories.
        </p>
        <p className="mt-2 text-red-600 dark:text-red-400">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 shadow-2xl">
          <BookOpen className="h-12 w-12 text-white" />
        </div>
        <h2 className="mb-2 text-4xl font-bold text-amber-900 dark:text-amber-100">
          Table of Contents
        </h2>
        <p className="text-lg text-amber-700 dark:text-amber-300">
          Choose a story to begin your journey
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stories?.map((story) => (
          <button
            key={story.id}
            onClick={() => navigate({ to: '/story/$storyId', params: { storyId: story.id.toString() } })}
            className="group relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-white p-6 text-left shadow-md transition-all hover:scale-105 hover:border-orange-400 hover:shadow-xl dark:border-amber-800 dark:bg-amber-900/30"
          >
            <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-lg font-bold text-white shadow-lg">
              {Number(story.id) + 1}
            </div>
            <h3 className="pr-14 text-xl font-bold text-amber-900 group-hover:text-orange-600 dark:text-amber-100 dark:group-hover:text-orange-400">
              {story.title}
            </h3>
            <div className="mt-3 flex items-center text-sm text-amber-600 dark:text-amber-400">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Read story</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
