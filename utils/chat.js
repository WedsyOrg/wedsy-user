const { format, isToday, isYesterday, isThisWeek } = require("date-fns");

/**
 * Format the chat message time
 * @param {Date} date - The date of the last message
 * @returns {string} - Formatted time string
 */
export function formatMessageTime(date) {
  if (!date) return "N/A";

  const messageDate = new Date(date);

  if (isToday(messageDate)) {
    return format(messageDate, "h:mm a"); // Example: 10:41 AM
  }
  if (isYesterday(messageDate)) {
    // return `Yesterday, ${format(messageDate, "h:mm a")}`; // Example: Yesterday, 10:41 AM
    return `Yesterday`;
  }
  if (isThisWeek(messageDate)) {
    // return format(messageDate, "EEEE, h:mm a"); // Example: Thursday, 10:41 AM
    return format(messageDate, "EEEE");
  }

  //   return format(messageDate, "dd/MM/yyyy, h:mm a"); // Example: 19/02/2024, 10:41 AM
  return format(messageDate, "dd/MM/yyyy");
}
