import { ReactNode } from 'react';
import { Armchair } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0 transition-colors">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-lg flex-shrink-0">
                <Armchair className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">Event Seating</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Select up to 8 seats</p>
              </div>
            </div>
            <div className="flex items-center flex-shrink-0 ml-2">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}