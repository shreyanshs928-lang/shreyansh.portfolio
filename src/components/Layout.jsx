import React from 'react';

export const Layout = ({ children }) => {
  return (
    <div
      className="layout-wrapper"
      style={{
        minHeight: '100dvh',
        width: '100%',
        backgroundColor: '#070B18',
        color: '#FFFFFF',
        position: 'relative',
        isolation: 'isolate',
        overflowX: 'hidden'
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
