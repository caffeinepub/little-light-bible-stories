import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useSpeechNarration } from '../hooks/useSpeechNarration';
import { useEffect } from 'react';

interface AudioNarrationControlsProps {
  text: string;
  storyId: string;
}

export default function AudioNarrationControls({ text, storyId }: AudioNarrationControlsProps) {
  const { isPlaying, isSupported, progress, play, pause, restart, reset } = useSpeechNarration(text);

  // Reset narration when story changes
  useEffect(() => {
    reset();
  }, [storyId, reset]);

  if (!isSupported) {
    return (
      <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/50">
        <div className="flex items-center gap-3">
          <Volume2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Audio narration is not supported in your browser. Please try a different browser to hear the story read aloud.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50 p-4 shadow-md dark:border-orange-700 dark:from-orange-900/50 dark:to-yellow-900/50">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <span className="font-semibold text-orange-900 dark:text-orange-100">Listen to Story</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={restart}
            className="rounded-full bg-orange-200 p-2 text-orange-900 transition-colors hover:bg-orange-300 dark:bg-orange-800 dark:text-orange-100 dark:hover:bg-orange-700"
            title="Restart"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={isPlaying ? pause : play}
            className="rounded-full bg-orange-500 p-2 text-white transition-colors hover:bg-orange-600"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-orange-200 dark:bg-orange-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-orange-700 dark:text-orange-300">
        {isPlaying ? 'Playing...' : progress > 0 ? 'Paused' : 'Ready to play'}
      </p>
    </div>
  );
}
