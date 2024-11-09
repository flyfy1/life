import React from 'react';

interface ToolbarProps {
  isLoggedIn: boolean;
  onSync: () => void;
  onLogout: () => void;
  isSyncing: boolean;
  syncMessage: string | null;
}

export function Toolbar({ isLoggedIn, onSync, onLogout, isSyncing, syncMessage }: ToolbarProps) {
  return (
    <div className="toolbar">
      {isLoggedIn ? (
        <>
          <button onClick={onSync} disabled={isSyncing}>
            {isSyncing ? '同步中...' : '同步笔记'}
          </button>
          <button onClick={onLogout}>退出登录</button>
          {syncMessage && <span className="sync-message">{syncMessage}</span>}
        </>
      ) : null}
    </div>
  );
} 