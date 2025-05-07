export function calculateBuffSpeed({
  petLevel = 'Off',
  vipLevel = 'Off',
  zinmanSkill = 'Off',
  doubleTime = false,
  constructionSpeed = 0,
}) {
  const petBuff = {
    Off: 0,
    'Lv.1': 5,
    'Lv.2': 7,
    'Lv.3': 9,
    'Lv.4': 12,
    'Lv.5': 15,
  }

  const vipBuff = {
    Off: 0,
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

  const zinmanBuff = {
    Off: 0,
    'Lv.1': 3,
    'Lv.2': 6,
    'Lv.3': 9,
    'Lv.4': 12,
    'Lv.5': 15,
  }

  const totalSpeed =
    (petBuff[petLevel] || 0) +
    (vipBuff[vipLevel] || 0) +
    (zinmanBuff[zinmanSkill] || 0) +
    (doubleTime ? 20 : 0) +
    parseFloat(constructionSpeed || 0)

  return totalSpeed / 100
}
