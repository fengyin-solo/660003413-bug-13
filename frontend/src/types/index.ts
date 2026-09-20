export interface WordNode {
  id: string; word: string; language: string; meaning: string
  family: string; era?: string; x?: number; y?: number
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
export interface MissingLanguageNote {
  language: string; reason: string
}
export interface PathBreakNote {
  from: string; to: string; reason: string
}
export interface PartialFormNote {
  language: string; recorded: string; note: string
}
export interface EntryDetail {
  root: string; meaning: string; period: string; family: string
  forms: Record<string, string>
  missingLanguages: MissingLanguageNote[]
  pathBreaks: PathBreakNote[]
  partialForms: PartialFormNote[]
  source: string; updatedAt: string
}
