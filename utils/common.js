// Use of this commonjs file for utility functions across the app and avoid code duplication also helps in keeping the code DRY

/**
 * Utility function to load a script dynamically
 * @param {string} url - URL of the script to load
 * @returns {Promise} - Promise that resolves when the script is loaded
 */
export const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = (error) =>
      reject(new Error(`Failed to load script: ${url}`));

    document.head.appendChild(script);
  });
};

/**
 * Format date to display in readable format
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return the original string if invalid date
    }

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    // Error formatting date
    return dateString; // Return the original string if any error occurs
  }
};

/**
 * Format time from 24h format to 12h format with AM/PM
 * @param {string} timeString - Time string in 24h format (HH:MM)
 * @returns {string} - Formatted time string in 12h format
 */
export const formatTime = (timeString) => {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${period}`;
};

/**
 * Sort events by date in ascending order (FIFO)
 * @param {Array} events - Array of event objects with date property
 * @returns {Array} - Sorted events array
 */
/**
 * Get the event date for sorting purposes.
 * This function tries to find the most appropriate date for an event.
 */
export const getEventDate = (event) => {
  // HIGHEST PRIORITY: Check eventDays[0].date first (this is the actual form date)
  if (
    event.eventDays &&
    event.eventDays.length > 0 &&
    event.eventDays[0].date &&
    event.eventDays[0].date.trim() !== ""
  ) {
    return new Date(event.eventDays[0].date);
  }

  // SECOND PRIORITY: Use explicit eventDate field if available
  if (event.eventDate) {
    return new Date(event.eventDate);
  }

  // Check if date is actually the creation date
  const isDateCreationDate =
    event.date &&
    event.createdAt &&
    new Date(event.date).toDateString() ===
      new Date(event.createdAt).toDateString();

  // THIRD PRIORITY: Use date field only if it's NOT the creation date
  if (event.date && !isDateCreationDate) {
    return new Date(event.date);
  }

  // Fallback to date field regardless of whether it's creation date
  if (event.date) {
    return new Date(event.date);
  }

  // Fallback to createdAt as last resort
  if (event.createdAt) {
    return new Date(event.createdAt);
  }

  // Return an invalid date if nothing is available
  return new Date("Invalid Date");
};

/**
 * Get the best displayable date string from an event object
 * @param {Object} event - The event object
 * @returns {string} - The date string to display
 */
export const getDisplayableEventDate = (event) => {
  if (!event) return "";

  // Return a displayable date from highest priority field available

  // HIGHEST PRIORITY: Check eventDays[0].date first (this is the actual form date)
  if (
    event.eventDays &&
    event.eventDays.length > 0 &&
    event.eventDays[0].date &&
    event.eventDays[0].date.trim() !== ""
  ) {
    const eventDayDate = event.eventDays[0].date;
    return formatDate(eventDayDate);
  }

  // SECOND PRIORITY: Use explicit eventDate field if available
  if (event.eventDate && !isNaN(new Date(event.eventDate).getTime())) {
    return formatDate(event.eventDate);
  }

  // Check if top-level date field is the creation date
  const isDateCreationDate =
    event.createdAt &&
    event.date &&
    new Date(event.date).toDateString() ===
      new Date(event.createdAt).toDateString();

  // THIRD PRIORITY: Use date field only if it's NOT the creation date
  if (
    !isDateCreationDate &&
    event.date &&
    !isNaN(new Date(event.date).getTime())
  ) {
    return formatDate(event.date);
  }

  // Try to construct date from eventDay if available
  if (event.eventDay) {
    console.log(
      `✅ Using eventDay string for ${event.name}: ${event.eventDay}`
    );
    return event.eventDay;
  }

  // Last resort: formatted createdAt date
  if (event.createdAt) {
    return formatDate(event.createdAt);
  }

  return "Date not available";
};
export const sortEventsByDate = (events) => {
  if (!events || !Array.isArray(events)) return [];

  // First, modify each event to ensure it has the correct date field
  const eventsWithProperDate = events.map((event) => {
    // Create a new object to avoid mutating the original
    const newEvent = {...event};

    // Check if date field is actually a creation date (comparing with createdAt)
    if (
      event.createdAt &&
      event.date &&
      new Date(event.date).toDateString() ===
        new Date(event.createdAt).toDateString()
    ) {
      // If we have event date in the correct field, use it
      if (event.eventDate) {
        newEvent.actualEventDate = new Date(event.eventDate);
      } else {
        // Try to construct from date + time fields
        newEvent.actualEventDate = new Date(event.date);
      }
    } else if (event.date) {
      // Use the date field if it doesn't match createdAt
      newEvent.actualEventDate = new Date(event.date);
    } else if (event.eventDate) {
      // Fallback to eventDate field if available
      newEvent.actualEventDate = new Date(event.eventDate);
    } else {
      // Last resort: use creation date
      newEvent.actualEventDate = new Date(event.createdAt || 0);
    }

    return newEvent;
  });

  // Sort by the actualEventDate field we created
  return eventsWithProperDate.sort((a, b) => {
    // If dates are invalid, sort by name as fallback
    if (
      isNaN(a.actualEventDate.getTime()) &&
      isNaN(b.actualEventDate.getTime())
    ) {
      return a.name.localeCompare(b.name);
    } else if (isNaN(a.actualEventDate.getTime())) {
      return 1; // Invalid dateA goes last
    } else if (isNaN(b.actualEventDate.getTime())) {
      return -1; // Invalid dateB goes last
    }

    // If dates are the same, sort by time if available
    if (
      a.actualEventDate.getTime() === b.actualEventDate.getTime() &&
      a.time &&
      b.time
    ) {
      return a.time.localeCompare(b.time);
    }

    return a.actualEventDate - b.actualEventDate; // Ascending order (earliest date first)
  });
};
