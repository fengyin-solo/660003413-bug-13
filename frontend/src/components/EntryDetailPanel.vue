<template>
  <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
    <div class="flex items-center justify-between mb-3">
      <button class="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1" @click="store.backToList()">
        <span>←</span> 返回列表
      </button>
      <span v-if="d.entryId" class="text-[10px] text-slate-500 font-mono">{{ d.entryId }}</span>
    </div>

    <!-- 加载中：不渲染任何旧词条内容 -->
    <div v-if="d.status === 'loading'" class="space-y-3 py-2">
      <div class="text-xs text-slate-400">正在加载词条详情…</div>
      <div class="h-6 w-2/3 bg-slate-700 rounded animate-pulse"></div>
      <div class="h-4 w-full bg-slate-700 rounded animate-pulse"></div>
      <div class="h-4 w-5/6 bg-slate-700 rounded animate-pulse"></div>
      <div class="h-4 w-4/6 bg-slate-700 rounded animate-pulse"></div>
    </div>

    <!-- 加载失败：说明原因并可重试 -->
    <div v-else-if="d.status === 'error'" class="py-6 text-center space-y-3">
      <div class="text-amber-400 text-sm">详情加载失败</div>
      <div class="text-xs text-slate-400">{{ d.error }}</div>
      <button
        class="px-4 py-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded"
        @click="store.retryDetail()"
      >重试</button>
    </div>

    <!-- 加载完成：内容严格来自当前词条 -->
    <div v-else-if="d.status === 'ready' && detail" class="space-y-4">
      <div>
        <div class="text-xl font-bold text-cyan-400 font-mono">{{ detail.root }}</div>
        <div class="text-sm text-slate-300 mt-0.5">{{ detail.meaning }}</div>
        <div class="flex gap-2 mt-2">
          <span class="text-[10px] px-1.5 py-0.5 bg-slate-900 rounded text-slate-400">{{ detail.period }}</span>
          <span class="text-[10px] px-1.5 py-0.5 bg-slate-900 rounded text-slate-400">{{ familyName }}</span>
        </div>
      </div>

      <!-- 语种词形：缺项单独标注原因，不留空白 -->
      <div>
        <h4 class="text-xs font-bold text-slate-400 mb-2">
          语种词形 · 已收录 {{ formCount }}/{{ expectedLanguages.length }} 语种
        </h4>
        <div class="space-y-1">
          <div
            v-for="lang in expectedLanguages"
            :key="lang"
            class="flex items-start gap-2 text-xs rounded px-2 py-1.5"
            :class="detail.forms[lang] ? 'bg-slate-900' : 'bg-amber-900/20 border border-amber-800/40'"
          >
            <span class="w-14 flex-shrink-0 text-slate-400">{{ lang }}</span>
            <span v-if="detail.forms[lang]" class="font-mono text-cyan-300">{{ detail.forms[lang] }}</span>
            <span v-else class="flex flex-col">
              <span class="text-amber-400 font-bold">缺项</span>
              <span class="text-amber-200/60">{{ missingReason(lang) }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- 来源路径：断档处单独标注原因 -->
      <div>
        <h4 class="text-xs font-bold text-slate-400 mb-2">来源路径</h4>
        <div v-if="detail.sourcePath.length" class="space-y-0">
          <template v-for="(stage, i) in detail.sourcePath" :key="stage.stage">
            <div class="flex items-start gap-2">
              <div class="flex flex-col items-center flex-shrink-0 w-3">
                <span class="w-2 h-2 rounded-full mt-1" :class="isAfterGap(stage.stage) ? 'bg-slate-600' : 'bg-cyan-500'"></span>
                <span v-if="i < detail.sourcePath.length - 1" class="w-px flex-1 min-h-4 bg-slate-600"></span>
              </div>
              <div class="pb-2 text-xs">
                <span class="text-slate-200">{{ stage.stage }}</span>
                <span class="font-mono text-cyan-300 ml-2">{{ stage.form }}</span>
                <div class="text-[10px] text-slate-500">{{ stage.era }}</div>
              </div>
            </div>
            <!-- 断档标记：路径在此中断并说明原因 -->
            <div
              v-if="isGapAfter(stage.stage)"
              class="ml-3 mb-2 border border-dashed border-amber-600/60 bg-amber-900/20 rounded px-2 py-1.5 text-xs"
            >
              <span class="text-amber-400 font-bold">⚠ 来源路径断档</span>
              <div class="text-amber-200/60 mt-0.5">{{ detail.pathGap?.reason }}</div>
            </div>
          </template>
        </div>
        <div v-else class="text-xs text-slate-500">暂无来源路径记录</div>
      </div>

      <!-- 收录说明：只收录部分词形时给出原因 -->
      <div v-if="detail.partialCoverage" class="border border-slate-600 bg-slate-900 rounded px-3 py-2 text-xs">
        <span class="text-slate-300 font-bold">收录说明：</span>
        <span class="text-slate-400">{{ detail.partialCoverage }}</span>
      </div>
    </div>

    <div v-else class="py-6 text-center text-xs text-slate-500">从列表或图谱中选择一个词条查看详情</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEtymologyStore } from '../store/etymology'
import { LANGUAGE_FAMILIES } from '../mock/data'

const store = useEtymologyStore()
const d = computed(() => store.detail)
const detail = computed(() => store.detail.data)

const family = computed(() => LANGUAGE_FAMILIES.find(f => f.id === detail.value?.family))
const familyName = computed(() => family.value?.name ?? detail.value?.family ?? '')
const expectedLanguages = computed(() => family.value?.languages ?? [])
const formCount = computed(() => Object.keys(detail.value?.forms ?? {}).length)

function missingReason(lang: string): string {
  return detail.value?.missingLanguages.find(m => m.language === lang)?.reason ?? '该语种暂未收录'
}
function isGapAfter(stage: string): boolean {
  return detail.value?.pathGap?.afterStage === stage
}
function isAfterGap(stage: string): boolean {
  const data = detail.value
  if (!data?.pathGap) return false
  const gapIndex = data.sourcePath.findIndex(s => s.stage === data.pathGap?.afterStage)
  const stageIndex = data.sourcePath.findIndex(s => s.stage === stage)
  return gapIndex >= 0 && stageIndex > gapIndex
}
</script>
