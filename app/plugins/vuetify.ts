// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            background: '#101a2b',
            surface: '#18263a',
            primary: '#8bd5c5',
            secondary: '#89aee6',
            error: '#e88987',
            warning: '#f0c878',
          },
        },
      },
    },
  })
  app.vueApp.use(vuetify)
})
