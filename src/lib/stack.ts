import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID || "your-project-id",
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY || "your-publishable-key",
  tokenStore: "memory"
});