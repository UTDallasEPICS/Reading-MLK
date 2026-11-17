import type { PrismaClient, Prisma } from '../../prisma/generated/client'
import { shopCatalog } from '../../shared/shop'

export class ShopError extends Error {
  constructor(public statusCode: number, message: string) { super(message) }
}

// Catalog IDs are public UI keys; database IDs may differ in existing installations.
export function ownedCatalogIds(items: { name: string; type: string }[]) {
  return shopCatalog.filter(item => items.some(owned => owned.name === item.name && owned.type === item.type)).map(item => item.id)
}

export async function changeShopItem(db: PrismaClient, studentId: number, itemId: number, action: 'buy' | 'equip') {
  const item = shopCatalog.find(item => item.id === itemId)
  if (!item) throw new ShopError(404, 'Item not found')
  return db.$transaction(async tx => {
    const current = await tx.student.findUniqueOrThrow({ where: { id: studentId }, include: { unlockedShopItems: true } })
    const owned = item.cost === 0 || ownedCatalogIds(current.unlockedShopItems).includes(item.id)
    if (!owned && action === 'equip') throw new ShopError(403, 'Purchase this item first')
    if (!owned) {
      const charged = await tx.student.updateMany({ where: { id: studentId, exp: { gte: item.cost } }, data: { exp: { decrement: item.cost } } })
      if (charged.count !== 1) throw new ShopError(400, 'Not enough XP')
      const record = await tx.shopItem.findFirst({ where: { type: item.type, name: item.name } })
        ?? await tx.shopItem.create({ data: { type: item.type, name: item.name, cost: item.cost, dateAvailable: new Date(0) } })
      await tx.student.update({ where: { id: studentId }, data: { unlockedShopItems: { connect: { id: record.id } } } })
    }
    const settings = { ...((current.settings as Prisma.JsonObject) || {}) }
    if (item.type === 'theme' && item.class) settings.theme = item.class
    else if (item.type === 'banner') {
      settings.activeBanner = action === 'equip' && settings.activeBanner === item.name ? null : item.name
    } else {
      const key = item.type === 'sticker' ? 'activeStickers' : 'activeAnimations'
      const saved = settings[key]
      const active = Array.isArray(saved) ? saved.filter((name): name is string => typeof name === 'string') : []
      settings[key] = action === 'equip' && active.includes(item.name)
        ? active.filter(name => name !== item.name) : [...new Set([...active, item.name])]
    }
    const updated = await tx.student.update({ where: { id: studentId }, data: { settings }, include: { unlockedShopItems: true } })
    const { unlockedShopItems, ...student } = updated
    return { student, ownedIds: ownedCatalogIds(unlockedShopItems), purchased: !owned }
  })
}
