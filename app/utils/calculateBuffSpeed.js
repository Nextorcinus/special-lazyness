export function calculateBuffSpeed({
  petLevel,
  vipLevel,
  zinmanLevel,
  constructionSpeed,
  doubleTime,
}) {
  const petMap = {
    'Lv.1': 5,
    'Lv.2': 7,
    'Lv.3': 9,
    'Lv.4': 12,
    'Lv.5': 15,
  }

  const vipMap = {
    'VIP 4': 10,
    'VIP 5': 10,
    'VIP 6': 10,
    'VIP 7': 10,
    'VIP 8': 10,
    'VIP 9': 20,
    'VIP 10': 20,
    'VIP 11': 20,
    'VIP 12': 20,
  }

  const zinmanMap = {
    'Lv.1': 3,
    'Lv.2': 6,
    'Lv.3': 9,
    'Lv.4': 12,
    'Lv.5': 15,
  }

  const petBonus = petMap[petLevel] || 0
  const vipBonus = vipMap[vipLevel] || 0
  const zinmanBonus = zinmanMap[zinmanLevel] || 0
  const doubleTimeBonus = doubleTime ? 20 : 0

  return (
    petBonus +
    vipBonus +
    zinmanBonus +
    Number(constructionSpeed) +
    doubleTimeBonus
  )
}
