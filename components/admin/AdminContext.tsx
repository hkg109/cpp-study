"use client";

import { createContext, useContext } from "react";

export interface AdminContextValue {
  isAdmin: boolean;
  openAdmin: () => void;
}

export const AdminContext = createContext<AdminContextValue>({ isAdmin: false, openAdmin: () => undefined });

export const useAdmin = () => useContext(AdminContext);
