import { StackClientApp } from "@stackframe/stack";

// Validar que las variables de entorno estén configuradas
const projectId = import.meta.env.VITE_STACK_PROJECT_ID;
const publishableClientKey = import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY;

if (!projectId || projectId === "your-project-id") {
  console.error("❌ VITE_STACK_PROJECT_ID no está configurado correctamente");
  console.error("Configura esta variable en tu plataforma de deployment (Vercel, Netlify, etc.)");
}

if (!publishableClientKey || publishableClientKey === "your-publishable-key") {
  console.error("❌ VITE_STACK_PUBLISHABLE_CLIENT_KEY no está configurado correctamente");
  console.error("Configura esta variable en tu plataforma de deployment (Vercel, Netlify, etc.)");
}

export const stackClientApp = new StackClientApp({
  projectId: projectId || "f992c91a-1933-45eb-be47-2b481c1139b2",
  publishableClientKey: publishableClientKey || "pck_1ds8tf3c3rnmhdz1hheckw7angf7ttnk9x0mtf861gw5g",
  tokenStore: "memory",
  baseUrl: import.meta.env.VITE_STACK_BASE_URL || "https://api.stack-auth.com"
});