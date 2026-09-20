import type { EntryDetail, SourcePathStage } from '../types'
import { COGNATE_SETS, LANGUAGE_FAMILIES } from './data'

/** 语种缺项原因（按词条轮换，保证同一词条每次说明一致） */
const MISSING_REASONS = [
  '该语种语料暂未收录，词形待补',
  '该语支无可靠同源词形存世',
  '文献记载残缺，对应词形尚待考证',
]

/** 各词条的来源路径（演化链） */
const SOURCE_PATHS: Record<string, SourcePathStage[]> = {
  '*pṓds': [
    { stage: '原始印欧语', form: '*pṓds', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*fōts', era: '约公元前500年' },
    { stage: '古英语', form: 'fōt', era: '约公元700年' },
    { stage: '中古英语', form: 'fot', era: '约公元1200年' },
    { stage: '现代英语', form: 'foot', era: '现代' },
  ],
  '*mātér': [
    { stage: '原始印欧语', form: '*mātér', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*mōdēr', era: '约公元前500年' },
    { stage: '古英语', form: 'mōdor', era: '约公元700年' },
    { stage: '中古英语', form: 'moder', era: '约公元1200年' },
    { stage: '现代英语', form: 'mother', era: '现代' },
  ],
  '*pṓtr': [
    { stage: '原始印欧语', form: '*pṓtr', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*fadēr', era: '约公元前500年' },
    { stage: '古英语', form: 'fæder', era: '约公元700年' },
    { stage: '中古英语', form: 'fader', era: '约公元1200年' },
    { stage: '现代英语', form: 'father', era: '现代' },
  ],
  '*h₂épo': [
    { stage: '原始印欧语', form: '*h₂épo', era: '约公元前4000年' },
    { stage: '原始意大利语', form: '*akʷā', era: '约公元前1000年' },
    { stage: '拉丁语', form: 'aqua', era: '约公元前100年' },
    { stage: '古法语', form: 'ewe', era: '约公元900年' },
    { stage: '现代法语', form: 'eau', era: '现代' },
  ],
  '*dʰómos': [
    { stage: '原始印欧语', form: '*dʰómos', era: '约公元前4000年' },
    { stage: '原始意大利语', form: '*domos', era: '约公元前1000年' },
    { stage: '拉丁语', form: 'domus', era: '约公元前100年' },
    { stage: '中世纪拉丁语', form: 'domus', era: '约公元800年' },
    { stage: '西班牙语', form: 'domo', era: '现代' },
  ],
  '*wḗdr̥': [
    { stage: '原始印欧语', form: '*wḗdr̥', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*watōr', era: '约公元前500年' },
    { stage: '古英语', form: 'wæter', era: '约公元700年' },
    { stage: '中古英语', form: 'water', era: '约公元1200年' },
    { stage: '现代英语', form: 'water', era: '现代' },
  ],
  '*sol-': [
    { stage: '原始印欧语', form: '*sol-', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*sunnōn', era: '约公元前500年' },
    { stage: '古英语', form: 'sunne', era: '约公元700年' },
    { stage: '中古英语', form: 'sunne', era: '约公元1200年' },
    { stage: '现代英语', form: 'sun', era: '现代' },
  ],
  '*luks-': [
    { stage: '原始印欧语', form: '*luks-', era: '约公元前4000年' },
    { stage: '原始意大利语', form: '*louks', era: '约公元前1000年' },
    { stage: '拉丁语', form: 'lux', era: '约公元前100年' },
    { stage: '古法语', form: 'lumire', era: '约公元900年' },
    { stage: '现代法语', form: 'lumière', era: '现代' },
  ],
  '*nokʷt-': [
    { stage: '原始印欧语', form: '*nokʷt-', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*nahts', era: '约公元前500年' },
    { stage: '古英语', form: 'niht', era: '约公元700年' },
    { stage: '中古英语', form: 'night', era: '约公元1200年' },
    { stage: '现代英语', form: 'night', era: '现代' },
  ],
  '*okʷ-': [
    { stage: '原始印欧语', form: '*okʷ-', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*augō', era: '约公元前500年' },
    { stage: '古英语', form: 'ēage', era: '约公元700年' },
    { stage: '中古英语', form: 'yȝe', era: '约公元1200年' },
    { stage: '现代英语', form: 'eye', era: '现代' },
  ],
  '*ed-': [
    { stage: '原始印欧语', form: '*ed-', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*etaną', era: '约公元前500年' },
    { stage: '古英语', form: 'etan', era: '约公元700年' },
    { stage: '中古英语', form: 'eten', era: '约公元1200年' },
    { stage: '现代英语', form: 'eat', era: '现代' },
  ],
  '*ǵneh₃-': [
    { stage: '原始印欧语', form: '*ǵneh₃-', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*knēaną', era: '约公元前500年' },
    { stage: '古英语', form: 'cnāwan', era: '约公元700年' },
    { stage: '中古英语', form: 'knowen', era: '约公元1200年' },
    { stage: '现代英语', form: 'know', era: '现代' },
  ],
  '*h₃érō': [
    { stage: '原始印欧语', form: '*h₃érō', era: '约公元前4000年' },
    { stage: '原始意大利语', form: '*akʷilā', era: '约公元前1000年' },
    { stage: '拉丁语', form: 'aquila', era: '约公元前100年' },
    { stage: '古法语', form: 'aigle', era: '约公元900年' },
    { stage: '现代英语', form: 'eagle', era: '现代（借自法语）' },
  ],
  '*sker-': [
    { stage: '原始印欧语', form: '*sker-', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*skeraną', era: '约公元前500年' },
    { stage: '古英语', form: 'scieran', era: '约公元700年' },
    { stage: '中古英语', form: 'sheren', era: '约公元1200年' },
    { stage: '现代英语', form: 'shear', era: '现代' },
  ],
  '*gʷen-': [
    { stage: '原始印欧语', form: '*gʷen-', era: '约公元前4000年' },
    { stage: '原始日耳曼语', form: '*kwēniz', era: '约公元前500年' },
    { stage: '古英语', form: 'cwēn', era: '约公元700年' },
    { stage: '中古英语', form: 'quene', era: '约公元1200年' },
    { stage: '现代英语', form: 'queen', era: '现代' },
  ],
}

/** 来源路径断档：断点位置与原因 */
const PATH_GAPS: Record<string, { afterStage: string; reason: string }> = {
  '*mātér': { afterStage: '原始日耳曼语', reason: '对应阶段口述传统中断，中间形态无文字记录可考' },
  '*dʰómos': { afterStage: '拉丁语', reason: '中世纪抄本散佚，该时期词形演化链断裂' },
  '*luks-': { afterStage: '拉丁语', reason: '方言文献未传世，此阶段之后的过渡词形不可考' },
  '*ed-': { afterStage: '原始日耳曼语', reason: '出土文献残缺，该阶段词形尚未发现可靠用例' },
}

/** 只收录部分词形的词条及说明 */
const PARTIAL_COVERAGE: Record<string, string> = {
  '*pṓtr': '仅收录部分存世词形，方言变体未列入对照',
  '*sol-': '仅收录主流文献词形，诗歌体与古方言变体从略',
  '*ed-': '部分历史词形仅存孤证，暂未列入对照表',
  '*gʷen-': '仅收录标准语词形，区域变体与俗语形式未收录',
}

/** 模拟详情服务不稳定的词条：首次加载失败，重试后恢复 */
const FLAKY_ROOTS = new Set(['*h₂épo', '*nokʷt-', '*sker-'])
const flakyAttempts = new Set<string>()

export const ENTRY_DETAILS: Record<string, EntryDetail> = Object.fromEntries(
  COGNATE_SETS.map((cs, i): [string, EntryDetail] => {
    const expected = LANGUAGE_FAMILIES.find(f => f.id === cs.family)?.languages ?? []
    const missingLanguages = expected
      .filter(lang => !cs.languages[lang])
      .map((language, k) => ({ language, reason: MISSING_REASONS[(i + k) % MISSING_REASONS.length] }))
    return [cs.root, {
      root: cs.root,
      meaning: cs.meaning,
      period: cs.period,
      family: cs.family,
      forms: { ...cs.languages },
      missingLanguages,
      sourcePath: SOURCE_PATHS[cs.root] ?? [],
      pathGap: PATH_GAPS[cs.root] ?? null,
      partialCoverage: PARTIAL_COVERAGE[cs.root] ?? null,
    }]
  })
)

/** 模拟异步详情接口：带网络延迟，部分词条首次请求会失败（重试可恢复） */
export function fetchEntryDetail(root: string): Promise<EntryDetail> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const detail = ENTRY_DETAILS[root]
      if (!detail) {
        reject(new Error(`未找到词条 ${root} 的详情数据`))
        return
      }
      if (FLAKY_ROOTS.has(root) && !flakyAttempts.has(root)) {
        flakyAttempts.add(root)
        reject(new Error('详情服务响应超时，请重试'))
        return
      }
      resolve(JSON.parse(JSON.stringify(detail)) as EntryDetail)
    }, 350 + Math.random() * 300)
  })
}
