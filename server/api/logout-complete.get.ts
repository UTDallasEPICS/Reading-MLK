export default defineEventHandler(async event => {
  setCookie(event, "rhtoken", "")
  setCookie(event, "rhuser", "")
  await sendRedirect(event, "/Search/?search=")
})