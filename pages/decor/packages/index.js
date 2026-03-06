import Breadcrumbs from "@/components/Breadcrumbs";
import DecorPackageTile from "@/components/decor-packages/DecorPackageTile";
import { trimTitle, trimDescription } from "@/utils/seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const CATEGORY_OPTIONS = [
  "Reception",
  "Haldi",
  "Mehendi",
  "Nikah",
  "Sangeet",
  "Muhurattam",
  "Add Ons",
];

function buildQueryString(obj) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    params.set(k, String(v));
  });
  return params.toString();
}

export async function getServerSideProps(context) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const category = String(context.query.category || "");

    if (!apiUrl) {
      return {
        props: {
          packages: [],
          category,
          apiAvailable: false,
        },
      };
    }

    // Keep it simple: fetch ALL packages (same as your Postman call),
    // then filter locally for the selected category.
    const res = await fetch(`${apiUrl}/decor-package?${buildQueryString({ limit: 1000 })}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return {
        props: {
          packages: [],
          page: 1,
          totalPages: 1,
          category,
          apiAvailable: true,
        },
      };
    }

    const data = await res.json().catch(() => null);
    const allPackagesRaw = Array.isArray(data?.list) ? data.list : [];

    // Sort packages by numeric suffix in name ("Package 1", "Package 2", ...)
    const getNum = (pkg) => {
      const m = String(pkg?.name || "").match(/(\d+)/);
      return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
    };
    const allPackages = [...allPackagesRaw].sort((a, b) => getNum(a) - getNum(b));

    const cLower = String(category || "").toLowerCase().trim();
    const filtered =
      !cLower
        ? allPackages
        : allPackages.filter((pkg) => {
            const decor = Array.isArray(pkg?.decor) ? pkg.decor : [];
            return decor.some((d) => {
              const tags = Array.isArray(d?.tags) ? d.tags : [];
              const occ = Array.isArray(d?.productVariation?.occassion)
                ? d.productVariation.occassion
                : [];
              return (
                tags.map((t) => String(t).toLowerCase()).includes(cLower) ||
                occ.map((o) => String(o).toLowerCase()).includes(cLower)
              );
            });
          });

    const packages = filtered;

    return {
      props: {
        packages,
        category,
        apiAvailable: true,
      },
    };
  } catch (e) {
    return {
      props: {
        packages: [],
        category: String(context?.query?.category || ""),
        apiAvailable: true,
      },
    };
  }
}

export default function DecorPackagesIndex({
  packages = [],
  category = "",
  apiAvailable = true,
}) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{trimTitle("Packages | Wedsy")}</title>
        <meta
          name="description"
          content={trimDescription("Browse decor packages by occasion and explore package details.")}
        />
        <link
          rel="canonical"
          href={`https://www.wedsy.in${router.asPath.split("?")[0]}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.wedsy.in" },
                { "@type": "ListItem", "position": 2, "name": "Decor", "item": "https://www.wedsy.in/decor" },
                { "@type": "ListItem", "position": 3, "name": category ? category : "Packages", "item": `https://www.wedsy.in/decor/packages${category ? `?category=${encodeURIComponent(category)}` : ""}` },
              ],
            }),
          }}
        />
      </Head>

      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Decor", href: "/decor" },
              ...(category ? [{ name: "Packages", href: "/decor/packages" }, { name: category }] : [{ name: "Packages" }]),
            ]}
            className="mb-4"
          />
          <h1
            className="text-center text-xl md:text-2xl tracking-[0.35em] text-gray-800"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            PACKAGES
          </h1>
          <div className="mt-4 h-px bg-gray-200" />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            {/* Left sidebar */}
            <aside className="relative px-1">
              <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-gray-200" />
              <div className="flex md:flex-col gap-3 md:gap-4 md:pr-8 overflow-x-auto md:overflow-visible py-1 scrollbar-hide">
                {CATEGORY_OPTIONS.map((c) => {
                  const active = c === category;
                  return (
                    <Link
                      key={c}
                      href={
                        active
                          ? "/decor/packages"
                          : `/decor/packages?${buildQueryString({ category: c })}`
                      }
                      className={`shrink-0 md:shrink rounded-full px-6 py-2 text-sm border transition-colors ${
                        active
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {c}
                    </Link>
                  );
                })}
              </div>
            </aside>

            {/* Grid */}
            <section>
              {!apiAvailable ? (
                <div className="text-sm text-gray-700">
                  API not configured. Set <code>NEXT_PUBLIC_API_URL</code> to load
                  packages.
                </div>
              ) : packages.length === 0 ? (
                <div className="text-center py-12 md:py-16">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                    {category ? <>No packages found for <b>{category}</b></> : "No packages found"}
                  </h2>
                  <p className="text-gray-600 mt-2 mb-6">Try a popular occasion or view all packages.</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <Link
                        key={cat}
                        href={`/decor/packages${cat ? `?category=${encodeURIComponent(cat)}` : ""}`}
                        className="py-2 px-4 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-800 hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-sm"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/decor/packages"
                    className="inline-block py-2.5 px-6 rounded-full text-sm font-semibold bg-[#840032] text-white hover:bg-rose-800 transition-colors"
                  >
                    View all packages
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                  {packages.map((pkg, idx) => (
                    <DecorPackageTile
                      key={pkg?._id || idx}
                      decorPackage={pkg}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}


