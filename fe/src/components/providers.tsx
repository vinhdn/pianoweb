"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/contexts/cart-context";
import { CompareProvider } from "@/contexts/compare-context";
import type { Session } from "next-auth";

export function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <CompareProvider>{children}</CompareProvider>
      </CartProvider>
    </SessionProvider>
  );
}
