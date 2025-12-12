import React from 'react';
import { FileText, Moon, BookOpen, AlertCircle } from 'lucide-react';
import { DailyData } from '../types';

/**
 * Entry type for the new array-shaped JSON
 */
type Entry = {
  date?: string;
  summary?: string | null;
  highlights?: string[];
  tasks?: { task: string; done: boolean }[];
  sleep?: number | null;
  study?: number | null;
  isLoading?: boolean;
};

/**
 * Accept either:
 * - legacy DailyData (object per-day)
 * - Entry (object per-day v2)
 * - Entry[] (array of days) <- this is your JSON format
 */
interface DailySummaryProps {
  date: string;
  data: DailyData | Entry | Entry[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ date, data }) => {
  // Helper: if data is an array, find the matching entry by date
  const normalizeEntry = (): Entry | null => {
    if (Array.isArray(data)) {
      // Try exact match by ISO date string
      const found = (data as Entry[]).find((e) => e?.date === date);
      return found ?? null;
    }

    // If data has a date property, assume it's already an Entry
    if ((data as Entry).date !== undefined || (data as Entry).highlights !== undefined || (data as Entry).tasks !== undefined) {
      return data as Entry;
    }

    // Otherwise, assume legacy DailyData shape: map fields over to Entry
    // legacy DailyData likely looks like { summary, sleep, study, isLoading }
    return {
      summary: (data as any).summary ?? null,
      sleep: (data as any).sleep ?? null,
      study: (data as any).study ?? null,
      isLoading: (data as any).isLoading ?? false,
    };
  };

  const entry = normalizeEntry();

  // If nothing found for an array input, entry will be null.
  // We'll treat that as "no entry" (not loading).
  const isLoading = !!(entry && entry.isLoading);
  const summaryText: string | null | undefined = entry?.summary ?? null;
  const highlights: string[] | undefined = entry?.highlights;
  const tasks: { task: string; done: boolean }[] | undefined = entry?.tasks;
  const sleepVal: number | null | undefined = entry?.sleep;
  const studyVal: number | null | undefined = entry?.study;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Safe renderer when text might be undefined or null
  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white mt-5 mb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{line.replace('# ', '')}</h1>;
      
      // List items
      if (line.trim().startsWith('- ')) {
         return (
             <div key={i} className="flex gap-2 ml-1 mb-1 text-gray-300">
                 <span className="text-emerald-500">•</span>
                 <span>{line.replace('- ', '').replace('[x]', '✅').replace('[ ]', '⬜')}</span>
             </div>
         );
      }

      // Empty lines
      if (!line.trim()) return <div key={i} className="h-2" />;

      // Standard Paragraph
      return <p key={i} className="text-gray-300 mb-1 leading-relaxed">{line}</p>;
    });
  };

  if (isLoading) {
      return (
          <div className="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center animate-pulse">
              <div className="h-4 w-32 bg-white/10 rounded mb-4"></div>
              <div className="h-32 w-full bg-white/5 rounded"></div>
          </div>
      );
  }

  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
      <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
        <div>
            <h2 className="text-xl font-semibold text-white mb-1">Daily Archive</h2>
            <p className="text-sm text-gray-500 font-mono">{formattedDate}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <FileText size={16} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 mb-6 custom-scrollbar">
        {/* Primary summary string (if present) */}
        {summaryText ? (
          <div className="text-sm md:text-base">
            {renderContent(summaryText)}
          </div>
        ) : (
          // If summary absent but highlights/tasks present, show them instead.
          ( (highlights && highlights.length > 0) || (tasks && tasks.length > 0) ) ? (
            <div className="text-sm md:text-base space-y-3">
              {highlights && highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">Highlights</h3>
                  <div className="ml-1">
                    {highlights.map((h, idx) => (
                      <div key={idx} className="flex gap-2 mb-1 text-gray-300">
                        <span className="text-emerald-500">•</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tasks && tasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mt-2 mb-2">Tasks</h3>
                  <div className="ml-1">
                    {tasks.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-3 mb-1 text-gray-300">
                        <span className="text-emerald-500">{t.done ? '✅' : '⬜'}</span>
                        <span>{t.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <AlertCircle size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No entry recorded for this day.</p>
            </div>
          )
        )}
      </div>

      {/* Mini Stats Footer */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Moon size={18} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Sleep</p>
                <p className="text-lg font-bold text-white">
                    {sleepVal !== null && sleepVal !== undefined ? `${sleepVal}h` : '--'}
                </p>
            </div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <BookOpen size={18} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Study</p>
                <p className="text-lg font-bold text-white">
                    {studyVal !== null && studyVal !== undefined ? `${studyVal}h` : '--'}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
