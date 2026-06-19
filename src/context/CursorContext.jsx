import React, { createContext, useState, useCallback } from 'react';

export const CursorContext = createContext({
  cursorType: 'default',
  cursorLabel: '',
  hoveredElement: null,
  triggerHover: () => {},
  triggerDefault: () => {},
  setMagneticElement: () => {}
});

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default');
  const [cursorLabel, setCursorLabel] = useState('');
  const [hoveredElement, setHoveredElement] = useState(null);

  const triggerHover = useCallback((label = '', element = null) => {
    setCursorType('hover');
    setCursorLabel(label);
    setHoveredElement(element);
  }, []);

  const triggerDefault = useCallback(() => {
    setCursorType('default');
    setCursorLabel('');
    setHoveredElement(null);
  }, []);

  const setMagneticElement = useCallback(() => {}, []);

  return (
    <CursorContext.Provider value={{
      cursorType,
      cursorLabel,
      hoveredElement,
      triggerHover,
      triggerDefault,
      setMagneticElement
    }}>
      {children}
    </CursorContext.Provider>
  );
};
