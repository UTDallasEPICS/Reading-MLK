import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (process.client) {
    // Import Font Awesome CSS file
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
    document.head.appendChild(link)
  }
})
