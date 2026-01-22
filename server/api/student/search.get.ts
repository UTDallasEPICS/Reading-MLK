import { PrismaClient } from '@prisma/client';

const prisma = (globalThis as any).prisma || new PrismaClient();
;(globalThis as any).prisma = prisma;

export default defineEventHandler(async (event) => {
  try {
    // return 401 + empty data instead of throwing
    if (!event.context.user?.id) {
      setResponseStatus(event, 401);
      return { data: [] };
    }

    const q = getQuery(event);
    // accept `filters` (multi-field) or `searchQuery` JSON
    const raw = q.filters ?? q.searchQuery ?? '{}';
    let filters: Record<string, any> = {};
    try {
      filters = JSON.parse(String(raw));
    } catch (e) {
      console.warn('Invalid filters JSON:', e);
      setResponseStatus(event, 400);
      return { data: [] };
    }

    // if legacy single-key search was used (searchQuery + key), preferred if filters empty
    const key = q.key ? String(q.key) : '';

    const conditions: any[] = [];
    // only match fields that actually exist on StudentProfile
    const allowedFields = new Set([
      'id', 'age', 'grade', 'reading_lvl', 'birth_date', 'gender',
      'school_name', 'school_dist', 'pref_lang', 'first_name', 'last_name'
    ]);

    Object.entries(filters).forEach(([k, v]) => {
      if (!allowedFields.has(k)) return;          // ignore unknown fields
      if (v === null || v === undefined) return;
      const s = String(v).trim();
      if (s === '') return;

      // for numeric fields, convert to number and use equals
      if (['age', 'grade', 'reading_lvl', 'id'].includes(k)) {
        const n = Number(s);
        if (!Number.isNaN(n)) conditions.push({ [k]: n });
        return;
      }

      // for date fields, use contains string
      conditions.push({ [k]: { contains: s } });
    });

    // legacy single-key: if nothing in filters but key + searchQuery exist, use that
    if (conditions.length === 0 && key && q.searchQuery) {
      let parsed: any = {};
      try {
        parsed = JSON.parse(String(q.searchQuery));
      } catch (e) {
        parsed = { [key]: String(q.searchQuery) };
      }
      const val = parsed[key];
      if (val !== undefined && String(val).trim() !== '') {
        const s = String(val).trim();
        if (['age', 'grade', 'reading_lvl', 'id'].includes(key)) {
          const n = Number(s);
          if (!Number.isNaN(n)) conditions.push({ [key]: n });
        } else {
          conditions.push({ [key]: { contains: s } });
        }
      }
    }

    if (conditions.length === 0) return { data: [] };

    const where = conditions.length === 1 ? conditions[0] : { AND: conditions };

    // query StudentProfile
    const students = await prisma.studentProfile.findMany({
      where,
      take: 200,
    });

    return { data: students };
  } catch (err) {
    console.error('student search handler error:', err);
    setResponseStatus(event, 500);
    return { data: [] };
  }
});