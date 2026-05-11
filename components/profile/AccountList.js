import { ChevronRight, CreditCard, Hammer, Heart, LogOut, MessageCircle, Package } from "lucide-react";
import Link from "next/link";

const ICONS = { Package, CreditCard, Hammer, Heart, MessageCircle, LogOut };
const ICON_PROPS = { size: 18, strokeWidth: 1.5 };

const ROW_CLASS =
  "flex items-center justify-between w-full py-4 border-b border-wedsy-rose-100/50 hover:bg-wedsy-rose-50 transition-colors text-left";

function RowContent({ item }) {
  const Icon = item.iconName ? ICONS[item.iconName] : null;
  return (
    <>
      <span className="flex items-center gap-3 text-[15px] text-wedsy-ink-2">
        {Icon && <Icon {...ICON_PROPS} className="text-wedsy-ink-3" />}
        {item.label}
      </span>
      <span className="flex items-center gap-2">
        {item.badge && (
          <span className="text-[10px] tracking-[1px] uppercase font-medium bg-wedsy-rose-600 text-white px-2 py-0.5">
            {item.badge}
          </span>
        )}
        <ChevronRight {...ICON_PROPS} className="text-wedsy-ink-3" />
      </span>
    </>
  );
}

export default function AccountList({ items = [], onSignOut }) {
  return (
    <section className="pt-2 pb-12 px-6">
      <p className="wedsy-eyebrow">ACCOUNT</p>
      <h2 className="wedsy-title text-[24px] mt-2 text-wedsy-ink">Manage your wedding</h2>
      <p className="wedsy-italic-em text-[14px] mt-1">Everything you&apos;ve shared with us</p>
      <div className="wedsy-ornament-divider my-6 mx-auto"></div>

      <ul>
        {items.map((item, i) =>
          item.href ? (
            <li key={i}>
              <Link href={item.href} className={ROW_CLASS} onClick={item.onTap}>
                <RowContent item={item} />
              </Link>
            </li>
          ) : (
            <li key={i}>
              <button type="button" onClick={item.onTap} className={ROW_CLASS}>
                <RowContent item={item} />
              </button>
            </li>
          )
        )}

        <li>
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-3 w-full py-4 mt-2 text-[15px] text-wedsy-burgundy-soft hover:bg-wedsy-rose-50 transition-colors text-left"
          >
            <LogOut {...ICON_PROPS} />
            Sign Out
          </button>
        </li>
      </ul>
    </section>
  );
}
