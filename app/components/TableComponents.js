'use client'

import React from 'react'

const TableComponent = ({ selections }) => {
  const calculateMaterials = (from, to) => {
    if (!from || !to) return '-'
    return `${Math.abs(to.length - from.length) * 5}x Lunar Amber`
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Upgrade Requirement</h2>
      <table className="table-auto border-collapse border w-full text-left">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 rounded">Gear</th>
            <th className="border border-gray-300 px-4 py-2 rounded">From</th>
            <th className="border border-gray-300 px-4 py-2 rounded">To</th>
            <th className="border border-gray-300 px-4 py-2 rounded">
              Material Needed
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(selections).map((gear) => (
            <tr key={gear}>
              <td className="border border-gray-300 px-4 py-2">{gear}</td>
              <td className="border border-gray-300 px-4 py-2">
                {selections[gear].from}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {selections[gear].to}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {calculateMaterials(selections[gear].from, selections[gear].to)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableComponent
