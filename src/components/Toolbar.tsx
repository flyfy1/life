import React from 'react';
import { SortField, SortDirection, SortOption } from '../types/index';

interface ToolbarProps {
  isLoggedIn: boolean;
  onSync: () => void;
  onLogout: () => void;
  isSyncing: boolean;
  syncMessage: string | null;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  changeLang: (lng: string) => void;
  t: (key: string) => string;
}

export function Toolbar({ 
  isLoggedIn, 
  onSync, 
  onLogout, 
  isSyncing, 
  syncMessage,
  dateRange,
  onDateRangeChange,
  sortOption,
  onSortChange,
  changeLang,
  t
}: ToolbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-gray-200 border-b border-gray-300 flex items-center px-4 gap-2 z-50">
      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                max={dateRange.endDate}
                onChange={(e) => onDateRangeChange({
                  ...dateRange,
                  startDate: e.target.value
                })}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <span>{t('to')}</span>
              <input
                type="date"
                value={dateRange.endDate}
                min={dateRange.startDate}
                onChange={(e) => onDateRangeChange({
                  ...dateRange,
                  endDate: e.target.value
                })}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={sortOption.field}
                onChange={(e) => onSortChange({
                  ...sortOption,
                  field: e.target.value as SortField
                })}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="ctime">{t('creation_time')}</option>
                <option value="mtime">{t('modification_time')}</option>
              </select>
              
              <button
                className={`p-2 border border-gray-300 rounded bg-white hover:bg-gray-100 transition ${sortOption.direction}`}
                onClick={() => onSortChange({
                  ...sortOption,
                  direction: sortOption.direction === 'desc' ? 'asc' : 'desc'
                })}
              >
                {sortOption.direction === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 right-controls">
            <button 
              onClick={onSync} 
              disabled={isSyncing}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {isSyncing ? t('syncing') : t('sync_notes')}
            </button>
            <button onClick={onLogout}>{t('logout')}</button>
            <select onChange={(e) => changeLang(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
            {syncMessage && <span className="sync-message">{syncMessage}</span>}
          </div>
        </>
      ) : null}
    </div>
  );
} 