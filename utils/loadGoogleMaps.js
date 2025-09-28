import { Loader } from "@googlemaps/js-api-loader";

export const loadGoogleMaps = async () => {
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY, // Add your API key in .env.local
    version: "weekly",
    libraries: ["places"], // Load the Places library
  });

  // return loader.load(); // Returns a promise that resolves when the API is loaded
  return loader
    .load()
    .then((google) => {
      console.log("Google Maps loaded successfully");
      return google;
    })
    .catch((error) => {
      console.error("Error loading Google Maps:", error);
    });
};
