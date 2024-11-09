import React from 'react';

interface ToolbarProps {
  isLoggedIn: boolean;
  onSync: () => void;
  onLogout: () => void;
}

export function Toolbar({ isLoggedIn, onSync, onLogout }: ToolbarProps) {
  return (
    <div className="toolbar">
      {isLoggedIn ? (
        <>
          <button onClick={onSync}>同步笔记</button>
          <button onClick={onLogout}>退出登录</button>
        </>
      ) : null}
    </div>
  );
} 