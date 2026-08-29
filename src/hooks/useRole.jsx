import React, { createContext, useContext, useState } from 'react';
import { ROLES } from '../utils/permissions';
import { MOCK_USERS } from '../data/mockData';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [activeRole, setActiveRole] = useState(ROLES.ORGANIZER);

  const activeUser = MOCK_USERS.find((u) => u.role === activeRole) || MOCK_USERS[0];

  const switchRole = (newRole) => {
    if (ROLES[newRole]) {
      setActiveRole(newRole);
    }
  };

  return (
    <RoleContext.Provider value={{ activeRole, activeUser, switchRole, ROLES }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
