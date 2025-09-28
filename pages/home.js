import FAQAccordion from "@/components/accordion/FAQAccordion";
import PlanYourEvent from "@/components/screens/PlanYourEvent";
import { Button } from "flowbite-react";
import Image from "next/image";
import { MdArrowRight, MdArrowRightAlt } from "react-icons/md";

function Home({ categoryList }) {
  return (
    <>
      <div className="hidden md:block relative pt-[52.6%]">
        <Image
          src={"/assets/background/bg-weddings_made_easy-new.png"}
          alt="Weddings Made Easy"
          sizes="100%"
          layout={"fill"}
          objectFit="cover"
          className="rounded-xl"
        />
        <div className="absolute right-12 top-2/3 hidden md:flex flex-col w-1/4 text-center gap-6 justify-center">
          <span className="">YOUR WEDDING VISION, OUR EXPERTISE</span>
          <input
            type="text"
            placeholder="NAME"
            name="name"
            className="text-black text-center bg-transparent border-0 border-b-black outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-black focus:ring-0 placeholder:text-black"
          />
          <input
            type="text"
            placeholder="PHONE NO. (10 Digits Only)"
            name="phone"
            className="text-black text-center bg-transparent border-0 border-b-black outline-0 focus:outline-none focus:border-0 border-b focus:border-b focus:border-b-black focus:ring-0 placeholder:text-black"
          />
          <button
            type="submit"
            className="rounded-lg bg-black disabled:bg-black/50 text-white py-2"
          >
            <>ENTER WITH WEDSY</>
          </button>
        </div>
      </div>
      <img
        className="w-full md:hidden"
        src={"/assets/background/bg-weddings_made_easy-new-mobile.png"}
      />
      <div className="bg-white py-20 text-center text-4xl font-medium hidden md:block">
        <p className="font-semibold mb-6">WHY CHOOSE WEDSY</p>
        <p>
          {`“BECAUSE WE’RE JUST`}{" "}
          <span className="text-rose-900">{`BL**DY`}</span> {`GOOD AT OUR JOB”`}
        </p>
      </div>
      <div className="flex flex-col gap-6 px-6 md:px-24 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
          <p className="text-2xl md:text-3xl">NEW ARRIVALS</p>
          <div className="md:col-span-2">
            <p className="text-sm">
              Whether you&#39;re planning an intimate ceremony or a grand
              celebration, our newly added items will help you create the
              perfect ambiance for your special day.
            </p>
            <div className="font-semibold hidden md:flex flex-row justify-between items-center mt-4">
              {categoryList?.map((item, index) => (
                <>
                  {index !== 0 && (
                    <span className="w-2 h-2 rounded-full bg-black" />
                  )}
                  <span>{item?.name} </span>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
          <div className="bg-gray-500 col-span-2 row-span-2 pt-[100%] w-full hidden md:block" />
          <div className="bg-gray-500 pt-[100%] w-full" />
          <div className="bg-gray-500 pt-[100%] w-full" />
          <div className="bg-gray-500 pt-[100%] w-full" />
          <div className="bg-gray-500 pt-[100%] w-full" />
          <div className="bg-gray-500 pt-[100%] w-full" />
          <div className="bg-gray-500 pt-[100%] w-full" />
        </div>
        <Button color="dark" className="mx-auto px-8">
          Explore our Wedding Store
        </Button>
      </div>

      <div className="py-8 flex flex-row justify-between items-center">
        <div className="hidden md:block h-0 border-b-[4rem] w-1/4 border-b-rose-900 border-r-[4rem] border-r-transparent border-solid" />
        <div className="text-center px-3 flex flex-col gap-3">
          <p className="text-xl font-semibold">
            YOUR ULTIMATE WEDDING PLANNING DESTINATION IS HERE
          </p>
          <p className="font-meidum">
            {"We’ve got you covered with everything you need for your big day!"}
          </p>
        </div>
        <div className="hidden md:block  h-0 border-b-[4rem] w-1/4 border-b-rose-900 border-l-[4rem] border-l-transparent border-solid" />
      </div>
      <div className="hidden md:flex flex-col gap-6 px-24 py-20">
        <img
          src="/assets/images/home-img-makeup.png"
          className="h-24 w-full bg-white"
        />
        <img
          src="/assets/images/home-img-decor.png"
          className="h-24 w-full bg-white"
        />
        <img
          src="/assets/images/home-img-photography.png"
          className="h-24 w-full bg-white"
        />
        <img
          src="/assets/images/home-img-catering.png"
          className="h-24 w-full bg-white"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 md:px-24 py-20">
        <div className="bg-[#EBEAF8] p-6 hidden md:flex flex-col gap-4 justify-evenly">
          <p className="text-5xl font-medium">BID, COMPARE</p>
          <p className="text-2xl font-medium">
            Choose the ideal Makeup artist for the best glam for you gram.
          </p>
          <p>
            With our makeup artist app, customers can bid on services from top
            makeup artists, compare their offers, and choose the best fit for
            their special day or go ahead and choose from among top of the line
            artists{" "}
          </p>
          <Button className="bg-[#818CF8] enabled:hovered:bg-[#818CF8] text-black font-semibold max-w-max mt-6">
            Visit Make Up Artist store &nbsp; <MdArrowRightAlt size={24} />
          </Button>
        </div>
        <div className="flex md:hidden flex-col gap-4">
          <img className="w-full" src="/assets/images/home-img-bidding-2.png" />
          <p className="text-xl text-center font-medium">
            Choose the ideal Makeup artist for the best glam for you gram.
          </p>
          <Button className="bg-[#818CF8] enabled:hovered:bg-[#818CF8] text-black font-semibold mx-auto max-w-max mt-6">
            Visit Make Up Artist store &nbsp; <MdArrowRightAlt size={24} />
          </Button>
        </div>
        <img
          className="hidden md:block h-full w-full bg-gray-500"
          src="assets/images/home-img-bidding.png"
        />
      </div>
      <div className="flex flex-col gap-4 px-6 md:px-24 py-8 md:py-20">
        <div className="relative pt-[65.87%] md:pt-[36.7%]">
          <Image
            src={"/assets/background/bg-home-furniture.png"}
            alt="Weddings Made Easy"
            sizes="100%"
            layout={"fill"}
            objectFit="cover"
            className="rounded-xl hidden md:block"
          />
          <Image
            src={"/assets/background/bg-home-furniture-mobile.png"}
            alt="Weddings Made Easy"
            sizes="100%"
            layout={"fill"}
            objectFit="cover"
            className="rounded-xl md:hidden"
          />
          <div className="absolute bottom-0 h-1/2 md:h-full w-full bg-gradient-to-t from-white  via-white/60 to-transparent" />
          <div className="md:absolute md:bottom-8 w-full flex flex-col md:flex-row gap-8 px-6 justify-between flex-nowrap">
            <p className="hidden md:block font-medium text-xl">
              MAKE YOUR DREAM WEDDING PERFECTLY FURNISHED WITH OUR PREMIUM
              WEDDING FURNITURE
            </p>
            <div className="hidden md:block whitespace-nowrap">
              <Button className="bg-[#5D6F28] enabled:hover:bg-[#5D6F28] mx-auto text-white px-6 font-medium">
                BROWSE NOW
              </Button>
            </div>
          </div>
        </div>
        <p className="font-medium text-xl text-center block md:hidden">
          Furnish your dream wedding perfectly with our premium furniture
        </p>
        <div className="whitespace-nowrap md:hidden">
          <Button className="bg-[#5D6F28] enabled:hover:bg-[#5D6F28] mx-auto text-white px-6 font-medium">
            BROWSE NOW
          </Button>
        </div>
        <div className="font-semibold hidden md:flex flex-row justify-between items-center px-6">
          <span>CHAIRS </span>
          <span className="w-2 h-2 rounded-full bg-black" />
          <span>CHAIR COVER</span>
          <span className="w-2 h-2 rounded-full bg-black" />
          <span>TABLE</span>
          <span className="w-2 h-2 rounded-full bg-black" />
          <span>TABLE COVER</span>
          <span className="w-2 h-2 rounded-full bg-black" />
          <span>CLOTH</span>
          <span>AND MANY MORE...</span>
        </div>
      </div>
      <div className="px-6 md:px-24 py-8 border-y mt-6">
        <p className="text-center poiret-one-regular text-4xl font-medium tracking-wider">
          Discover our customers experiences.
        </p>
        <img
          src="assets/images/home-img-customer.png"
          className="mt-6 hidden md:block w-full"
        />
        <img
          src="assets/images/home-img-customer-mobile.png"
          className="mt-6 md:hidden w-full"
        />
        <Button className="mx-auto hidden md:block px-8 mt-6 " color="dark">
          See what our clients say about us
        </Button>
        <Button
          className="mx-auto md:hidden px-8 mt-6 bg-[#2B3F6C] enable:hover:bg-[#2B3F6C]"
          color="dark"
        >
          See what our clients say about us
        </Button>
      </div>
      <div className="px-6 md:px-24 py-8 border-b mt-6">
        <p className="text-center text-4xl font-medium ">Wedsy’s WORK</p>
        <img
          src="assets/images/home-img-work.png"
          className="mt-6 hidden md:block w-full"
        />
        <img
          src="assets/images/home-img-work-mobile.png"
          className="mt-6 md:hidden w-full"
        />
        <Button
          className="mx-auto px-8 mt-6 bg-rose-900 enable:hover:bg-rose-900"
          color="dark"
        >
          See what our clients say about us
        </Button>
      </div>
      <div className="md:hidden px-6">
        <img
          src="assets/images/home-img-trending-mobile.png"
          className="w-full"
        />{" "}
        <Button
          className="w-full mb-8 md:hidden px-8 mt-6 bg-[#CE8C35] enable:hover:bg-[#CE8C35]"
          color="dark"
        >
          Explore our BLOGS
        </Button>
      </div>
      <div className="hidden md:block px-6 md:px-24 py-8 border-b mt-6">
        <p className="text-left text-4xl font-semibold mb-6">
          What’s <span className="text-[#AD7200]">trending</span> ?
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-300  w-full h-full" />
          <div className="bg-gray-300  w-full h-full" />
          <img
            src="assets/images/home-img-trending.png"
            className="w-full"
          />
        </div>
      </div>
      <div className="px-6 md:px-24 py-8 relative">
        <div className="flex flex-col md:flex-row gap-6 md:w-4/5">
          <span className="text-8xl font-medium leading-[121.9px] tracking-[-0.15em] text-left text-white font-outline-3-black">
            MOST
          </span>
          <span className="text-xl md:text-3xl">
            FREQUENTLY ASKED QUESTIONS BY OUR CUSTOMERS
          </span>
        </div>
        <img
          src="/assets/images/leaf-branch.png"
          className="w-1/4 md:w-auto h-auto absolute top-0 right-6 md:right-24"
        />
        <div className="divide-dashed divide-y-2 divide-black flex flex-col [&>div]:pb-0 [&>div]:mt-0">
          <FAQAccordion
            question={
              "What services do Wedsy's event planners in Bangalore offer?"
            }
            answer={
              "Our team at Wedsy offers comprehensive event planning services in Bangalore, including venue selection, thematic decoration, catering, photography, makeup artists, mehendi artists, DJ, Emcee, and personalized event itineraries. We ensure your celebration in Bangalore is flawless from start to finish."
            }
          />
          <FAQAccordion
            question={
              "How do Wedsy's wedding planners in Bangalore personalize weddings?"
            }
            answer={
              " At Wedsy, we ensure that every wedding reflects the couple's personality. Our wedding planners in Bangalore collaborate closely with you to understand your vision and preferences, crafting a celebration as unique as your love story. From the color of cloth to flowers, flooring type to lighting, every detail is fully customizable. Your designated wedding planner will discuss these details with you and document them in the notes on the event tool for clear communication and reference."
            }
          />
          <FAQAccordion
            question={"What sets Wedsy's event decorators in Bangalore apart?"}
            answer={
              "Wedsy's event decorators stand out for their creativity and versatility. We lead in staying ahead of trends, utilizing innovative design techniques and technology to craft stunning visual experiences tailored to your event's theme and ambiance. Being India's first online store with transparent pricing, you can conveniently select and customize all decor online. We pride ourselves as a one-stop-shop for all your wedding needs."
            }
          />
          <FAQAccordion
            question={
              "What budget range does Wedsy cater to for weddings and events?"
            }
            answer={
              "Being among the top wedding planners in Bangalore, Wedsy caters to a diverse range of budgets. We collaborate closely with our clients to tailor custom packages that align with their financial considerations, ensuring a high-quality execution of their special day. From as low as 10,000 INR to 10 lakhs and beyond, we accommodate a wide spectrum of budgets."
            }
          />
          <FAQAccordion
            question={"Does Wedsy have packages for decorators in Bangalore?"}
            answer={
              "Yes, Wedsy offers a range of packages for wedding decorations that can be tailored to fit your specific needs and budget. Our packages include a variety of décor options curated by the best decorators in Bangalore to make your wedding truly exceptional."
            }
          />
          <FAQAccordion
            question={
              "How do I book Wedsy's services for my upcoming wedding or event?"
            }
            answer={
              "Booking with Wedsy is easy. Reach out to us through our website, phone, or email. Your designated planner, your single point of contact for all wedding needs, will guide you through the entire process. We recommend scheduling a consultation with our team to discuss event details and secure our services well in advance, especially for peak seasons in Bangalore."
            }
          />
          <FAQAccordion
            question={"What is the event tool?"}
            answer={`The event tool is a specially designed organizational tool for your events. Simply create an event, such as "Rahul's wedding," and add multiple event days like haldi, sangeet, and the wedding ceremony. Once set up, easily add your selected decor to the respective event days. This tool ensures your event stays well-organized and hassle-free.`}
          />
        </div>
      </div>
      <div className="hidden md:block">
        <PlanYourEvent />
      </div>
      <div className="pt-8 flex flex-col">
        <p className="md:hidden px-4 font-semibold text-center mb-4">
         {`“ A WEDDING IS NOT JUST A DAY, IT'S A JOURNEY, A STORY, AND A PROMISE OF A LIFETIME “`}
        </p>
        <img
          src="/assets/images/join-as-user-mobile.png"
          className="md:hidden w-full"
        />
        <img
          src="/assets/images/join-as-vendor-mobile.png"
          className="md:hidden w-full"
        />
        <div className="hidden md:grid grid-cols-2">
          <img
            src="/assets/images/join-as-vendor-desktop.png"
            className="w-full"
          />
          <img
            src="/assets/images/join-as-user-desktop.png"
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const categoryListResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/category`
    );
    const categoryListData = await categoryListResponse.json();
    return {
      props: {
        categoryList: categoryListData,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        categoryList: null,
      },
    };
  }
}

export default Home;
