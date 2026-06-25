import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  BookOpen,
  Calendar,
  FileUp,
  Gem,
  Globe,
  Hash,
  Heart,
  HeartHandshake,
  Home,
  Leaf,
  Library,
  Lightbulb,
  Lock,
  NotebookPen,
  Plus,
  Settings,
  Smartphone,
  Sparkles,
  Star,
} from "lucide-react";
import { plannerAssets } from "@/lib/plannerAssets";

type NavItem = {
  title: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

const DASH: NavItem[] = [{ title: "Dashboard", url: "/", icon: Home }];

const TODAY_FOCUS: NavItem[] = [
  { title: "Today", url: "/today", icon: Calendar },
  { title: "Idea Garden", url: "/parking-lot", icon: Lightbulb },
  { title: "Import Tasks", url: "/import-tasks", icon: FileUp },
  { title: "Weekly Log", url: "/weekly-log", icon: NotebookPen },
];

const CORE: NavItem[] = [
  { title: "Brand", url: "/brand", icon: Gem },
  { title: "Rise", url: "/rise", icon: Heart },
  { title: "Land", url: "/land", icon: Star },
  { title: "Rebuild", url: "/rebuild", icon: Leaf },
  { title: "Meet at the Heal", url: "/meet-at-the-heal", icon: HeartHandshake },
];

const WORK: NavItem[] = [
  { title: "Kit Factory App", url: "/kit-factory-app", icon: Settings },
  { title: "Social Media App", url: "/social-media-app", icon: Smartphone },
  { title: "Website", url: "/website", icon: Globe },
  { title: "Social Media", url: "/social-media", icon: Hash },
];

const FUTURE: NavItem[] = [
  { title: "Calendar", icon: Calendar, disabled: true },
  { title: "Notes", icon: BookOpen, disabled: true },
  { title: "Resources", icon: Library, disabled: true },
  { title: "Analytics", icon: BarChart3, disabled: true },
];

function NavGroup({ label, items, current }: { label?: string; items: NavItem[]; current: string }) {
  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = current === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                {item.disabled || !item.url ? (
                  <SidebarMenuButton
                    disabled
                    className="rounded-xl text-sidebar-foreground/45 opacity-80"
                    title="Coming soon"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                    <Lock className="ml-auto h-3 w-3 opacity-50" />
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={
                      active
                        ? "active-nav-pill rounded-xl font-semibold shadow-[0_10px_24px_rgba(75,22,69,0.22)] hover:active-nav-pill"
                        : "rounded-xl text-sidebar-foreground/85 hover:bg-sidebar-accent/75 hover:text-sidebar-foreground"
                    }
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const current = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border sidebar-gradient">
      <SidebarHeader className="relative overflow-hidden px-4 pb-4 pt-7">
        <img
          aria-hidden="true"
          src={plannerAssets.butterflyBlush}
          alt=""
          className="pointer-events-none absolute -right-8 -top-6 h-24 w-24 opacity-45 mix-blend-multiply"
        />
        <Link to="/" className="relative flex flex-col items-center gap-1.5 text-sidebar-foreground">
          <div className="font-display text-3xl italic leading-none text-plum-deep">
            Best
          </div>
          <div className="-mt-1 font-display text-3xl italic leading-none text-plum-deep">
            Collective
          </div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-plum-soft">
            CEO Studio
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavGroup items={DASH} current={current} />
        <NavGroup label="Today & Focus" items={TODAY_FOCUS} current={current} />
        <NavGroup label="Core Branches" items={CORE} current={current} />
        <NavGroup label="Workstreams" items={WORK} current={current} />
        <NavGroup label="Studio Tools" items={FUTURE} current={current} />
      </SidebarContent>
      <SidebarFooter className="gap-3 p-4">
        <div
          className="rounded-2xl border border-blush/60 bg-warm-white/65 bg-contain bg-center bg-no-repeat px-4 py-5 text-center font-script text-xl leading-snug text-plum-soft shadow-sm"
          style={{
            backgroundImage: `linear-gradient(rgba(255,250,243,0.84), rgba(255,250,243,0.88)), url(${plannerAssets.washLavender})`,
          }}
        >
          <div>You don't have</div>
          <div>to be perfect.</div>
          <div>You just have to</div>
          <div>keep going.</div>
          <Heart className="mx-auto mt-2 h-4 w-4 fill-blush text-orchid" />
        </div>
        <Link
          to="/import-tasks"
          className="active-nav-pill inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[0_12px_26px_rgba(75,22,69,0.24)]"
        >
          <Plus className="h-4 w-4" />
          Quick Capture
          <Sparkles className="h-3.5 w-3.5 text-gold" />
        </Link>
        <div className="text-center text-[10px] uppercase tracking-[0.24em] text-plum-soft/70">
          One Vision. Many Branches.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
