import {Loader} from "@googlemaps/js-api-loader";

export const loadGoogleMaps = async () => {
  // Use a simpler implementation to avoid potential issues
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!apiKey) {
    console.error("Google Maps API key is missing");
    alert(
      "Google Maps API key is missing. Please check your environment setup."
    );
    throw new Error("Missing API key");
  }

  // Create and configure the loader
  const loader = new Loader({
    apiKey,
    version: "quarterly",
    libraries: ["places"],
  });

  try {
    // Load the Google Maps script
    return await loader.load();
  } catch (error) {
    console.error("Failed to load Google Maps:", error);
    throw error;
  }
};
