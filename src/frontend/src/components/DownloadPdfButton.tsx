import { useState } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { useGetAllStories } from '../hooks/useQueries';
import { exportEbookPdf } from '../features/pdf/exportEbookPdf';

export default function DownloadPdfButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: stories } = useGetAllStories();

  const handleDownload = async () => {
    if (!stories || stories.length === 0) {
      setError('No stories available to download.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      await exportEbookPdf(stories);
      // Success - the print dialog will open
      setTimeout(() => {
        setIsGenerating(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleDownload();
  };

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
          <AlertCircle className="h-4 w-4" />
          <span className="max-w-[200px] truncate">{error}</span>
        </div>
        <button
          onClick={handleRetry}
          className="rounded-full bg-orange-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating || !stories}
      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-2 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      title="Opens print dialog to save as PDF"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Preparing...</span>
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
}
