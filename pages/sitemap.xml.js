function generateSiteMap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${urls
       .map((url) => {
         return `
       <url>
           <loc>${url.loc}</loc>
           <lastmod>${url.lastmod}</lastmod>
           <changefreq>${url.changefreq}</changefreq>
           <priority>${url.priority}</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  const baseUrl = 'https://www.wedsy.in';
  const currentDate = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      loc: `${baseUrl}/decor`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8',
    },
    {
      loc: `${baseUrl}/makeup-and-beauty`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8',
    },
    {
      loc: `${baseUrl}/makeup-and-beauty/artists`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8',
    },
    {
      loc: `${baseUrl}/makeup-and-beauty/wedsy-packages`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8',
    },
    {
      loc: `${baseUrl}/wedding-store`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8',
    },
    {
      loc: `${baseUrl}/home`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      loc: `${baseUrl}/weddings-made-easy`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      loc: `${baseUrl}/privacy-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.3',
    },
    {
      loc: `${baseUrl}/terms-and-conditions`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.3',
    },
  ];

  // Fetch dynamic product pages
  let decorPages = [];
  try {
    const decorResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor?limit=1000`
    );
    if (decorResponse.ok) {
      const decorData = await decorResponse.json();
      if (decorData.list && Array.isArray(decorData.list)) {
        decorPages = decorData.list.map((item) => ({
          loc: `${baseUrl}/decor/view/${item._id}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: '0.6',
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching decor items:', error);
  }

  // Fetch decor package pages
  let packagePages = [];
  try {
    const packageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/decor-package?limit=1000`
    );
    if (packageResponse.ok) {
      const packageData = await packageResponse.json();
      if (packageData.list && Array.isArray(packageData.list)) {
        packagePages = packageData.list.map((item) => ({
          loc: `${baseUrl}/decor/packages/${item._id}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: '0.6',
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching decor packages:', error);
  }

  // Fetch vendor/artist pages
  let vendorPages = [];
  try {
    const vendorResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor?limit=1000`
    );
    if (vendorResponse.ok) {
      const vendorData = await vendorResponse.json();
      if (vendorData.list && Array.isArray(vendorData.list)) {
        vendorPages = vendorData.list.map((item) => ({
          loc: `${baseUrl}/makeup-and-beauty/artists/${item._id}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: '0.6',
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching vendors:', error);
  }

  // Combine all URLs
  const allUrls = [...staticPages, ...decorPages, ...packagePages, ...vendorPages];

  // Generate the XML sitemap with the blog data
  const sitemap = generateSiteMap(allUrls);

  res.setHeader('Content-Type', 'text/xml');
  // Write the XML to the response
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;

