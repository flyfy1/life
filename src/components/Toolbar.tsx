import React from 'react';
import { SortField, SortOption } from '../types/index';
import { useNoteContext } from '../context/NoteContext';
import { sortNotes } from '../utils/note';
import { DatabaseService } from '../services/db';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

interface ToolbarProps {
  onSync: () => void;
}

export function Toolbar({ 
  onSync, 
}: ToolbarProps) {
  const { state, dispatch } = useNoteContext();

  const { isSyncing, sortOption, dateRange, syncDays, isLoggedIn } = state;
  const { t } = useTranslation();

  const handleSortChange = (newSortOption: SortOption) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: newSortOption });
    dispatch({ type: 'SET_NOTES', payload: sortNotes(newSortOption, state.notes) });
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const handleSyncDaysChange = (days: number) => {
    dispatch({ type: 'SET_SYNC_DAYS', payload: days });
  };

  const handleDateRangeChange = (newRange: { startDate: string; endDate: string }) => {
    dispatch({ type: 'SET_DATE_RANGE', payload: newRange });
    filterNotesByDateRange(newRange);
  };
  const filterNotesByDateRange = async (range: { startDate: string; endDate: string }) => {
    const allNotes = await DatabaseService.getAllNotes();
    const filteredNotes = allNotes.filter(note => {
      const noteDate = note.ctime.split('T')[0];
      return noteDate >= range.startDate && noteDate <= range.endDate;
    });
    dispatch({ type: 'SET_NOTES', payload: sortNotes(state.sortOption, filteredNotes) });
  };




  // TODO: move this logic into reducer
  const loadLocalNotes = async () => {
    const localNotes = await DatabaseService.getAllNotes();
    const sortedNotes = sortNotes(sortOption, localNotes);
    dispatch({ type: 'SET_NOTES', payload: sortedNotes });

    if (sortedNotes.length > 0) {
      const dates = sortedNotes.map(note => note.ctime.split('T')[0]);
      dispatch({ type: 'SET_DATE_RANGE', payload: {
        startDate: dates[dates.length - 1],
        endDate: dates[0]
      }});
    } else {
      const today = new Date().toISOString().split('T')[0];
      dispatch({ type: 'SET_DATE_RANGE', payload: {
        startDate: today,
        endDate: today
      }});
    }
  };

  const onAddNote = async () => {
    dispatch({type: 'SET_ADDING_NOTE', payload: true})
  }

  return (
    <div className="toolbar flex flex-col gap-2">
      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                max={dateRange.endDate}
                onChange={(e) => handleDateRangeChange({
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
                onChange={(e) => handleDateRangeChange({
                  ...dateRange,
                  endDate: e.target.value
                })}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortOption.field}
                onChange={(e) => handleSortChange({
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
                onClick={() => handleSortChange({
                  ...sortOption,
                  direction: sortOption.direction === 'desc' ? 'asc' : 'desc'
                })}
              >
                {sortOption.direction === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto right-controls">
            <button onClick={onAddNote} className="edit-button">
              {t('add_note')}
            </button>
            <select value={syncDays} onChange={(e) => handleSyncDaysChange(Number(e.target.value))}>
              <option value={7}>{t('last_x_days', { days: 7 })}</option>
              <option value={14}>{t('last_x_days', { days: 14 })}</option>
              <option value={30}>{t('last_x_days', { days: 30 })}</option>
            </select>
            <button 
              onClick={onSync} 
              disabled={isSyncing}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {isSyncing ? t('syncing') : t('sync_notes')}
            </button>
            <button onClick={handleLogout}>{t('logout')}</button>
            <select onChange={(e) => changeLanguage(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
          </div>
        </>
      ) :  <div className="flex items-center gap-2 ml-auto right-controls">
            <select onChange={(e) => changeLanguage(e.target.value)} className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
        </div>}
    </div>
  );
} 