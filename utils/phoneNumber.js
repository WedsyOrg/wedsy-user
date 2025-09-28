export function processMobileNumber(inputNumber) {
  // Remove spaces from the input
  let processedNumber = inputNumber.replace(/\s/g, "").replace(/[^0-9+]/g, "");

  // Check if the number starts with a zero
  if (processedNumber.startsWith("0")) {
    // If it does, add the default country code +91
    processedNumber = "+91" + processedNumber.slice(1);
  }
  if (!processedNumber.startsWith("+")) {
    // If it doesn't, add the default country code +91
    processedNumber = "+91" + processedNumber;
  }

  // Check for a valid country code
  const validCountryCode = /^\+\d{1,4}$/.test(processedNumber.slice(0, 5));

  // Check for a valid mobile number format
  const validMobileNumber = /^\+\d{5,}$/.test(processedNumber);

  // If both country code and mobile number format are valid, return the processed number
  if (validCountryCode && validMobileNumber) {
    return processedNumber;
  } else {
    // Handle invalid input as needed (you may show an error message)
    // console.error("Invalid mobile number");
    return ""; // Or handle it differently based on your requirements
  }
}
