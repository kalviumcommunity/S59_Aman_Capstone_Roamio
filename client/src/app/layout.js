'use client'

import "./globals.css";
import NavBar from "./components/NavBar/NavBar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Provider } from 'react-redux';
import store from '../store.js'

// export const metadata = {
//   title: "Roamio",
//   description:
//     "Roamio is a travel companion that connects adventure-seekers, offering trip discovery, booking, and community features. With detailed itineraries, safety measures, and social connectivity, Roamio empowers users to explore the world with confidence and build meaningful relationships. Join the Roamio community and start planning your next adventure today!",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/roamioLogo.png" sizes="any" />
      <body>
      <Provider store={store}>
        <AppRouterCacheProvider>
          <NavBar />
          {children}
        </AppRouterCacheProvider>
      </Provider>
      </body>
    </html>
  );
}
