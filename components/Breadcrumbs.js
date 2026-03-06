import Link from "next/link";

/**
 * Visible breadcrumb nav (B7). Pass items that match the page BreadcrumbList schema.
 * @param {Array<{ name: string, href?: string }>} items - Last item without href is shown as current page (no link).
 */
export default function Breadcrumbs({ items = [], className = "" }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-gray-600 ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-x-2">
              {i > 0 && <span className="text-gray-400" aria-hidden="true">/</span>}
              {!isLast && item.href ? (
                <Link href={item.href} className="hover:text-[#840032] transition-colors">
                  {item.name}
                </Link>
              ) : (
                <span className={isLast ? "text-gray-900 font-medium" : ""}>{item.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
