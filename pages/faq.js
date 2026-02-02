import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqsData = [
    // Wedding Planning FAQs
    {
      category: "Wedding Planning",
      question: "Why should I choose Wedsy for my wedding planning in Bangalore?",
      answer: "Planning a wedding is one of the most exciting yet overwhelming experiences in life. At Wedsy, we're here to make it beautiful, seamless, and truly yours. As one of the top wedding planners in Bangalore, our goal is simple — to bring your vision to life with creativity, care, and absolute attention to detail. Whether you're planning a grand celebration or an intimate gathering, Wedsy ensures your special day feels magical from start to finish."
    },
    {
      category: "Wedding Planning",
      question: "What makes Wedsy different from other wedding planners?",
      answer: "At Wedsy, we understand that no two weddings are the same. From traditional South Indian ceremonies to modern fusion weddings, our team designs events that feel personal and unforgettable. Our services include: End-to-End Planning – From venue selection to the final farewell, we manage every detail. Customized Wedding Packages – Tailored to your preferences, culture, and budget. Budget-Friendly Solutions – Ideal for couples looking for low budget wedding planners in Bangalore. Creative Vision – Themes, décor, and experiences that reflect your personality. Experienced Vendor Network – Reliable, high-quality services from the best in the industry."
    },
    {
      category: "Wedding Planning",
      question: "Do you offer wedding packages in Bangalore?",
      answer: "Yes, we offer a variety of wedding packages in Bangalore to suit every size, style, and setting. From classic indoor weddings to outdoor garden ceremonies, our packages are fully managed to simplify your planning journey."
    },
    {
      category: "Wedding Planning",
      question: "What are your affordable wedding packages?",
      answer: "Our affordable wedding packages include venue styling, guest management, photography, entertainment, rituals, and more — all customized to your needs. We ensure quality while keeping the budget in mind."
    },
    {
      category: "Wedding Planning",
      question: "Can you help with low budget wedding planning in Bangalore?",
      answer: "Absolutely. Even with a limited budget, you deserve a celebration to remember. We specialize in elegant, cost-effective solutions for couples looking for low budget wedding planners in Bangalore."
    },
    {
      category: "Wedding Planning",
      question: "Do you plan destination weddings in India?",
      answer: "Yes, Wedsy specializes in stunning destination weddings across India. Whether you want a beachside wedding in Goa, hill station like Coorg, Ooty, a regal palace in Rajasthan, or a hilltop ceremony, we make it happen smoothly and affordably."
    },
    {
      category: "Wedding Planning",
      question: "What's included in your affordable destination wedding packages?",
      answer: "Our affordable destination wedding packages in India include: Complete travel and accommodation coordination, Culturally sensitive planning for any location, On-site vendor and logistics management. We take care of everything so you can focus on celebrating your love."
    },
    {
      category: "Wedding Planning",
      question: "Are destination weddings really affordable with Wedsy?",
      answer: "Yes. At Wedsy, we believe your dream wedding should never feel out of budget. Our affordable destination wedding packages balance style, value, and experience — with every detail handled for you."
    },
    {
      category: "Wedding Planning",
      question: "Why do couples trust Wedsy for wedding event planning?",
      answer: "We're not just planners — we're partners in your journey. From your first consultation to the final dance, we make sure every detail is perfect. Choosing Wedsy means peace of mind, knowing your wedding will be exactly as planned — or even better."
    },
    {
      category: "Wedding Planning",
      question: "What is the Event Tool?",
      answer: "The Event Tool is a specially designed organizational feature for your events. Simply create an event, such as \"Rahul's Wedding,\" and add multiple event days like haldi, sangeet, and the wedding ceremony. Once set up, you can easily add your selected décor from our Décor Store to the respective event days. This tool ensures your event stays well-organized and hassle-free."
    },
    {
      category: "Wedding Planning",
      question: "Do you offer discounts?",
      answer: "Yes. Wedsy provides discounts on the overall list of requirements for your wedding. Don't forget to ask your wedding planner for the best available offers."
    },
    {
      category: "Wedding Planning",
      question: "Who is the best wedding planner in Bangalore?",
      answer: "Wedsy is a full service wedding planner in Bangalore offering end to end wedding planning, decor execution, and makeup services. With verified vendors, transparent pricing, and managed execution, Wedsy helps couples plan stress free weddings across Bangalore and nearby destinations."
    },
    {
      category: "Wedding Planning",
      question: "What wedding planning services does Wedsy offer in Bangalore?",
      answer: "Wedsy offers complete wedding planning services in Bangalore including venue selection, wedding decor, bridal and groom makeup, vendor coordination, and on ground execution for all wedding events."
    },
    {
      category: "Wedding Planning",
      question: "Can I book wedding decor and makeup separately in Bangalore?",
      answer: "Yes. Wedsy allows couples to book wedding decor and makeup services separately in Bangalore without opting for full wedding planning."
    },
    {
      category: "Wedding Planning",
      question: "Does Wedsy handle complete wedding execution in Bangalore?",
      answer: "Yes. From planning to on ground execution, Wedsy takes full responsibility for timelines, vendors, service quality, and coordination across all wedding events in Bangalore."
    },
    {
      category: "Wedding Planning",
      question: "Why should I choose Wedsy as my wedding planner in Bangalore?",
      answer: "Wedsy combines structured planning, verified vendors, transparent pricing, and single point accountability, making it one of the most reliable wedding planners in Bangalore."
    },
    // Decor FAQs
    {
      category: "Wedding Decor",
      question: "Why should I choose Wedsy as my wedding decorators in Bangalore?",
      answer: "When you walk into your wedding venue, the first thing you should feel is: This is exactly how I imagined it. That's what Wedsy brings to life. As one of the most trusted wedding decorators in Bangalore, we don't just decorate spaces — we create moods, moments, and memories that last forever. Whether it's a traditional mandap, a floral entryway, or a contemporary stage design, our wedding decoration packages are curated to match your vision, your culture, and your vibe."
    },
    {
      category: "Wedding Decor",
      question: "Do you provide custom wedding décor?",
      answer: "Yes. No two weddings are alike — and that's exactly how we design our décor. We work closely with couples to understand their preferences, the feel they want for the event, and the emotional details that matter most. Our wedding decoration packages in Bangalore cover: Entrance and walkway decoration, Mandap or ceremony backdrop, Wedding stage decoration, Dining area and guest seating décor, Themed photo booths and installations, Lighting, drapes, floral arrangements, and more."
    },
    {
      category: "Wedding Decor",
      question: "Do you offer wedding stage decoration in Bangalore?",
      answer: "Yes. The stage is where you'll exchange vows, pose for your first pictures, and greet your guests — so it deserves special attention. Wedsy specializes in wedding stage decoration in Bangalore that is both timeless and trend-forward, taking inspiration from: Traditional South Indian temple aesthetics, Royal palace-style backdrops, Floral canopy and ceiling drapes, Contemporary geometric designs with LED elements, Rustic, boho, and nature-inspired setups."
    },
    {
      category: "Wedding Decor",
      question: "What's included in Wedsy's wedding decoration packages?",
      answer: "Every package is different because every couple is different, but you can typically expect: Complete Stage Design – Backdrops, drapes, props, lighting, fresh or artificial flowers. Ceremony Area Décor – Mandap, seating, aisle, and sacred space setups. Entrance & Welcome Areas – Signage, floral arches, traditional décor. Dining Layouts – Table centerpieces, food counters, and thematic arrangements. Lighting & Ambience – Fairy lights, uplighting, lanterns, and warm tones. We also design décor for haldi, mehendi, pre-wedding shoot setups, after-party, and reception themes."
    },
    {
      category: "Wedding Decor",
      question: "How do I book Wedsy for wedding decoration in Bangalore?",
      answer: "Simply reach out to our team with your wedding details. Whether you're looking for wedding decoration packages in Bangalore, professional wedding decorators Bangalore couples trust, or unique wedding stage decoration Bangalore style — Wedsy is here to bring your vision to life, one flower, one light, and one magical moment at a time."
    },
    {
      category: "Wedding Decor",
      question: "What is the Wedsy Wedding Decor Store?",
      answer: "The Wedsy Wedding Decor Store is an online planning platform where couples can explore execution-ready wedding decor items including mandaps, stage setups, entrances, lighting, furniture, florals, and installations with realistic pricing ranges."
    },
    {
      category: "Wedding Decor",
      question: "Why does Wedsy charge a fee to access the decor store?",
      answer: "Unlike free decor catalogues, Wedsy's store is designed for serious wedding planning. The access fee ensures accurate pricing visibility and prevents misuse by vendors or casual price comparison."
    },
    {
      category: "Wedding Decor",
      question: "Is Wedsy a wedding planner or only a decor provider in Bangalore?",
      answer: "Wedsy is a full-service wedding planner in Bangalore and throughout India and also offers decor-only bookings. Couples can choose to book only decor or opt for complete wedding planning services throughout India."
    },
    {
      category: "Wedding Decor",
      question: "Are the decor prices shown applicable for Bangalore weddings?",
      answer: "Yes. The prices shown are planning estimates based on Bangalore venues, logistics, labour, and execution standards. Final pricing may vary depending on venue size, location, and customisation."
    },
    {
      category: "Wedding Decor",
      question: "Why are Wedsy's decor prices different from local wedding decorators?",
      answer: "Many local decorators quote only for materials. Wedsy's pricing includes design planning, skilled labour, transport, setup days, dismantling, and on-ground supervision, which reflects real wedding execution costs in Bangalore."
    },
    {
      category: "Wedding Decor",
      question: "Can I customise wedding decor for my Bangalore venue?",
      answer: "Yes. All decor setups can be customised based on your venue layout, ceiling height, theme, colour palette, and event scale. Venue feasibility is checked before finalisation."
    },
    {
      category: "Wedding Decor",
      question: "Can I book only wedding decor in Bangalore without a planner?",
      answer: "Yes. Wedsy allows decor-only bookings for weddings, receptions, and other events across Bangalore and nearby destinations."
    },
    {
      category: "Wedding Decor",
      question: "Does Wedsy handle venue permissions and execution in Bangalore?",
      answer: "Yes. When Wedsy executes decor, we manage venue coordination, setup timelines, safety considerations, and on-ground execution through our team or verified partners."
    },
    {
      category: "Wedding Decor",
      question: "Is the decor store suitable for destination weddings near Bangalore?",
      answer: "Yes. Wedsy regularly executes weddings at resorts and destination venues around Bangalore. Logistics and pricing are adjusted based on distance and venue requirements."
    },
    {
      category: "Wedding Decor",
      question: "Is the onboarding fee refundable?",
      answer: "No. The onboarding fee covers access to planning-level decor data, pricing insights, and consultation value."
    },
    // Makeup FAQs
    {
      category: "Makeup Services",
      question: "What is Wedsy's Makeup Store?",
      answer: "Wedsy's Makeup Store is a verified booking platform to book bridal and event makeup artists in Bangalore. You can book fixed Wedsy packages, individual makeup artists, or use bidding to customise your makeup requirements, with Wedsy managing the entire process."
    },
    {
      category: "Makeup Services",
      question: "How does booking makeup through Wedsy work?",
      answer: "You can book makeup in three ways: Book a fixed Wedsy makeup package where Wedsy assigns a verified artist. Book a specific makeup artist directly and get confirmation after artist acceptance. Use bidding to chat with multiple makeup artists before booking. Wedsy handles coordination, payments, and execution end to end."
    },
    {
      category: "Makeup Services",
      question: "What are Wedsy Makeup Packages?",
      answer: "Wedsy makeup packages are fixed price, pay and book packages. Once booked, Wedsy assigns a verified makeup artist suited to your event, location, and style requirements."
    },
    {
      category: "Makeup Services",
      question: "Can I book a specific makeup artist directly?",
      answer: "Yes. You can book individual makeup artists listed on Wedsy. If the artist accepts the booking, it is confirmed. If the artist declines, your payment is fully refunded."
    },
    {
      category: "Makeup Services",
      question: "What is makeup bidding on Wedsy?",
      answer: "Makeup bidding allows you to chat with multiple makeup artists, discuss your event details, preferred looks, and pricing, and book only after you are fully satisfied."
    },
    {
      category: "Makeup Services",
      question: "Does Wedsy take responsibility for makeup bookings?",
      answer: "Yes. Wedsy takes complete responsibility for the artist, timelines, service delivery, and issue resolution for all makeup bookings made through the platform."
    },
    {
      category: "Makeup Services",
      question: "Are makeup artists on Wedsy verified?",
      answer: "Yes. All makeup artists are verified, reviewed, and onboarded based on experience, quality standards, and reliability for wedding events."
    },
    {
      category: "Makeup Services",
      question: "Do you have makeup artists specialising in different bridal styles?",
      answer: "Yes. Wedsy has verified makeup artists specialising in multiple bridal and cultural styles including Muslim bridal makeup, South Indian and Karnataka style makeup, Kannadiga and Telugu bridal looks, North Indian bridal makeup, Christian bridal makeup, groom makeup, and guest makeup."
    },
    {
      category: "Makeup Services",
      question: "Can I book bridal and groom makeup in Bangalore through Wedsy?",
      answer: "Yes. You can book bridal makeup, groom makeup, family makeup, and multi event packages across Bangalore and nearby destinations."
    },
    {
      category: "Makeup Services",
      question: "Are prices final once I book?",
      answer: "Yes. Prices are locked for packages and confirmed bookings. For bidding, the final agreed price is locked at the time of booking."
    },
    {
      category: "Makeup Services",
      question: "What happens if something goes wrong on the event day?",
      answer: "Wedsy handles escalation, backup support, and coordination so you are not left managing vendors during critical moments."
    },
  ];

  // Group FAQs by category
  const categories = [...new Set(faqsData.map(faq => faq.category))];

  return (
    <>
      <Head>
        <title>Frequently Asked Questions | Wedsy - Wedding Planners in Bangalore</title>
        <meta
          name="description"
          content="Find answers to all your questions about Wedsy's wedding planning, decor, and makeup services in Bangalore. Learn about our packages, pricing, and how we make your dream wedding come true."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#F9F8F6]">
        {/* Hero Section */}
        <div className="relative w-full py-16 md:py-24 bg-gradient-to-b from-[#3C2415] to-[#523329]">
          <div className="max-w-7xl mx-auto px-6 md:px-40 text-center">
            <h1
              className="text-4xl md:text-6xl text-white mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
            >
              Frequently Asked Questions
            </h1>
            <p
              className="text-lg md:text-xl text-white/80"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
            >
              Everything you need to know about Wedsy
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-7xl mx-auto px-6 md:px-40 py-12 md:py-20">
          {categories.map((category, catIndex) => (
            <div key={catIndex} className="mb-12 md:mb-16">
              {/* Category Title */}
              <h2
                className="text-2xl md:text-3xl text-[#840032] mb-6 md:mb-8 pb-4 border-b-2 border-[#840032]"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
              >
                {category}
              </h2>

              {/* FAQs in this category */}
              <div className="flex flex-col">
                {faqsData
                  .filter(faq => faq.category === category)
                  .map((faq, index) => {
                    const globalIndex = faqsData.findIndex(f => f.question === faq.question);
                    return (
                      <div key={index} className="flex flex-col">
                        <button
                          className="w-full text-left py-4 md:py-6 focus:outline-none flex justify-between items-center"
                          onClick={() => toggleFAQ(globalIndex)}
                        >
                          <p
                            className="text-black text-base md:text-lg font-semibold pr-4"
                            style={{ fontFamily: 'Montserrat', letterSpacing: '0.01em' }}
                          >
                            {faq.question}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 flex-shrink-0 transition-transform duration-300 ${openIndex === globalIndex ? 'rotate-45' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            openIndex === globalIndex ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <p
                            className="text-gray-700 text-sm md:text-base mb-4 md:mb-6"
                            style={{ fontFamily: 'Montserrat', letterSpacing: '0.01em' }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                        <div className="w-full border-b border-dashed border-gray-400"></div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Back to Home Button */}
          <div className="flex justify-center mt-12">
            <Link href="/">
              <button
                className="bg-[#840032] text-white px-10 md:px-16 py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold uppercase tracking-wider hover:bg-[#6a0029] transition-all duration-300 ease-in-out shadow-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

