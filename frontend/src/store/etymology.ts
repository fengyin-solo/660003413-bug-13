import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { COGNATE_SETS, LANGUAGE_FAMILIES, buildGraph } from '../mock/data'
import { fetchEntryDetail } from '../mock/details'
import type { DetailState, EntryDetail } from '../types'
export { LANGUAGE_FAMILIES, COGNATE_SETS }

const idleDetail = (): DetailState => ({ status: 'idle', entryId: null, data: null, error: null })

export const useEtymologyStore = defineStore('etymology', () => {
  const graph = ref(buildGraph())
  const selectedNode = ref<any>(null)
  const searchQuery = ref('')
  const selectedFamily = ref('all')

  /** 右侧面板模式：词条列表 / 词条详情 */
  const panelMode = ref<'list' | 'detail'>('list')
  /** 详情状态机：任何时刻只描述 entryId 指向的当前词条，切换词条时整体重置 */
  const detail = ref<DetailState>(idleDetail())
  /** 已加载详情缓存：返回列表后再次进入同一词条时直接恢复 */
  const detailCache = new Map<string, EntryDetail>()
  /** 请求序号：丢弃过期响应，避免上一条词条的详情覆盖当前词条 */
  let detailSeq = 0

  const filteredCognates = computed(() =>
    COGNATE_SETS.filter(cs => {
      const q = searchQuery.value.toLowerCase()
      const matchSearch = !q || cs.root.toLowerCase().includes(q) || cs.meaning.includes(q) || Object.values(cs.languages).some((w: string) => w.toLowerCase().includes(q))
      const matchFamily = selectedFamily.value === 'all' || cs.family === selectedFamily.value
      return matchSearch && matchFamily
    })
  )

  /** 打开词条详情（列表选中与图谱选中共用同一入口，不会带入旧详情） */
  async function openEntry(entryId: string) {
    panelMode.value = 'detail'
    const seq = ++detailSeq
    const cached = detailCache.get(entryId)
    if (cached) {
      detail.value = { status: 'ready', entryId, data: cached, error: null }
      return
    }
    // 先清空上一条词条的详情，再按当前词条加载
    detail.value = { status: 'loading', entryId, data: null, error: null }
    try {
      const data = await fetchEntryDetail(entryId)
      detailCache.set(entryId, data)
      // 请求期间已切换到其他词条或返回列表：结果入缓存但不覆盖当前面板
      if (seq !== detailSeq || detail.value.entryId !== entryId) return
      detail.value = { status: 'ready', entryId, data, error: null }
    } catch (e: any) {
      if (seq !== detailSeq || detail.value.entryId !== entryId) return
      detail.value = { status: 'error', entryId, data: null, error: e?.message ?? '详情加载失败' }
    }
  }

  /** 加载失败后重试当前词条 */
  function retryDetail() {
    if (detail.value.entryId) return openEntry(detail.value.entryId)
  }

  /** 返回词条列表：作废进行中的请求并复位详情，再次进入时从缓存恢复 */
  function backToList() {
    detailSeq++
    panelMode.value = 'list'
    detail.value = idleDetail()
  }

  /** 图谱节点选中：解析所属词条并打开其详情 */
  function selectGraphNode(node: any) {
    selectedNode.value = node
    if (node?.entryRoot) openEntry(node.entryRoot)
  }

  return {
    graph, selectedNode, searchQuery, selectedFamily, filteredCognates,
    panelMode, detail, openEntry, retryDetail, backToList, selectGraphNode,
  }
})
