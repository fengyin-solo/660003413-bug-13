export interface WordNode {
  id: string; word: string; language: string; meaning: string
  family: string; era?: string; x?: number; y?: number
  entryRoot?: string
}
export interface WordLink {
  source: string; target: string
  type: 'cognate' | 'derived' | 'borrowed' | 'reconstructed'
  description?: string
}
export interface CognateSet {
  root: string; meaning: string
  languages: Record<string, string>
  period: string; family: string
}
export interface LanguageFamily {
  id: string; name: string; color: string; languages: string[]; era: string
}

/** 语种缺项：该语种未收录词形及原因 */
export interface MissingLanguageItem {
  language: string
  reason: string
}
/** 来源路径中的一个演化阶段 */
export interface SourcePathStage {
  stage: string
  form: string
  era: string
}
/** 来源路径断档：出现在某一阶段之后及原因 */
export interface SourcePathGap {
  afterStage: string
  reason: string
}
/** 词条详情 */
export interface EntryDetail {
  root: string
  meaning: string
  period: string
  family: string
  forms: Record<string, string>
  missingLanguages: MissingLanguageItem[]
  sourcePath: SourcePathStage[]
  pathGap: SourcePathGap | null
  partialCoverage: string | null
}
export type DetailStatus = 'idle' | 'loading' | 'ready' | 'error'
/** 详情面板状态机：任何时刻只描述 entryId 指向的当前词条 */
export interface DetailState {
  status: DetailStatus
  entryId: string | null
  data: EntryDetail | null
  error: string | null
}
