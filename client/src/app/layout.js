import "./globals.css";

export const metadata = {
  title: "Roamio",
  description:"Roamio is a travel companion that connects adventure-seekers, offering trip discovery, booking, and community features. With detailed itineraries, safety measures, and social connectivity, Roamio empowers users to explore the world with confidence and build meaningful relationships. Join the Roamio community and start planning your next adventure today!"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
