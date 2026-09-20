import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { COGNATE_SETS, LANGUAGE_FAMILIES, buildGraph, fetchEntryDetail } from '../mock/data'
import type { EntryDetail } from '../types'
export { LANGUAGE_FAMILIES, COGNATE_SETS }

export const useEtymologyStore = defineStore('etymology', () => {
  const graph = ref(buildGraph())
  const selectedNode = ref<any>(null)
  const searchQuery = ref('')
  const selectedFamily = ref('all')

  // ---- 词条详情：视图与加载状态 ----
  const view = ref<'list' | 'detail'>('list')
  const selectedRoot = ref<string | null>(null)
  const detail = ref<EntryDetail | null>(null)
  const detailStatus = ref<'idle' | 'loading' | 'error' | 'success'>('idle')
  const detailError = ref('')
  // 已加载详情按词条缓存：返回列表再进入同一词条时直接恢复
  const detailCache = new Map<string, EntryDetail>()
  // 请求序号：快速切换词条时丢弃过期响应，避免旧详情覆盖新词条
  let detailSeq = 0

  const filteredCognates = computed(() =>
    COGNATE_SETS.filter(cs => {
      const q = searchQuery.value.toLowerCase()
      const matchSearch = !q || cs.root.toLowerCase().includes(q) || cs.meaning.includes(q) || Object.values(cs.languages).some((w: string) => w.toLowerCase().includes(q))
      const matchFamily = selectedFamily.value === 'all' || cs.family === selectedFamily.value
      return matchSearch && matchFamily
    })
  )

  async function loadDetail(root: string) {
    const seq = ++detailSeq
    const cached = detailCache.get(root)
    if (cached) {
      detail.value = cached
      detailStatus.value = 'success'
      detailError.value = ''
      return
    }
    // 关键：先清空上一条词条的详情，加载期间不得沿用旧说明
    detail.value = null
    detailStatus.value = 'loading'
    detailError.value = ''
    try {
      const d = await fetchEntryDetail(root)
      if (seq !== detailSeq || selectedRoot.value !== root) return
      detailCache.set(root, d)
      detail.value = d
      detailStatus.value = 'success'
    } catch (e: any) {
      if (seq !== detailSeq || selectedRoot.value !== root) return
      detail.value = null
      detailStatus.value = 'error'
      detailError.value = e?.message || '词条详情加载失败'
    }
  }

  // 列表与图谱选中都走同一入口，保证详情只按当前词条读取
  function openEntry(root: string) {
    if (!COGNATE_SETS.some(cs => cs.root === root)) return
    selectedRoot.value = root
    view.value = 'detail'
    loadDetail(root)
  }

  function retryDetail() {
    if (selectedRoot.value) loadDetail(selectedRoot.value)
  }

  function backToList() {
    detailSeq++ // 作废进行中的请求
    view.value = 'list'
    selectedRoot.value = null
    detail.value = null
    detailStatus.value = 'idle'
    detailError.value = ''
  }

  function rootOfNode(node: any): string | null {
    if (!node) return null
    if (node.language === 'Proto-IE') return node.word
    const ci = Number(String(node.id).split('_')[0])
    return Number.isInteger(ci) && COGNATE_SETS[ci] ? COGNATE_SETS[ci].root : null
  }

  function selectNode(node: any) {
    selectedNode.value = node
    const root = rootOfNode(node)
    if (root) openEntry(root)
  }

  return {
    graph, selectedNode, searchQuery, selectedFamily, filteredCognates,
    view, selectedRoot, detail, detailStatus, detailError,
    openEntry, retryDetail, backToList, selectNode,
  }
})
