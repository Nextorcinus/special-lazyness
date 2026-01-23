'use client'
import AttackCalculator from '../../components/AttackCalculator'

export default function AttackCalculatorClient() {
  return (
    <div className="min-h-screen bg-special text-white">
      <main className="flex flex-col items-center w-full">
        <div className="w-full md:max-w-[865px] xl:max-w-[1200px] px-4 md:px-6 lg:px-8">
          <AttackCalculator />
        </div>
      </main>
    </div>
  )
}
