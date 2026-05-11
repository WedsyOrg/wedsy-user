import EventSwitcherDropdown from "@/components/profile/EventSwitcherDropdown";
import {
  Bookmark,
  CalendarRange,
  CreditCard,
  Hammer,
  Heart,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageCircle,
  Package,
  Sparkles,
  Store,
  UserCircle,
} from "lucide-react";
import Link from "next/link";

function deriveMonogram(event) {
  if (!event?.name) return "W";
  const initials = event.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
  return initials || "W";
}

const NAV_ICON_PROPS = { size: 16, strokeWidth: 1.5 };

function NavRow({ icon: Icon, label, active = false, badge, href }) {
  const base = "flex items-center justify-between gap-3 px-3 py-2 text-[13px] transition-colors";
  const tone = active
    ? "bg-wedsy-rose-50 text-wedsy-ink font-medium"
    : "text-wedsy-ink-2 hover:bg-wedsy-rose-50/40";
  const content = (
    <>
      <span className="flex items-center gap-3">
        <Icon {...NAV_ICON_PROPS} className="text-wedsy-rose-600" />
        {label}
      </span>
      {badge && (
        <span className="text-[9px] tracking-[1px] uppercase font-medium bg-wedsy-rose-600 text-white px-1.5 py-0.5">
          {badge}
        </span>
      )}
    </>
  );
  return <Link href={href || "#"} className={`${base} ${tone}`}>{content}</Link>;
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] tracking-[2px] uppercase font-medium text-wedsy-ink-3 px-3 mt-5 mb-2">
      {children}
    </p>
  );
}

function PlaceholderCard({ eyebrow, label }) {
  return (
    <div className="bg-white border border-wedsy-rose-100 rounded p-6">
      <p className="text-[10px] tracking-[2px] uppercase font-medium text-wedsy-rose-600">{eyebrow}</p>
      <p className="font-serif text-[16px] text-wedsy-ink mt-2">{label}</p>
      <p className="font-serif italic text-[12px] text-wedsy-ink-3 mt-1">(coming in 1.5.E)</p>
    </div>
  );
}

export default function DesktopLayout({
  event,
  events,
  onSwitchEvent,
  onCreateNewEvent,
  onManageAllEvents,
  children,
}) {
  const monogram = deriveMonogram(event);

  return (
    <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:min-h-screen">
      <aside className="hidden lg:flex lg:flex-col bg-wedsy-ivory-2 px-6 py-9">
        <div className="text-center pb-4 border-b border-wedsy-rose-100">
          <span className="font-serif text-[36px] tracking-[4px] text-wedsy-burgundy">{monogram}</span>
        </div>
        <EventSwitcherDropdown
          event={event}
          events={events}
          onSwitch={onSwitchEvent}
          onCreateNew={onCreateNewEvent}
          onManageAll={onManageAllEvents}
        />
        <nav className="flex-1 mt-2">
          <SectionLabel>This wedding</SectionLabel>
          <NavRow icon={LayoutDashboard} label="Dashboard" active />
          <NavRow icon={CalendarRange} label="Event days" />
          <NavRow icon={ListChecks} label="Timeline" />
          <SectionLabel>Activity</SectionLabel>
          <NavRow icon={Package} label="Orders" />
          <NavRow icon={CreditCard} label="Payments" />
          <NavRow icon={Hammer} label="My bids" badge="3 NEW" />
          <NavRow icon={Heart} label="Wishlist" />
          <SectionLabel>Discover</SectionLabel>
          <NavRow icon={Bookmark} label="Inspiration" />
          <NavRow icon={MessageCircle} label="Support" />
          <SectionLabel>Browse</SectionLabel>
          <NavRow icon={Store} label="Wedding Store" href="/wedding-store" />
          <NavRow icon={Sparkles} label="Makeup & Beauty" href="/makeup-and-beauty" />
        </nav>
        <div className="pt-4 border-t border-wedsy-rose-100 mt-2">
          <NavRow icon={UserCircle} label="Account" />
          <NavRow icon={LogOut} label="Sign out" />
        </div>
      </aside>

      <main className="lg:py-12 lg:px-14">{children}</main>

      <aside className="hidden lg:block bg-wedsy-ivory border-l border-wedsy-rose-100 px-7 py-14">
        <div className="space-y-6">
          <PlaceholderCard eyebrow="NEXT UP" label="Next-up callout" />
          <PlaceholderCard eyebrow="INSPIRATION" label="Inspiration card" />
          <PlaceholderCard eyebrow="THIS WEEK" label="This week" />
        </div>
      </aside>
    </div>
  );
}
