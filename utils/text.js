export function toProperCase(inputString) {
  // Check if the input is a valid string
  if (typeof inputString !== "string" || inputString.length === 0) {
    return inputString;
  }

  // Split the input string into an array of words
  const words = inputString.split(" ");

  // Capitalize the first letter of each word
  const properCaseWords = words.map((word) => {
    // Capitalize the first letter and concatenate the rest of the word
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join the words back into a string
  const properCaseString = properCaseWords.join(" ");

  return properCaseString;
}

export function toPriceString(amount) {
  return amount || amount === 0
    ? amount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "INR",
      })
    : "";
}
