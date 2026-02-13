import { Outlet } from '@tanstack/react-router';
import { BookOpen } from 'lucide-react';
import DownloadPdfButton from './DownloadPdfButton';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
      <header className="sticky top-0 z-50 w-full border-b border-amber-200 bg-amber-100/80 backdrop-blur-sm dark:border-amber-800 dark:bg-amber-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              Little Light Bible Stories
            </h1>
          </div>
          <DownloadPdfButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="mt-16 border-t border-amber-200 bg-amber-100/50 py-6 dark:border-amber-800 dark:bg-amber-900/50">
        <div className="container mx-auto px-4 text-center text-sm text-amber-800 dark:text-amber-200">
          <p>© {new Date().getFullYear()} Little Light Bible Stories</p>
          <p className="mt-2">
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'little-light-bible-stories'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
