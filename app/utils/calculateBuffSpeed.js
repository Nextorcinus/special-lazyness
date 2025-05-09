export function calculateBuffSpeed({
  petLevel = 'Off',
  vpLevel = 'Off',
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

  const vpBuff = {
    Off: 0,
    '10%': 10,
    '20%': 20,
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
    (vpBuff[vipLevel] || 0) +
    (zinmanBuff[zinmanSkill] || 0) +
    (doubleTime ? 20 : 0) +
    parseFloat(constructionSpeed || 0)

  return totalSpeed / 100
}
