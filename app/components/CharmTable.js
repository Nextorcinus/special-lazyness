'use client'

import { useState, useMemo } from 'react'

function formatNumber(num) {
  return num.toLocaleString('en-US')
}

function formatPercent(val) {
  const num = parseFloat(val)
  return isNaN(num) ? '0.00%' : `${num.toFixed(2)}%`
}

export default function CharmTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const values = Object.values(item).join(' ').toLowerCase()
      return values.includes(searchQuery.toLowerCase())
    })
  }, [data, searchQuery])

  const totalPages = Math.ceil(filteredData.length / entriesPerPage)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage
    return filteredData.slice(start, start + entriesPerPage)
  }, [filteredData, currentPage, entriesPerPage])

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const totalRow = filteredData.reduce(
    (acc, item) => ({
      guide: acc.guide + item.guide,
      design: acc.design + item.design,
      power: acc.power + item.power,
      stat_total: acc.stat_total + item.stat_total,
      svs: acc.svs + item.svs,
    }),
    { guide: 0, design: 0, power: 0, stat_total: 0, svs: 0 }
  )

  return (
    <div className="mt-10 text-white bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md">
      <h2 className="text-xl pb-5">Charm Upgrade Results</h2>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm">Entries per page:</label>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(parseInt(e.target.value))
              setCurrentPage(1)
            }}
            className="bg-zinc-800 text-white border border-zinc-600 rounded px-2 py-1"
          >
            {[5, 10, 25, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full md:w-64 px-3 py-1 rounded border border-zinc-600 bg-zinc-800 text-white"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-2 px-2">Class</th>
              <th className="text-left py-2 px-2">Type</th>
              <th className="text-left py-2 px-2">From</th>
              <th className="text-left py-2 px-2">To</th>
              <th className="text-left py-2 px-2">Guide</th>
              <th className="text-left py-2 px-2">Design</th>
              <th className="text-left py-2 px-2">Power</th>
              <th className="text-left py-2 px-2">Stat</th>
              <th className="text-left py-2 px-2">SvS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="border-b border-zinc-800">
                <td className="py-1 px-2">{row.class}</td>
                <td className="py-1 px-2">{row.gear}</td>
                <td className="py-1 px-2">{row.from}</td>
                <td className="py-1 px-2">{row.to}</td>
                <td className="py-1 px-2">{formatNumber(row.guide)}</td>
                <td className="py-1 px-2">{formatNumber(row.design)}</td>
                <td className="py-1 px-2">{formatNumber(row.power)}</td>
                <td className="py-1 px-2">+{formatPercent(row.stat_total)}</td>
                <td className="py-1 px-2">{formatNumber(row.svs)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-zinc-700 text-sm bg-zinc-800 text-lime-400">
              <td className="py-2 px-2" colSpan={4}>
                Total
              </td>
              <td className="py-2 px-2">{formatNumber(totalRow.guide)}</td>
              <td className="py-2 px-2">{formatNumber(totalRow.design)}</td>
              <td className="py-2 px-2">{formatNumber(totalRow.power)}</td>
              <td className="py-2 px-2">
                +{formatPercent(totalRow.stat_total)}
              </td>
              <td className="py-2 px-2">{formatNumber(totalRow.svs)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-zinc-700 rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm text-zinc-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-zinc-700 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
