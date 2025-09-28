import { Dropdown, Select, Checkbox, Label } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaSearch, FaStar } from "react-icons/fa";
import MobileStickyFooter from "@/components/layout/MobileStickyFooter";
import { toPriceString } from "@/utils/text";

function MakeupAndBeauty({ userLoggedIn, setOpenLoginModalv2, setSource }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [vendors, setVendors] = useState([]);
  const [taxationData, setTaxationData] = useState({});
  const [loading, setLoading] = useState(false);
  
  const [selectedFilters, setSelectedFilters] = useState({
    Locality: [],
    Rated: [],
    Speciality: [],
    'Services offered': [],
    'Groom makeup services': [],
    Gender: [],
  });

  const customTheme = {
    field: {
      select: {
        base: "w-full",
        colors: {
          light: "bg-white border-0 text-gray-900 focus:ring-0 focus:border-transparent rounded-full shadow-sm"
        }
      }
    }
  };

  const fetchTaxationData = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=MUA-Taxation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setTaxationData(response.data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const fetchVendors = () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    
    // Add required parameter
    queryParams.append('applyFilters', 'true');
    
    // Add pagination parameters
    queryParams.append('page', '1');
    queryParams.append('limit', '10');
    
    // Add search parameter if exists
    if (search) {
      queryParams.append('search', search);
    }
    
    // Map filter values to API parameters
    if (selectedFilters.Locality.length > 0) {
      queryParams.append('locality', selectedFilters.Locality.join(','));
    }
    
    if (selectedFilters.Rated.length > 0) {
      // Convert rating filter to API format
      const ratingValues = selectedFilters.Rated.map(rating => {
        if (rating === 'Rated < 4') return '<4';
        if (rating === 'Rated 4+') return '4+';
        if (rating === 'Rated 4.5+') return '4.5+';
        if (rating === 'Rated 4.8+') return '4.8+';
        return rating;
      }).filter(rating => rating !== 'All ratings');
      
      if (ratingValues.length > 0) {
        queryParams.append('rating', ratingValues.join(','));
      }
    }
    
    if (selectedFilters.Speciality.length > 0) {
      queryParams.append('speciality', selectedFilters.Speciality.join(','));
    }
    
    if (selectedFilters['Services offered'].length > 0) {
      // Map services to API format
      const servicesValues = selectedFilters['Services offered'].map(service => {
        if (service === 'Makeup Only') return 'MUA';
        if (service === 'Hairstyling Only') return 'Hairstylist';
        if (service === 'Both Makeup & Hairstyle') return 'MUA,Hairstylist';
        return service;
      });
      queryParams.append('servicesOffered', servicesValues.join(','));
    }
    
    if (selectedFilters['Groom makeup services'].length > 0) {
      // Map groom makeup to API format
      const groomValues = selectedFilters['Groom makeup services'].map(groom => {
        if (groom === 'Yes') return 'Yes';
        if (groom === 'No') return 'No';
        return groom;
      });
      queryParams.append('groomMakeup', groomValues.join(','));
    }
    
    if (selectedFilters.Gender.length > 0) {
      queryParams.append('gender', selectedFilters.Gender.join(','));
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/vendor?${queryParams.toString()}`;
    console.log('🔍 API URL:', apiUrl);
    console.log('🔍 API Query Params:', queryParams.toString());

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log('🔍 Response Status:', response.status);
        console.log('🔍 Response Headers:', response.headers);
        return response.json();
      })
      .then((response) => {
        console.log('🔍 Full API Response:', response);
        console.log('🔍 Response Type:', typeof response);
        console.log('🔍 Response Keys:', Object.keys(response));
        
        // Handle different response structures
        let vendorsData = [];
        
        if (Array.isArray(response)) {
          // Direct array response
          vendorsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Response with data property
          vendorsData = response.data;
        } else if (response && response.vendors && Array.isArray(response.vendors)) {
          // Response with vendors property
          vendorsData = response.vendors;
        } else if (response && response.results && Array.isArray(response.results)) {
          // Response with results property
          vendorsData = response.results;
        } else if (response && response.items && Array.isArray(response.items)) {
          // Response with items property
          vendorsData = response.items;
        } else if (response && response.list && Array.isArray(response.list)) {
          // Response with list property
          vendorsData = response.list;
        } else {
          console.warn('⚠️ Unexpected response structure:', response);
          vendorsData = [];
        }
        
        console.log('🔍 Extracted Vendors Data:', vendorsData);
        console.log('🔍 Vendors Count:', vendorsData.length);
        
        setVendors(vendorsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Fetch Error:", error);
        setLoading(false);
        // Fallback to empty array
        setVendors([]);
      });
  };
  
  useEffect(() => {
    fetchVendors();
  }, [selectedFilters]);

  // Add fallback data for testing if API fails
  useEffect(() => {
    // If no vendors after 3 seconds, show sample data for testing
    const timer = setTimeout(() => {
      if (vendors.length === 0 && !loading) {
        console.log('🔄 Showing fallback data for testing...');
        setVendors([
          {
            _id: 'sample-1',
            name: 'Sample Makeup Artist',
            gallery: { coverPhoto: '/assets/images/makeup-artists-1.png' },
            speciality: 'North Indian',
            prices: { bridal: 15000 }
          },
          {
            _id: 'sample-2', 
            name: 'Test Beauty Studio',
            gallery: { coverPhoto: '/assets/images/makeup-artists-1.png' },
            speciality: 'South Indian',
            prices: { bridal: 12000 }
          }
        ]);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [vendors.length, loading]);

  useEffect(() => {
    fetchTaxationData();
  }, []);

  // Test API connectivity
  useEffect(() => {
    console.log('🔍 Testing API connectivity...');
    console.log('🔍 API URL:', process.env.NEXT_PUBLIC_API_URL);
    
    // Simple test to see if API is reachable
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/config?code=MUA-Taxation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log('✅ API Test Response Status:', response.status);
        return response.json();
      })
      .then((data) => {
        console.log('✅ API Test Response:', data);
      })
      .catch((error) => {
        console.error('❌ API Test Failed:', error);
    });
  }, []);

  const filterOptions = [
    { name: 'Locality', options: ['North Bangalore', 'South Bangalore', 'East Bangalore', 'West Bangalore', 'Central Bangalore'] },
    { name: 'Rated', options: ['All ratings', 'Rated < 4', 'Rated 4+','Rated 4.5+','Rated 4.8+'] },
    { name: 'Speciality', options: ['North Indian', 'South Indian', 'Muslim', 'Christian','Bengali','Marathi'] },
    { name: 'Services offered', options: ['Makeup Only', 'Hairstyling Only', 'Both Makeup & Hairstyle'] },
    { name: 'Groom makeup services', options: ['Yes', 'No'] },
    { name: 'Gender', options: ['Female', 'Male', 'Others'] },
  ];
  
  const handleFilterChange = (filterName, option) => {
    setSelectedFilters(prevFilters => {
      const currentValues = prevFilters[filterName] || [];
      let newValues;
      
      if (filterName === 'Rated' && option === 'All ratings') {
        // If "All ratings" is selected, clear other rating selections
        newValues = ['All ratings'];
      } else if (option === 'All ratings') {
        // If "All ratings" is selected, clear other options
        newValues = ['All ratings'];
      } else {
        // Remove "All ratings" if other option is selected
        newValues = currentValues.includes(option)
          ? currentValues.filter(item => item !== option && item !== 'All ratings')
          : [...currentValues.filter(item => item !== 'All ratings'), option];
      }
      
      return { ...prevFilters, [filterName]: newValues };
    });
  };

  const resetFilters = () => {
    setSelectedFilters({
      Locality: [],
      Rated: [],
      Speciality: [],
      'Services offered': [],
      'Groom makeup services': [],
      Gender: [],
    });
    setSearch("");
  };

  const getSelectedFiltersCount = () => {
    return Object.values(selectedFilters).reduce((count, values) => {
      return count + values.filter(v => v !== 'All ratings').length;
    }, 0) + (search ? 1 : 0);
  };

  // Add useEffect to trigger API call when search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVendors();
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <>
      <div className="md:hidden">
      <MobileStickyFooter />
      </div>

      <div className="w-full relative hidden md:block pt-[16.2%]">
        <img
          className="absolute top-0 left-0 w-full object-cover"
          src="/assets/images/makeup-artists-1.png"
          alt="Makeup artists banner"
        />
        <div className="absolute top-0 left-0 w-1/2 px-4 lg:px-8 py-2 lg:py-4 h-full flex flex-col justify-around">
          <p className="uppercase text-[#802338] text-xl lg:text-2xl xl:text-3xl">
            <span className="font-semibold">
              <span className="text-2xl lg:text-3xl">B</span>id
            </span>
            , <span className="font-semibold ">book</span>, and{" "}
            <span className="font-semibold">beautify</span> with unbeatable
            makeup artist prices
          </p>
          <button
            className="rounded-lg bg-black md:bg-[#840032] text-white py-1 px-6 lg:py-2 lg:px-12 max-w-max text-sm lg:text-base"
            onClick={() => {
              router.push("/makeup-and-beauty/bidding");
            }}
          >
            Bid Now
          </button>
        </div>
      </div>

      {/* Filters Toolbar - UPDATED FOR SCROLLING */}
      <div className="hidden md:block bg-white p-2 shadow-lg relative z-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <button className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 pr-2 sm:pr-4 flex-shrink-0">
            <img 
              src="/assets/new_icons/filter.svg" 
              alt="filter icon" 
              className="h-4 w-4 sm:h-5 sm:w-5" 
            />
            <span className="font-semibold text-xs sm:text-sm">Filters</span>
            {getSelectedFiltersCount() > 0 && (
              <span className="bg-[#840032] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {getSelectedFiltersCount()}
                        </span>
            )}
          </button>
          
          {getSelectedFiltersCount() > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-[#840032] px-2 py-1"
            >
              Clear all
            </button>
          )}
          
          <div className="h-6 sm:h-8 border-l border-gray-300"></div>

          {/* This container is now horizontally scrollable */}
          <div className="flex-grow flex items-center justify-between gap-x-8 px-3 overflow-x-auto scrollbar-hide">
          
            {filterOptions.map(filter => (
              <Dropdown
                key={filter.name}
                inline
                label={
                  <>
                    <span className="font-medium text-gray-700 hover:text-rose-900 text-xs sm:text-sm whitespace-nowrap">
                      {filter.name}
                    </span>
                    {selectedFilters[filter.name]?.length > 0 && selectedFilters[filter.name][0] !== 'All ratings' && (
                      <span className="ml-1 bg-[#840032] text-white text-xs rounded-full px-2 py-1 min-w-[16px] text-center">
                        {selectedFilters[filter.name].filter(v => v !== 'All ratings').length}
                      </span>
                    )}
                  </>
                }
                arrowIcon={true}
                placement="bottom"
                className="min-w-[180px]"
                dismissOnClick={false}
              >
                <div className="max-h-[60vh] overflow-y-auto p-1">
                  {filter.options.map(option => (
                    <Dropdown.Item 
                      key={option}
                      className="px-3 py-2 text-sm hover:bg-gray-100 rounded-md whitespace-normal"
                      as="div"
                    >
                      <Label htmlFor={`${filter.name}-${option}`} className="flex items-center gap-2 w-full cursor-pointer" onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          id={`${filter.name}-${option}`}
                          checked={selectedFilters[filter.name]?.includes(option)}
                          onChange={() => handleFilterChange(filter.name, option)}
                        />
                        {option}
                      </Label>
                    </Dropdown.Item>
                  ))}
                </div>
              </Dropdown>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#f4f4f4] py-6 md:pt-16 grid grid-cols-1 md:grid-cols-3 gap-4 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="hidden md:block">
          <p className="text-[#840032] font-semibold text-2xl lg:text-3xl font-medium">
            MAKEUP ARTISTS
          </p>
          <p className="font-medium text-base lg:text-lg">In Bangalore</p>
        </div>
        <div className="flex flex-col items-end gap-3 col-span-2 md:col-span-1">
          <div className="relative w-full">
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-gray-500"
              aria-label="Search"
            >
              <FaSearch size={14} className="sm:size-4" />
            </button>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for makeup artist..."
              className="w-full py-2 px-4 text-gray-700 rounded-full border-0 focus:ring-2 focus:ring-[#880E4F] focus:outline-none pl-10 sm:pl-12 shadow-md text-sm sm:text-base"
            />
          </div>
          </div>
        <div className="hidden md:block">
          <Select theme={customTheme} color={"light"} className="w-32 lg:w-40 ml-auto shadow-md text-sm lg:text-base">
            <option>Sort</option>
          </Select>
        </div>
      </div>

      <div className="bg-[#f4f4f4] pb-6 md:pb-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 px-4 sm:px-6 md:px-12 lg:px-24">
        {vendors && vendors.length > 0 ? (
          vendors
            ?.filter((i) => search ? i.name.toLowerCase().includes(search.toLowerCase()) : true)
            .slice(page * 12, (page + 1) * 12)
          ?.map((item, index) => (
            <div
                className="bg-white p-2 sm:p-3 md:p-4 rounded-lg flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-4 cursor-pointer shadow-md"
              key={index}
                onClick={() => {
                  router.push(`/makeup-and-beauty/artists/${item?._id}`);
                }}
            >
              <div className="bg-gray-500 pt-[100%] w-full relative">
                <img
                    src={item?.gallery?.coverPhoto || '/assets/images/makeup-artists-1.png'}
                  className="absolute top-0 w-full h-full object-cover rounded-xl"
                  alt={item?.name}
                />
              </div>
              <div className="flex flex-col gap-1">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 line-clamp-1">
                  {item?.name}
                </h3>
                  <div className="hidden md:flex flex-row items-end gap-1 lg:gap-2 justify-between">
                <div className="flex items-center gap-1 text-[#880E4F]">
                      <FaStar size={12} className="lg:size-4" />
                      <span className="text-xs lg:text-sm font-medium">{item?.rating != null ? item.rating : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs lg:text-sm">
                      <FaMapMarkerAlt size={12} className="lg:size-4" />
                      <span className="line-clamp-1">{[item?.businessAddress?.locality, item?.businessAddress?.city].filter(Boolean).join(', ') || '—'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs">Specialist in</p>
                    <p className="text-xs line-clamp-1">- {item?.speciality}</p>
                  </div>
                  <div className="flex flex-col md:flex-row justify-end md:gap-1 items-end">
                    <div className="text-[#880E4F] font-bold text-base md:text-lg">
                      {toPriceString(item?.prices?.bridal || 0)}
                    </div>
                    <div className="text-xs text-gray-400">Onwards</div>
                </div>
                </div>
              </div>
            ))
        ) : (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-gray-500 text-lg">No makeup artists found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
            </div>
          </div>
        )}

        {page < Math.ceil((vendors?.length || 0) / 12) && vendors && vendors.length > 0 && (
          <div className="col-span-2 flex md:hidden flex-row gap-3 items-center justify-center my-4">
          <button
              className="bg-white rounded-full px-4 py-1 text-sm"
              onClick={() => setPage(page + 1)}
            >
              Next Page &#8594;
          </button>
        </div>
        )}

        {vendors && vendors.length > 0 && (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-row gap-2 lg:gap-3 items-center justify-center">
            {new Array(Math.ceil(vendors.length / 12))
              .fill("-")
              ?.map((_, index) => (
                <div
                  key={index}
                  className={`flex justify-center items-center h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 cursor-pointer rounded-full font-medium text-sm sm:text-base ${
                    index !== page
                      ? "text-[#840032] bg-white"
                      : "bg-[#840032] text-white"
                  }`}
                  onClick={() => setPage(index)}
                >
                  {index + 1}
      </div>
              ))}
        </div>
        )}
      </div>

      {/* Add bottom spacing to prevent footer overlap */}
      <div className="h-8 md:h-12"></div>
    </>
  );
}

export default MakeupAndBeauty;
