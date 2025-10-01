/**
 * Get the best displayable date string from an event object
 * @param {Object} event - The event object
 * @returns {string} - The date string to display
 */
export const getDisplayableEventDate = (event) => {
  if (!event) return "";

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
    return event.eventDay;
  }

  // Last resort: formatted createdAt date
  if (event.createdAt) {
    return formatDate(event.createdAt);
  }

  return "Date not available";
};
