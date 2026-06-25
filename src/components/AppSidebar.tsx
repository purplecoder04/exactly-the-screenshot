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
  Home,
  Calendar,
  Briefcase,
  FileUp,
  Gem,
  Heart,
  Star,
  Leaf,
  HeartHandshake,
  Settings,
  Smartphone,
  Globe,
  Hash,
  BarChart3,
  Crown,
} from "lucide-react";

type NavItem = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

const DASH: NavItem[] = [{ title: "Dashboard", url: "/", icon: Home }];

const TODAY_FOCUS: NavItem[] = [
  { title: "Today", url: "/today", icon: Calendar },
  { title: "Parking Lot", url: "/parking-lot", icon: Briefcase },
  { title: "Import Tasks", url: "/import-tasks", icon: FileUp },
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

const REVIEW: NavItem[] = [{ title: "Weekly Log", url: "/weekly-log", icon: BarChart3 }];

function NavGroup({ label, items, current }: { label?: string; items: NavItem[]; current: string }) {
  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold/90">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = current === item.url;
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className={
                    active
                      ? "active-nav-pill rounded-md font-medium shadow-[0_2px_10px_rgba(0,0,0,0.18)] hover:active-nav-pill"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  }
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
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
      <SidebarHeader className="px-4 pb-4 pt-6">
        <Link to="/" className="flex flex-col items-center gap-1.5 text-sidebar-foreground">
          <Crown className="h-7 w-7 text-gold" strokeWidth={1.5} />
          <div className="text-center font-display text-lg leading-tight tracking-[0.18em]">
            BEST<br />COLLECTIVE
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-1.5">
        <NavGroup items={DASH} current={current} />
        <NavGroup label="Today & Focus" items={TODAY_FOCUS} current={current} />
        <NavGroup label="Core Branches" items={CORE} current={current} />
        <NavGroup label="Workstreams" items={WORK} current={current} />
        <NavGroup label="Review" items={REVIEW} current={current} />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-md border border-gold/60 bg-plum-deep/20 px-4 py-3 text-center font-display italic leading-snug text-gold">
          <div>One Vision.</div>
          <div>Many Branches.</div>
          <div>One Mission.</div>
          <Heart className="mx-auto mt-1.5 h-3.5 w-3.5 fill-gold text-gold" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
