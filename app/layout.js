import "./globals.css";
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import WelcomePopup from "./components/Popup";
import GoldenBackground from "./components/GoldenBackground";
import NeatBackground from "./components/NeatBackground"


export const metadata = {
  title: "Special Lazyness",
  description: "Upgrade Calculator for Chief Gear, Research, and Buildings",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="" >
        <NeatBackground />
        <WelcomePopup />
      
 
       

        <div className="min-h-screen flex flex-col">
          <MobileSidebar />

          <main className="flex-1 w-full bg-special overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
