
"use client";

import '@/store/store-initializer';

/**
 * This component's sole purpose is to import and run client-side-only
 * logic, such as initializing stores, without turning the root layout
 * into a Client Component.
 */
export function ClientInitializer() {
  // This component renders nothing.
  return null;
}
