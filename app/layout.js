import "./globals.css";
import Header from "./components/header";
import Sidebar from "./components/Sidebar";
import NeatBackground from "./components/NeatBackground";
import FloatingCreatorButton from "./components/FloatingCreatorButton";
import PageWrapper from "./components/PageWrapper";
import PageTransitionWrapper from "./components/PageTransitionWrapper";

export const metadata = {
  title: "Special Lazyness",
  description: "Upgrade Calculator for Chief Gear, Research, and Buildings",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative overflow-x-hidden">

        <NeatBackground />
        <Header />

        <div className="flex min-w-0 pt-16">
          <aside className="hidden lg:block">
            <Sidebar />
          </aside>

          <main className="flex-1 min-w-0 bg-special">
            <PageWrapper>
              <PageTransitionWrapper>
                {children}
              </PageTransitionWrapper>
            </PageWrapper>
          </main>
        </div>

        <FloatingCreatorButton />
      </body>
    </html>
  );
}
