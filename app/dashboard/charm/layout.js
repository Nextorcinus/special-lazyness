"use client";

import { Toaster } from "sonner";
import PageWrapper from "../../components/PageWrapper";
import HistoryList from "../../components/CharmHistoryList";
import { CharmHistoryProvider } from "./CharmHistoryContext";
import { AddAnotherProvider } from "./AddAnotherContext";


export default function Layout({ children }) {
  return (
    <>
      <PageWrapper>
        <CharmHistoryProvider>
          <AddAnotherProvider>
            <div className="min-h-screen bg-special text-white grid grid-cols-1 lg:grid-cols-[1fr_320px">
              <main className="flex flex-col items-center w-full">
                <div className="w-full max-w-[1200px] px-4 md:px-6 lg:px-8">
                    <div className="p-4">
                      {children}
                    </div>
                </div>
              
                <Toaster richColors position="bottom-right" />
              </main>
            </div>
          </AddAnotherProvider>
        </CharmHistoryProvider>
      </PageWrapper>
    </>
   )
}
