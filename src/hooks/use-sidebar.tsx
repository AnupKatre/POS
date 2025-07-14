
'use client';

import React, { createContext, useState, useContext, useCallback } from 'react';

interface SidebarContextType {
  isExpanded: boolean;
  expandSidebar: () => void;
  collapseSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const expandSidebar = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapseSidebar = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ isExpanded, expandSidebar, collapseSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
