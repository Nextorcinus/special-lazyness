/* =========================================================
   TROOP ASSISTANT CORE LOGIC
   ========================================================= */

/* ---------- LEGION FACTORY ---------- */
export function createLegion(
  maxSize = 100000,
  name = null
) {
  return {
  id: Date.now() + Math.random(),
  name,
  maxSize,

  infantry: 0,
  lancer: 0,
  marksman: 0,

  ratio: {
    infantry: 1,
    lancer: 1,
    marksman: 98,
  },

  isLocked: false,
}
}

/* ---------- BASIC HELPERS ---------- */
export function totalUsed(
  legions,
  type
) {
  return legions.reduce(
    (sum, l) => sum + l[type],
    0
  )
}

export function remainingGlobal(
  totalTroops,
  legions,
  type,
  current = 0
) {
  return (
    totalTroops[type] -
    totalUsed(legions, type) +
    current
  )
}

export function remainingLegionCapacity(
  legion,
  type
) {
  return (
    legion.maxSize -
    (legion.infantry +
      legion.lancer +
      legion.marksman -
      legion[type])
  )
}

export function legionTotal(legion) {
  return (
    legion.infantry +
    legion.lancer +
    legion.marksman
  )
}

/* ---------- SAFE CLAMP FOR MANUAL INPUT ---------- */
export function clampTroopValue({
  legion,
  type,
  value,
  totalTroops,
  legions,
}) {
  const maxByLegion =
    remainingLegionCapacity(
      legion,
      type
    )

  const maxByGlobal =
    remainingGlobal(
      totalTroops,
      legions,
      type,
      legion[type]
    )

  const maxAllowed = Math.min(
    maxByLegion,
    maxByGlobal
  )

  return Math.max(
    0,
    Math.min(value, maxAllowed)
  )
}

/* ---------- APPLY RATIO TO ONE LEGION ---------- */
export function applyRatioToLegion({
  legion,
  ratio,
  totalTroops,
  legions,
  respectGlobalLimit = true,
}) {
  const totalRatio = ratio.reduce(
    (a, b) => a + b,
    0
  )

  // PREVIEW MODE (like woscalc)
  if (!respectGlobalLimit) {
    const unit =
      legion.maxSize /
      totalRatio

    legion.infantry =
      Math.floor(
        ratio[0] * unit
      )

    legion.lancer =
      Math.floor(
        ratio[1] * unit
      )

    legion.marksman =
      Math.floor(
        ratio[2] * unit
      )

    legion.ratio = {
      infantry: ratio[0],
      lancer: ratio[1],
      marksman: ratio[2],
    }

    return
  }

  // APPLY MODE
  const available = {
    infantry: remainingGlobal(
      totalTroops,
      legions,
      'infantry',
      legion.infantry
    ),

    lancer: remainingGlobal(
      totalTroops,
      legions,
      'lancer',
      legion.lancer
    ),

    marksman: remainingGlobal(
      totalTroops,
      legions,
      'marksman',
      legion.marksman
    ),
  }

  const totalAvailable =
    Math.min(
      legion.maxSize,
      available.infantry +
        available.lancer +
        available.marksman
    )

  const unit =
    totalAvailable /
    totalRatio

  let inf = Math.floor(
    ratio[0] * unit
  )

  let lan = Math.floor(
    ratio[1] * unit
  )

  let mar = Math.floor(
    ratio[2] * unit
  )

  inf = Math.min(
    inf,
    available.infantry
  )

  lan = Math.min(
    lan,
    available.lancer
  )

  mar = Math.min(
    mar,
    available.marksman
  )

  legion.infantry = inf
  legion.lancer = lan
  legion.marksman = mar

  legion.ratio = {
    infantry: ratio[0],
    lancer: ratio[1],
    marksman: ratio[2],
  }
}

/* ---------- APPLY GLOBAL RATIO ---------- */
export function distributeAllLegions({
  legions,
  ratio,
  totalTroops,
}) {
  legions.forEach((legion) => {
    applyRatioToLegion({
      legion,
      ratio,
      totalTroops,
      legions,
    })
  })
}

/* ---------- BACKWARD COMPAT ---------- */
export function calculateTroopDistribution(
  troops,
  ratio,
  legionCount
) {
  const legions = Array.from(
    { length: legionCount },
    () => ({
      infantry: 0,
      lancer: 0,
      marksman: 0,
      maxSize:
        Number.MAX_SAFE_INTEGER,
    })
  )

  distributeAllLegions({
    legions,
    ratio,
    totalTroops: troops,
  })

  return legions.map((l) => ({
    infantry: l.infantry,
    lancer: l.lancer,
    marksman: l.marksman,
  }))
}

/* ---------- BEAR TRAP AUTO FORMATION ---------- */
export function autoBearTrapFormation({
  totalTroops,
  rallySize,
  joinerSize,
  joinerCount,
}) {
  const legions = []

  legions.push(
    createLegion(
      rallySize,
      'Rally Starter'
    )
  )

  while (
    legions.length <
    joinerCount + 1
  ) {
    legions.push(
      createLegion(joinerSize)
    )
  }

  return legions
}