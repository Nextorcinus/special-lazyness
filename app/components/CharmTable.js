'use client'

import { cn } from '../lib/utils'

export default function CharmTable({ data }) {
  const grouped = [...data]
  const total = {
    guide: 0,
    design: 0,
    jewel: 0,
    power: 0,
    stat_total: 0,
    svs: 0,
  }

  grouped.forEach((item) => {
    total.guide += item.guide
    total.design += item.design
    total.jewel += item.jewel
    total.power += item.power
    total.stat_total += item.stat_total
    total.svs += item.svs
  })

  return (
    <div className="mt-8 bg-zinc-900 text-white border border-zinc-700 rounded-xl shadow">
      <div className="p-4">
        <h4 className="text-lg font-bold mb-4">Charm Upgrade Results</h4>

        <div className="overflow-auto">
          <table className="w-full text-sm text-left table-auto border-collapse">
            <thead className="text-zinc-400 border-b border-zinc-700">
              <tr>
                <th className="p-2">Class</th>
                <th className="p-2">Type</th>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Guide</th>
                <th className="p-2">Design</th>
                <th className="p-2">Jewel</th>
                <th className="p-2">Power</th>
                <th className="p-2">Stat</th>
                <th className="p-2">SvS</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((item, i) => (
                <tr key={i} className="border-b border-zinc-800">
                  <td className="p-2">{item.class}</td>
                  <td className="p-2">{item.part}</td>
                  <td className="p-2">{item.from}</td>
                  <td className="p-2">{item.to}</td>
                  <td className="p-2">{item.guide}</td>
                  <td className="p-2">{item.design}</td>
                  <td className="p-2">{item.jewel}</td>
                  <td className="p-2">{item.power.toLocaleString()}</td>
                  <td className="p-2">{item.stat_total.toFixed(2)}%</td>
                  <td className="p-2">{item.svs.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="font-bold bg-zinc-800">
                <td className="p-2" colSpan={4}>
                  Total
                </td>
                <td className="p-2 text-lime-400">{total.guide}</td>
                <td className="p-2 text-lime-400">{total.design}</td>
                <td className="p-2 text-lime-400">{total.jewel}</td>
                <td className="p-2 text-lime-400">
                  {total.power.toLocaleString()}
                </td>
                <td className="p-2 text-lime-400">
                  +{total.stat_total.toFixed(2)}%
                </td>
                <td className="p-2 text-lime-400">
                  {total.svs.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
