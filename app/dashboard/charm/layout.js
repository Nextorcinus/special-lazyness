"use client";

import { Toaster } from "sonner";
import PageWrapper from "../../components/PageWrapper";
import HistoryList from "../../components/CharmHistoryList";
import { CharmHistoryProvider } from "./CharmHistoryContext";
import { AddAnotherProvider } from "./AddAnotherContext";
import WelcomePopup from "../../components/Popup";

export default function Layout({ children }) {
  return (
    <>
      <PageWrapper>
        <CharmHistoryProvider>
          <AddAnotherProvider>
            <div className="min-h-screen bg-special text-white grid grid-cols-1 lg:grid-cols-[1fr_320px]">
              <main className="flex flex-col w-full min-w-0">
                <div className="p-4">{children}</div>

                <div className="lg:hidden px-6 sm:px-4 md:px-10 mt-4 mb-5">
                  <HistoryList />
                </div>

                <Toaster richColors position="bottom-right" />
              </main>

              <aside className="hidden lg:block p-3">
                <HistoryList />
              </aside>
            </div>
          </AddAnotherProvider>
        </CharmHistoryProvider>
      </PageWrapper>
    </>
  );
}
