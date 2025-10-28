import "./globals.css";
import React from "react";
import TopMenu from "@/components/TopMenu";

export const metadata = {
  title: "IRON ISLAND - Mech Squad RPG",
  description: "Top-down/isometric party-based RPG UI prototype"
};

export default function RootLayout({ children }) {
  // Check the search params in a client-safe way by deferring to hydration
  // We’ll default to showing the menu; the home view (landing banner) hides it.
  const [isHome, setIsHome] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsHome(params.get("view") === "home");
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen antialiased text-white bg-[#0b0f14]" data-view={isHome ? "home" : "app"}>
        {!isHome && <TopMenu />}
        {children}
      </body>
    </html>
  );
}
