import React, { useState, useEffect, useRef } from 'react';

const CountryCodeSelector = ({ selectedCode, onSelect, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Comprehensive list of all countries with their codes and flags
  const allCountries = [
    { code: "+1", country: "United States", flag: "🇺🇸" },
    { code: "+1", country: "Canada", flag: "🇨🇦" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+64", country: "New Zealand", flag: "🇳🇿" },
    { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+974", country: "Qatar", flag: "🇶🇦" },
    { code: "+965", country: "Kuwait", flag: "🇰🇼" },
    { code: "+973", country: "Bahrain", flag: "🇧🇭" },
    { code: "+968", country: "Oman", flag: "🇴🇲" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
    { code: "+977", country: "Nepal", flag: "🇳🇵" },
    { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+43", country: "Austria", flag: "🇦🇹" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+47", country: "Norway", flag: "🇳🇴" },
    { code: "+45", country: "Denmark", flag: "🇩🇰" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+353", country: "Ireland", flag: "🇮🇪" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+30", country: "Greece", flag: "🇬🇷" },
    { code: "+48", country: "Poland", flag: "🇵🇱" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", country: "Hungary", flag: "🇭🇺" },
    { code: "+40", country: "Romania", flag: "🇷🇴" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+380", country: "Ukraine", flag: "🇺🇦" },
    { code: "+90", country: "Turkey", flag: "🇹🇷" },
    { code: "+20", country: "Egypt", flag: "🇪🇬" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+254", country: "Kenya", flag: "🇰🇪" },
    { code: "+233", country: "Ghana", flag: "🇬🇭" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+54", country: "Argentina", flag: "🇦🇷" },
    { code: "+56", country: "Chile", flag: "🇨🇱" },
    { code: "+57", country: "Colombia", flag: "🇨🇴" },
    { code: "+51", country: "Peru", flag: "🇵🇪" },
    { code: "+58", country: "Venezuela", flag: "🇻🇪" },
    { code: "+593", country: "Ecuador", flag: "🇪🇨" },
    { code: "+591", country: "Bolivia", flag: "🇧🇴" },
    { code: "+595", country: "Paraguay", flag: "🇵🇾" },
    { code: "+598", country: "Uruguay", flag: "🇺🇾" },
    { code: "+507", country: "Panama", flag: "🇵🇦" },
    { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
    { code: "+502", country: "Guatemala", flag: "🇬🇹" },
    { code: "+503", country: "El Salvador", flag: "🇸🇻" },
    { code: "+504", country: "Honduras", flag: "🇭🇳" },
    { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
    { code: "+509", country: "Haiti", flag: "🇭🇹" },
    { code: "+1", country: "Jamaica", flag: "🇯🇲" },
    { code: "+1", country: "Trinidad and Tobago", flag: "🇹🇹" },
    { code: "+1", country: "Barbados", flag: "🇧🇧" },
    { code: "+1", country: "Bahamas", flag: "🇧🇸" },
    { code: "+1", country: "Dominican Republic", flag: "🇩🇴" },
    { code: "+1", country: "Puerto Rico", flag: "🇵🇷" },
    { code: "+353", country: "Ireland", flag: "🇮🇪" },
    { code: "+44", country: "Jersey", flag: "🇯🇪" },
    { code: "+44", country: "Guernsey", flag: "🇬🇬" },
    { code: "+44", country: "Isle of Man", flag: "🇮🇲" },
    { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
    { code: "+356", country: "Malta", flag: "🇲🇹" },
    { code: "+357", country: "Cyprus", flag: "🇨🇾" },
    { code: "+370", country: "Lithuania", flag: "🇱🇹" },
    { code: "+371", country: "Latvia", flag: "🇱🇻" },
    { code: "+372", country: "Estonia", flag: "🇪🇪" },
    { code: "+421", country: "Slovakia", flag: "🇸🇰" },
    { code: "+386", country: "Slovenia", flag: "🇸🇮" },
    { code: "+385", country: "Croatia", flag: "🇭🇷" },
    { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
    { code: "+382", country: "Montenegro", flag: "🇲🇪" },
    { code: "+383", country: "Kosovo", flag: "🇽🇰" },
    { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
    { code: "+355", country: "Albania", flag: "🇦🇱" },
    { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
    { code: "+381", country: "Serbia", flag: "🇷🇸" },
    { code: "+385", country: "Croatia", flag: "🇭🇷" },
    { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
    { code: "+7", country: "Belarus", flag: "🇧🇾" },
    { code: "+374", country: "Armenia", flag: "🇦🇲" },
    { code: "+995", country: "Georgia", flag: "🇬🇪" },
    { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
    { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
    { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
    { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
    { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
    { code: "+972", country: "Israel", flag: "🇮🇱" },
    { code: "+961", country: "Lebanon", flag: "🇱🇧" },
    { code: "+962", country: "Jordan", flag: "🇯🇴" },
    { code: "+963", country: "Syria", flag: "🇸🇾" },
    { code: "+964", country: "Iraq", flag: "🇮🇶" },
    { code: "+98", country: "Iran", flag: "🇮🇷" },
    { code: "+961", country: "Lebanon", flag: "🇱🇧" },
    { code: "+961", country: "Lebanon", flag: "🇱🇧" },
    { code: "+212", country: "Morocco", flag: "🇲🇦" },
    { code: "+213", country: "Algeria", flag: "🇩🇿" },
    { code: "+216", country: "Tunisia", flag: "🇹🇳" },
    { code: "+218", country: "Libya", flag: "🇱🇾" },
    { code: "+249", country: "Sudan", flag: "🇸🇩" },
    { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
    { code: "+255", country: "Tanzania", flag: "🇹🇿" },
    { code: "+256", country: "Uganda", flag: "🇺🇬" },
    { code: "+250", country: "Rwanda", flag: "🇷🇼" },
    { code: "+257", country: "Burundi", flag: "🇧🇮" },
    { code: "+260", country: "Zambia", flag: "🇿🇲" },
    { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
    { code: "+264", country: "Namibia", flag: "🇳🇦" },
    { code: "+267", country: "Botswana", flag: "🇧🇼" },
    { code: "+268", country: "Eswatini", flag: "🇸🇿" },
    { code: "+269", country: "Comoros", flag: "🇰🇲" },
    { code: "+230", country: "Mauritius", flag: "🇲🇺" },
    { code: "+248", country: "Seychelles", flag: "🇸🇨" },
    { code: "+252", country: "Somalia", flag: "🇸🇴" },
    { code: "+253", country: "Djibouti", flag: "🇩🇯" },
    { code: "+235", country: "Chad", flag: "🇹🇩" },
    { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
    { code: "+237", country: "Cameroon", flag: "🇨🇲" },
    { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
    { code: "+239", country: "São Tomé and Príncipe", flag: "🇸🇹" },
    { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
    { code: "+241", country: "Gabon", flag: "🇬🇦" },
    { code: "+242", country: "Republic of the Congo", flag: "🇨🇬" },
    { code: "+243", country: "Democratic Republic of the Congo", flag: "🇨🇩" },
    { code: "+244", country: "Angola", flag: "🇦🇴" },
    { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
    { code: "+246", country: "British Indian Ocean Territory", flag: "🇮🇴" },
    { code: "+247", country: "Ascension Island", flag: "🇦🇨" },
    { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
    { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
    { code: "+227", country: "Niger", flag: "🇳🇪" },
    { code: "+228", country: "Togo", flag: "🇹🇬" },
    { code: "+229", country: "Benin", flag: "🇧🇯" },
    { code: "+221", country: "Senegal", flag: "🇸🇳" },
    { code: "+222", country: "Mauritania", flag: "🇲🇷" },
    { code: "+223", country: "Mali", flag: "🇲🇱" },
    { code: "+224", country: "Guinea", flag: "🇬🇳" },
    { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
    { code: "+231", country: "Liberia", flag: "🇱🇷" },
    { code: "+220", country: "Gambia", flag: "🇬🇲" },
    { code: "+258", country: "Mozambique", flag: "🇲🇿" },
    { code: "+259", country: "Malawi", flag: "🇲🇼" },
    { code: "+261", country: "Madagascar", flag: "🇲🇬" },
    { code: "+262", country: "Réunion", flag: "🇷🇪" },
    { code: "+265", country: "Malawi", flag: "🇲🇼" },
    { code: "+266", country: "Lesotho", flag: "🇱🇸" },
    { code: "+269", country: "Comoros", flag: "🇰🇲" },
    { code: "+290", country: "Saint Helena", flag: "🇸🇭" },
    { code: "+291", country: "Eritrea", flag: "🇪🇷" },
    { code: "+297", country: "Aruba", flag: "🇦🇼" },
    { code: "+298", country: "Faroe Islands", flag: "🇫🇴" },
    { code: "+299", country: "Greenland", flag: "🇬🇱" },
    { code: "+350", country: "Gibraltar", flag: "🇬🇮" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
    { code: "+354", country: "Iceland", flag: "🇮🇸" },
    { code: "+356", country: "Malta", flag: "🇲🇹" },
    { code: "+357", country: "Cyprus", flag: "🇨🇾" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
    { code: "+370", country: "Lithuania", flag: "🇱🇹" },
    { code: "+371", country: "Latvia", flag: "🇱🇻" },
    { code: "+372", country: "Estonia", flag: "🇪🇪" },
    { code: "+373", country: "Moldova", flag: "🇲🇩" },
    { code: "+374", country: "Armenia", flag: "🇦🇲" },
    { code: "+375", country: "Belarus", flag: "🇧🇾" },
    { code: "+376", country: "Andorra", flag: "🇦🇩" },
    { code: "+377", country: "Monaco", flag: "🇲🇨" },
    { code: "+378", country: "San Marino", flag: "🇸🇲" },
    { code: "+379", country: "Vatican City", flag: "🇻🇦" },
    { code: "+380", country: "Ukraine", flag: "🇺🇦" },
    { code: "+381", country: "Serbia", flag: "🇷🇸" },
    { code: "+382", country: "Montenegro", flag: "🇲🇪" },
    { code: "+383", country: "Kosovo", flag: "🇽🇰" },
    { code: "+385", country: "Croatia", flag: "🇭🇷" },
    { code: "+386", country: "Slovenia", flag: "🇸🇮" },
    { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
    { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
    { code: "+421", country: "Slovakia", flag: "🇸🇰" },
    { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
    { code: "+500", country: "Falkland Islands", flag: "🇫🇰" },
    { code: "+501", country: "Belize", flag: "🇧🇿" },
    { code: "+502", country: "Guatemala", flag: "🇬🇹" },
    { code: "+503", country: "El Salvador", flag: "🇸🇻" },
    { code: "+504", country: "Honduras", flag: "🇭🇳" },
    { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
    { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
    { code: "+507", country: "Panama", flag: "🇵🇦" },
    { code: "+508", country: "Saint Pierre and Miquelon", flag: "🇵🇲" },
    { code: "+509", country: "Haiti", flag: "🇭🇹" },
    { code: "+590", country: "Guadeloupe", flag: "🇬🇵" },
    { code: "+591", country: "Bolivia", flag: "🇧🇴" },
    { code: "+592", country: "Guyana", flag: "🇬🇾" },
    { code: "+593", country: "Ecuador", flag: "🇪🇨" },
    { code: "+594", country: "French Guiana", flag: "🇬🇫" },
    { code: "+595", country: "Paraguay", flag: "🇵🇾" },
    { code: "+596", country: "Martinique", flag: "🇲🇶" },
    { code: "+597", country: "Suriname", flag: "🇸🇷" },
    { code: "+598", country: "Uruguay", flag: "🇺🇾" },
    { code: "+599", country: "Netherlands Antilles", flag: "🇧🇶" },
    { code: "+670", country: "East Timor", flag: "🇹🇱" },
    { code: "+672", country: "Antarctica", flag: "🇦🇶" },
    { code: "+673", country: "Brunei", flag: "🇧🇳" },
    { code: "+674", country: "Nauru", flag: "🇳🇷" },
    { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
    { code: "+676", country: "Tonga", flag: "🇹🇴" },
    { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
    { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
    { code: "+679", country: "Fiji", flag: "🇫🇯" },
    { code: "+680", country: "Palau", flag: "🇵🇼" },
    { code: "+681", country: "Wallis and Futuna", flag: "🇼🇫" },
    { code: "+682", country: "Cook Islands", flag: "🇨🇰" },
    { code: "+683", country: "Niue", flag: "🇳🇺" },
    { code: "+684", country: "American Samoa", flag: "🇦🇸" },
    { code: "+685", country: "Samoa", flag: "🇼🇸" },
    { code: "+686", country: "Kiribati", flag: "🇰🇮" },
    { code: "+687", country: "New Caledonia", flag: "🇳🇨" },
    { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
    { code: "+689", country: "French Polynesia", flag: "🇵🇫" },
    { code: "+850", country: "North Korea", flag: "🇰🇵" },
    { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
    { code: "+853", country: "Macau", flag: "🇲🇴" },
    { code: "+855", country: "Cambodia", flag: "🇰🇭" },
    { code: "+856", country: "Laos", flag: "🇱🇦" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
    { code: "+886", country: "Taiwan", flag: "🇹🇼" },
    { code: "+960", country: "Maldives", flag: "🇲🇻" },
    { code: "+961", country: "Lebanon", flag: "🇱🇧" },
    { code: "+962", country: "Jordan", flag: "🇯🇴" },
    { code: "+963", country: "Syria", flag: "🇸🇾" },
    { code: "+964", country: "Iraq", flag: "🇮🇶" },
    { code: "+965", country: "Kuwait", flag: "🇰🇼" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+967", country: "Yemen", flag: "🇾🇪" },
    { code: "+968", country: "Oman", flag: "🇴🇲" },
    { code: "+970", country: "Palestine", flag: "🇵🇸" },
    { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
    { code: "+972", country: "Israel", flag: "🇮🇱" },
    { code: "+973", country: "Bahrain", flag: "🇧🇭" },
    { code: "+974", country: "Qatar", flag: "🇶🇦" },
    { code: "+975", country: "Bhutan", flag: "🇧🇹" },
    { code: "+976", country: "Mongolia", flag: "🇲🇳" },
    { code: "+977", country: "Nepal", flag: "🇳🇵" },
    { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
    { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
    { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
    { code: "+995", country: "Georgia", flag: "🇬🇪" },
    { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
    { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
  ];

  // Remove duplicates and sort by country name
  const uniqueCountries = allCountries.reduce((acc, current) => {
    const existing = acc.find(item => item.code === current.code && item.country === current.country);
    if (!existing) {
      acc.push(current);
    }
    return acc;
  }, []).sort((a, b) => a.country.localeCompare(b.country));

  // Filter countries based on search query
  const filteredCountries = searchQuery
    ? uniqueCountries.filter(
        (country) =>
          country.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.code.includes(searchQuery)
      )
    : uniqueCountries;

  const selectedCountry = uniqueCountries.find((c) => c.code === selectedCode) || uniqueCountries.find((c) => c.code === "+91");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border-b-2 border-[#523329] py-3 px-2 text-[#523329] cursor-pointer transition-all duration-300 hover:border-[#6B3A1A] flex items-center gap-1 min-w-[80px] md:min-w-[90px]"
        style={{
          fontFamily: "'Spartan', sans-serif",
          fontWeight: 350,
        }}
      >
        <span className="text-base md:text-lg">{selectedCountry?.flag || "🇮🇳"}</span>
        <span className="text-sm md:text-base">{selectedCountry?.code || "+91"}</span>
        <span className="ml-1 text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1 bg-white border border-[#523329] rounded-lg shadow-lg overflow-hidden w-80 md:w-96 max-h-80 flex flex-col">
          {/* Search Input */}
          <div className="p-3 border-b border-[#523329]/20">
            <input
              type="text"
              placeholder="Search country or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-[#523329]/30 rounded-md focus:outline-none focus:border-[#523329] text-sm"
              style={{
                fontFamily: "'Spartan', sans-serif",
                fontWeight: 350,
              }}
              autoFocus
            />
          </div>

          {/* Countries List */}
          <div className="overflow-y-auto max-h-64">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => (
                <div
                  key={`${country.code}-${country.country}-${index}`}
                  onClick={() => {
                    onSelect(country.code);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-3 hover:bg-[#523329]/10 cursor-pointer transition-colors duration-200 text-[#523329] flex items-center gap-3 ${
                    selectedCode === country.code ? 'bg-[#523329]/5' : ''
                  }`}
                  style={{
                    fontFamily: "'Spartan', sans-serif",
                    fontWeight: 350,
                  }}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1 font-medium">{country.country}</span>
                  <span className="text-sm opacity-70">{country.code}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-[#523329] text-sm opacity-70">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelector;

