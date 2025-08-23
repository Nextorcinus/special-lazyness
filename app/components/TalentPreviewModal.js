// components/TalentPreviewModal.js
'use client'

export default function TalentPreviewModal({ isOpen, onClose, hero }) {
  if (!isOpen || !hero?.talent?.['upgrade-preview']) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-semibold">
            {hero.name} - Talent Upgrade Preview
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Container untuk image dengan tinggi terbatas */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex justify-center">
            <img
              src={`/icon/${hero.talent['upgrade-preview']}`}
              alt={`${hero.talent.name} Upgrade Preview`}
              className="max-w-full max-h-[70vh] object-contain rounded-lg mx-auto"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '70vh',
              }}
              onError={(e) => {
                console.error('Image failed to load:', e.target.src)
                e.target.src = '/icon/default-talent.png'
              }}
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
