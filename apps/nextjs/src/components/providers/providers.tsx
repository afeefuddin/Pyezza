"use client";
import { PostHogProvider } from "@/providers/posthog";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider>
        <PostHogProvider>{children}</PostHogProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
