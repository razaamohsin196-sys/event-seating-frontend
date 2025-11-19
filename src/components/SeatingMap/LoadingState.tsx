export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
        <p className="mt-6 text-slate-600 dark:text-slate-400 font-medium text-lg">Loading venue data...</p>
      </div>
    </div>
  );
}