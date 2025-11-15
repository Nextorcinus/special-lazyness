import "./globals.css";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import WelcomePopup from "./components/Popup";
import NeatBackground from "./components/NeatBackground";

export const metadata = {
  title: "Special Lazyness",
  description: "Upgrade Calculator for Chief Gear, Research, and Buildings",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="relative">
        <NeatBackground />

        <WelcomePopup />

        <div className="min-h-screen flex min-w-0">     
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="lg:hidden">
              <MobileSidebar />
            </div>

            <main className="flex-1 w-full bg-special overflow-y-auto min-w-0">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
