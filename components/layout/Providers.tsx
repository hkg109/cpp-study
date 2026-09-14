"use client";

import { ThemeProvider } from "next-themes";
import { ProgressProvider } from "@/components/lecture/ProgressProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange><ProgressProvider>{children}</ProgressProvider></ThemeProvider>;
}
