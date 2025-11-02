"use client";

import { HistoryProvider } from "./HistoryContext";
import { AddAnotherProvider } from "./AddAnotherContext";

import { Toaster } from "sonner";
import PageWrapper from "../../components/PageWrapper";
import WelcomePopup from "../../components/Popup";

export default function BuildingsLayout({ children }) {
  return (
    <>
      <PageWrapper>
        <HistoryProvider>
          <AddAnotherProvider>
            <div className="min-h-screen bg-special text-white grid grid-cols-1 lg:grid-cols-[1fr_320px]">
              <main className="flex flex-col w-full min-w-0">
                <div className="p-4">{children}</div>



                <Toaster richColors position="bottom-right" />
              </main>

        
              
            </div>
          </AddAnotherProvider>
        </HistoryProvider>
      </PageWrapper>
    </>
  );
}
