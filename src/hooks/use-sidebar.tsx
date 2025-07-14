
'use client';

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

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

  useEffect(() => {
    // Add data attribute to body for styling based on sidebar state
    document.documentElement.setAttribute('data-sidebar-is-expanded', String(isExpanded));
  }, [isExpanded]);

  const expandSidebar = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapseSidebar = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const value = { isExpanded, expandSidebar, collapseSidebar };

  return (
    <SidebarContext.Provider value={value}>
      <div className="group" data-sidebar-is-expanded={isExpanded}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
