export function checkValidEmail(email) {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  const isValidEmail = emailRegex.test(email);
  return isValidEmail;
}
