export const metadata = {
  title: "IRON ISLAND - Mech Squad RPG",
  description: "Top-down/isometric party-based RPG UI prototype"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased text-white">
        {children}
      </body>
    </html>
  );
}

import './globals.css';