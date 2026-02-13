import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetStory, useGetAllStories } from '../hooks/useQueries';
import { ChevronLeft, ChevronRight, Home, Loader2 } from 'lucide-react';
import { getStoryAssets } from '../content/storyAssets';
import AudioNarrationControls from '../components/AudioNarrationControls';

export default function StoryReaderPage() {
  const { storyId } = useParams({ from: '/story/$storyId' });
  const navigate = useNavigate();
  const { data: story, isLoading, error } = useGetStory(BigInt(storyId));
  const { data: allStories } = useGetAllStories();

  const currentIndex = Number(storyId);
  const hasPrevious = currentIndex > 0;
  const hasNext = allStories && currentIndex < allStories.length - 1;

  const assets = getStoryAssets(currentIndex + 1);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-orange-500" />
          <p className="mt-4 text-lg text-amber-800 dark:text-amber-200">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border-2 border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-950">
        <p className="text-lg font-semibold text-red-800 dark:text-red-200">
          Story not found
        </p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-4 rounded-full bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
        >
          Back to Contents
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 rounded-full bg-amber-200 px-4 py-2 font-semibold text-amber-900 transition-colors hover:bg-amber-300 dark:bg-amber-800 dark:text-amber-100 dark:hover:bg-amber-700"
        >
          <Home className="h-4 w-4" />
          <span>Contents</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate({ to: '/story/$storyId', params: { storyId: (currentIndex - 1).toString() } })
            }
            disabled={!hasPrevious}
            className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          <button
            onClick={() =>
              navigate({ to: '/story/$storyId', params: { storyId: (currentIndex + 1).toString() } })
            }
            disabled={!hasNext}
            className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Story Content */}
      <div className="rounded-3xl border-2 border-amber-200 bg-white p-8 shadow-xl dark:border-amber-800 dark:bg-amber-900/30">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-xl font-bold text-white shadow-lg">
            {currentIndex + 1}
          </div>
          <h1 className="flex-1 px-6 text-3xl font-bold text-amber-900 dark:text-amber-100">
            {story.title}
          </h1>
        </div>

        {/* Audio Controls */}
        <div className="mb-6">
          <AudioNarrationControls text={story.content} storyId={storyId} />
        </div>

        {/* Story Illustration */}
        {assets.illustration && (
          <div className="mb-8 overflow-hidden rounded-2xl border-4 border-amber-300 shadow-lg dark:border-amber-700">
            <img
              src={assets.illustration}
              alt={`Illustration for ${story.title}`}
              className="h-auto w-full"
            />
          </div>
        )}

        {/* Story Text */}
        <div className="prose prose-lg prose-amber mx-auto max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap text-lg leading-relaxed text-amber-900 dark:text-amber-100">
            {story.content}
          </p>
        </div>

        {/* Coloring Page */}
        {assets.coloring && (
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                Color This Page!
              </h2>
              <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400"></div>
            </div>
            <div className="overflow-hidden rounded-2xl border-4 border-amber-300 bg-white shadow-lg dark:border-amber-700">
              <img
                src={assets.coloring}
                alt={`Coloring page for ${story.title}`}
                className="h-auto w-full"
              />
            </div>
            <p className="mt-4 text-center text-sm text-amber-700 dark:text-amber-300">
              Print this page and color it with your favorite crayons!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() =>
            navigate({ to: '/story/$storyId', params: { storyId: (currentIndex - 1).toString() } })
          }
          disabled={!hasPrevious}
          className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous Story</span>
        </button>
        <button
          onClick={() =>
            navigate({ to: '/story/$storyId', params: { storyId: (currentIndex + 1).toString() } })
          }
          disabled={!hasNext}
          className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Next Story</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
