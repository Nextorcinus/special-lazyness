import DawnHeroList from '../../components/DawnHeroList'

export default function HeroesPage() {
  return (
    <div>
      <div className="relative w-full md:px-6 md:py-0 py-4 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 mt-10">
          <h2 className="text-2xl text-white px-6">Chief Charm</h2>
        </div>
      </div>
      <DawnHeroList />
    </div>
  )
}
