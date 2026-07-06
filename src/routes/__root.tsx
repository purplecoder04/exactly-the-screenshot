import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Toaster } from "@/components/ui/sonner";
import { useContinueWorking } from "@/hooks/useContinueWorking";
import type { ContinueWorkingState, WorkspaceArea } from "@/lib/types";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Best Collective CEO Dashboard" },
      { name: "description", content: "A calm, elegant command center for the Best Collective CEO." },
      { property: "og:title", content: "Best Collective CEO Dashboard" },
      { property: "og:description", content: "A calm, elegant command center for the Best Collective CEO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&family=Parisienne&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

type ContinueMemoryPatch = Partial<ContinueWorkingState>;

const AREA_ROUTE_MEMORY: Record<WorkspaceArea, ContinueMemoryPatch> = {
  Brand: { lastBranch: "Brand", lastProduct: "Brand" },
  Rise: { lastBranch: "Rise", lastProduct: "Rise" },
  Land: { lastBranch: "Land", lastProduct: "Land" },
  Rebuild: { lastBranch: "Rebuild", lastProduct: "Rebuild" },
  "Meet at the Heal": {
    lastBranch: "Meet at the Heal",
    lastProduct: "Meet at the Heal",
  },
  "Kit Factory App": {
    lastBranch: "Kit Factory App",
    lastProduct: "Kit Factory App",
    lastApp: "Kit Factory App",
  },
  "Social Media App": {
    lastBranch: "Social Media App",
    lastProduct: "Social Media App",
    lastApp: "Social Media App",
  },
  Website: { lastBranch: "Website", lastProduct: "Website", lastApp: "Website Studio" },
  "Social Media": {
    lastBranch: "Social Media",
    lastProduct: "Social Media",
    lastApp: "Content Studio",
  },
};

const ROUTE_MEMORY: Record<string, ContinueMemoryPatch> = {
  "/brand": AREA_ROUTE_MEMORY.Brand,
  "/rise": AREA_ROUTE_MEMORY.Rise,
  "/land": AREA_ROUTE_MEMORY.Land,
  "/rebuild": AREA_ROUTE_MEMORY.Rebuild,
  "/meet-at-the-heal": AREA_ROUTE_MEMORY["Meet at the Heal"],
  "/kit-factory-app": AREA_ROUTE_MEMORY["Kit Factory App"],
  "/social-media-app": AREA_ROUTE_MEMORY["Social Media App"],
  "/website": AREA_ROUTE_MEMORY.Website,
  "/social-media": AREA_ROUTE_MEMORY["Social Media"],
  "/today": { lastBranch: "", lastProduct: "Today's Top 3" },
  "/brain-dump": { lastBranch: "", lastProduct: "Brain Dump" },
  "/parking-lot": { lastBranch: "", lastProduct: "Idea Garden" },
  "/import-tasks": { lastBranch: "", lastProduct: "Import Work Session" },
  "/weekly-planning": { lastBranch: "", lastProduct: "Weekly Planning" },
  "/weekly-log": { lastBranch: "", lastProduct: "Weekly Log" },
  "/products": { lastBranch: "", lastProduct: "Product Catalog" },
  "/frameworks": { lastBranch: "", lastProduct: "Framework Library" },
  "/library": { lastBranch: "", lastProduct: "Library" },
};

function ContinueWorkingTracker() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { remember, isLoading } = useContinueWorking();
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    if (isLoading || pathname === "/" || lastTrackedPath.current === pathname) return;

    const patch = ROUTE_MEMORY[pathname];
    if (!patch) return;

    lastTrackedPath.current = pathname;
    remember({
      lastLesson: "",
      lastWorkbook: "",
      lastApp: "",
      taskId: undefined,
      ...patch,
      lastPage: pathname,
    });
  }, [isLoading, pathname, remember]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}

function AppShell() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <ContinueWorkingTracker />
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-transparent">
          <AppHeader />
          <main className="min-w-0 flex-1 px-4 pb-12 md:px-8 xl:px-10">
            <Outlet />
          </main>
          <Toaster richColors position="top-right" />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
