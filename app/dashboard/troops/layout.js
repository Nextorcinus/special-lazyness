import PageWrapper from '../../components/PageWrapper'
import { HistoryProvider } from './HistoryContext'
import { Toaster } from 'sonner'

export default function Troops({ children }) {
  return (
    <>
      <PageWrapper>
        <HistoryProvider>
          <div className="min-h-screen bg-special text-white">
            <main className="flex flex-col items-center w-full">
              <div className="w-full md:max-w-[865px] xl:max-w-[1200px] px-4 md:px-6 lg:px-8">
                <div className="px-2 py-10">{children}</div>
              </div>
              <Toaster richColors position="bottom-right" />
            </main>
          </div>
        </HistoryProvider>
      </PageWrapper>
    </>
  )
}
