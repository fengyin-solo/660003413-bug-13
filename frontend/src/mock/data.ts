import type { CognateSet, EntryDetail, LanguageFamily, PartialFormNote, PathBreakNote } from '../types'

export const LANGUAGE_FAMILIES: LanguageFamily[] = [
  { id: 'ie', name: '印欧语系', color: '#3b82f6', languages: ['英语','法语','德语','西班牙语','俄语','拉丁语'], era: '公元前4000年' },
  { id: 'st', name: '汉藏语系', color: '#22c55e', languages: ['汉语','藏语','缅甸语'], era: '公元前4000年' },
  { id: 'aa', name: '亚非语系', color: '#f59e0b', languages: ['阿拉伯语','希伯来语'], era: '公元前6000年' },
  { id: 'ural', name: '乌拉尔语系', color: '#8b5cf6', languages: ['芬兰语','匈牙利语'], era: '公元前5000年' },
]

export const COGNATE_SETS: CognateSet[] = [
  { root: '*pṓds', meaning: '脚/足', languages: { '英语': 'foot', '法语': 'pied', '德语': 'Fuß', '西班牙语': 'pie', '俄语': 'ступня', '拉丁语': 'pēs' }, period: 'PIE', family: 'ie' },
  { root: '*mātér', meaning: '母亲', languages: { '英语': 'mother', '法语': 'mère', '德语': 'Mutter', '西班牙语': 'madre', '俄语': 'мать', '拉丁语': 'māter' }, period: 'PIE', family: 'ie' },
  { root: '*pṓtr', meaning: '父亲', languages: { '英语': 'father', '法语': 'père', '德语': 'Vater', '西班牙语': 'padre', '俄语': 'отец', '拉丁语': 'pater' }, period: 'PIE', family: 'ie' },
  { root: '*h₂épo', meaning: '水', languages: { '英语': 'aqua', '法语': 'eau', '德语': 'Au', '西班牙语': 'agua', '俄语': 'вода', '拉丁语': 'aqua' }, period: 'PIE', family: 'ie' },
  { root: '*dʰómos', meaning: '家', languages: { '英语': 'dome', '法语': 'maison', '德语': 'Dom', '西班牙语': 'domo', '俄语': 'дом', '拉丁语': 'domus' }, period: 'PIE', family: 'ie' },
  { root: '*wḗdr̥', meaning: '水/Water', languages: { '英语': 'water', '法语': 'eau', '德语': 'Wasser', '俄语': 'вода', '拉丁语': 'unda' }, period: 'PIE', family: 'ie' },
  { root: '*sol-', meaning: '太阳', languages: { '英语': 'sun', '法语': 'soleil', '德语': 'Sonne', '西班牙语': 'sol', '俄语': 'солнце', '拉丁语': 'sol' }, period: 'PIE', family: 'ie' },
  { root: '*luks-', meaning: '光/亮', languages: { '英语': 'light', '法语': 'lumière', '德语': 'Licht', '西班牙语': 'luz', '俄语': 'луч', '拉丁语': 'lux' }, period: 'PIE', family: 'ie' },
  { root: '*nokʷt-', meaning: '夜晚', languages: { '英语': 'night', '法语': 'nuit', '德语': 'Nacht', '西班牙语': 'noche', '俄语': 'ночь', '拉丁语': 'nox' }, period: 'PIE', family: 'ie' },
  { root: '*okʷ-', meaning: '眼睛', languages: { '英语': 'eye', '法语': 'oeil', '德语': 'Auge', '西班牙语': 'ojo', '俄语': 'oko', '拉丁语': 'oculus' }, period: 'PIE', family: 'ie' },
  { root: '*ed-', meaning: '吃', languages: { '英语': 'eat', '德语': 'essen', '俄语': 'есть', '拉丁语': 'edere' }, period: 'PIE', family: 'ie' },
  { root: '*ǵneh₃-', meaning: '知道', languages: { '英语': 'know', '德语': 'kennen', '西班牙语': 'conocer', '俄语': 'знать', '拉丁语': 'gnoscere' }, period: 'PIE', family: 'ie' },
  { root: '*h₃érō', meaning: '鹰', languages: { '英语': 'eagle', '法语': 'aigle', '德语': 'Adler', '西班牙语': 'águila', '拉丁语': 'aquila' }, period: 'PIE', family: 'ie' },
  { root: '*sker-', meaning: '切割', languages: { '英语': 'shear', '德语': 'scheren', '俄语': 'резать', '拉丁语': 'scindere' }, period: 'PIE', family: 'ie' },
  { root: '*gʷen-', meaning: '女人', languages: { '英语': 'queen', '德语': 'Frau', '俄语': 'жена' }, period: 'PIE', family: 'ie' },
]

export function buildGraph() {
  const nodes: any[] = []
  const links: any[] = []
  COGNATE_SETS.forEach((cs, ci) => {
    const rootId = 'root_' + ci
    nodes.push({ id: rootId, word: cs.root, language: 'Proto-IE', meaning: cs.meaning, family: 'ie', era: '公元前5000年' })
    Object.entries(cs.languages).forEach(([lang, word]) => {
      if (!word || word === '-') return
      const nid = ci + '_' + lang
      nodes.push({ id: nid, word, language: lang, meaning: cs.meaning, family: 'ie', era: '现代' })
      links.push({ source: rootId, target: nid, type: 'derived' })
    })
  })
  return { nodes, links }
}

// ---- 词条详情：缺项原因 / 来源路径断档 / 部分词形收录说明 ----

const MISSING_REASONS: Record<string, string> = {
  '法语': '法语继承形式在早期文献中缺载，暂无可靠词形记录',
  '西班牙语': '西班牙语该词形未见于收录语料，属语种缺项',
  '俄语': '俄语对应词形暂未收录进本数据集',
  '拉丁语': '拉丁语该词形仅存于残篇，未正式收录',
  '德语': '德语对应词形暂未收录进本数据集',
  '英语': '英语对应词形暂未收录进本数据集',
}

const PATH_BREAKS: Record<string, PathBreakNote[]> = {
  '*h₂épo': [
    { from: 'PIE *h₂épo', to: '英语 aqua', reason: 'aqua 为拉丁语借词；日耳曼本源形态 *ahwō 与 PIE 之间的谱系记录缺失，来源路径在此中断' },
  ],
  '*dʰómos': [
    { from: '拉丁语 domus', to: '法语 maison', reason: 'maison 源自拉丁语 mansio（停留），替换了 domus 的继承形式，继承链断档' },
  ],
  '*pṓtr': [
    { from: 'PIE *pṓtr', to: '俄语 отец', reason: 'отец 源自原始斯拉夫语 *otьcь，与 *pṓtr 之间的中间形态未留存，路径断档' },
  ],
  '*gʷen-': [
    { from: 'PIE *gʷen-', to: '德语 Frau', reason: 'Frau 源自 *frōwō（女主人），属语义替换，音系演化链中断' },
  ],
}

const PARTIAL_FORMS: Record<string, PartialFormNote[]> = {
  '*mātér': [{ language: '俄语', recorded: 'мать', note: '仅收录主格单数，变格词形未完整收录' }],
  '*dʰómos': [{ language: '俄语', recorded: 'дом', note: '仅收录主格单数，变格词形未完整收录' }],
  '*wḗdr̥': [{ language: '俄语', recorded: 'вода', note: '仅收录主格单数，变格词形未完整收录' }],
  '*nokʷt-': [{ language: '拉丁语', recorded: 'nox', note: '仅收录主格单数；属格 noctis 等词形未收录' }],
  '*sker-': [{ language: '德语', recorded: 'scheren', note: '仅收录不定式，过去时与过去分词缺载' }],
  '*ed-': [{ language: '德语', recorded: 'essen', note: '仅收录不定式，人称变位缺载' }],
}

export function buildEntryDetail(root: string): EntryDetail | null {
  const cs = COGNATE_SETS.find(c => c.root === root)
  if (!cs) return null
  const family = LANGUAGE_FAMILIES.find(f => f.id === cs.family)
  const expected = family ? family.languages : Object.keys(cs.languages)
  const missingLanguages = expected
    .filter(lang => !cs.languages[lang])
    .map(language => ({ language, reason: MISSING_REASONS[language] ?? '该语种暂无该词形的收录记录' }))
  return {
    root: cs.root,
    meaning: cs.meaning,
    period: cs.period,
    family: cs.family,
    forms: { ...cs.languages },
    missingLanguages,
    pathBreaks: PATH_BREAKS[cs.root] ?? [],
    partialForms: PARTIAL_FORMS[cs.root] ?? [],
    source: '《印欧语词源词典·样例数据集》',
    updatedAt: '2026-09-01',
  }
}

// 模拟异步详情接口：带网络延迟与随机失败，用于验证加载失败可重试
export function fetchEntryDetail(root: string): Promise<EntryDetail> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const detail = buildEntryDetail(root)
      if (!detail) {
        reject(new Error(`未找到词条 ${root} 的详情`))
        return
      }
      if (Math.random() < 0.3) {
        reject(new Error('网络波动，词条详情加载失败，请重试'))
        return
      }
      resolve(detail)
    }, 300 + Math.random() * 400)
  })
}
