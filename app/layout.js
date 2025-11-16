import "./globals.css";
import Header from "./components/header";
import Sidebar from "./components/Sidebar";
import NeatBackground from "./components/NeatBackground";
import FloatingCreatorButton from "./components/FloatingCreatorButton";

export const metadata = {
  title: "Special Lazyness",
  description: "Upgrade Calculator for Chief Gear, Research, and Buildings",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative overflow-x-hidden">

        {/* Background */}
        <NeatBackground />

        {/* Header */}
        <Header />

        {/* Layout Wrapper */}
        <div className="flex min-w-0 pt-16">

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <Sidebar />
          </aside>

          {/* Main content (NO OVERFLOW) */}
          <main className="flex-1 min-w-0 bg-special">
            {children}
          </main>

        </div>

        {/* Floating button */}
        <FloatingCreatorButton />

      </body>
    </html>
  );
}
