"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const BookingModalContext = createContext(null);

/*
 * Wraps the app (see src/app/layout.js) so any component can trigger
 * the "Book a Free Site Visit" popup form via useBookingModal(),
 * without having to navigate to the Contact page.
 */
export function BookingModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  );

  return (
    <BookingModalContext.Provider value={value}>
      {children}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(BookingModalContext);

  if (!context) {
    throw new Error(
      "useBookingModal must be used within a BookingModalProvider",
    );
  }

  return context;
}
