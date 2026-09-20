<template>
  <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-bold text-slate-400">
        词条详情
        <span v-if="store.selectedRoot" class="font-mono text-cyan-400 ml-1">{{ store.selectedRoot }}</span>
      </h3>
      <button @click="store.backToList()" class="text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300">← 返回列表</button>
    </div>

    <!-- 加载中：不沿用任何旧详情 -->
    <div v-if="store.detailStatus === 'loading'" class="py-12 text-center">
      <div class="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
      <div class="text-sm text-slate-400">正在加载 {{ store.selectedRoot }} 的词条详情…</div>
    </div>

    <!-- 加载失败：可重试 -->
    <div v-else-if="store.detailStatus === 'error'" class="py-12 text-center">
      <div class="text-sm text-red-400 mb-1">词条详情加载失败</div>
      <div class="text-xs text-slate-500 mb-4">{{ store.detailError }}</div>
      <button @click="store.retryDetail()" class="text-xs px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white">重试</button>
    </div>

    <!-- 详情内容：严格来自当前词条 -->
    <div v-else-if="detail" class="grid md:grid-cols-3 gap-4">
      <div class="md:col-span-2 space-y-3">
        <div>
          <div class="text-2xl font-bold font-mono text-cyan-400">{{ detail.root }}</div>
          <div class="text-sm text-slate-400 mt-1">{{ detail.meaning }} · {{ detail.period }} · {{ familyName }}</div>
        </div>
        <table class="w-full text-xs">
          <thead>
            <tr class="text-left text-slate-400 border-b border-slate-700">
              <th class="py-1.5 pr-2">语种</th>
              <th class="py-1.5">词形</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lang in expectedLanguages" :key="lang" class="border-b border-slate-700/50">
              <td class="py-1.5 pr-2 text-slate-400">{{ lang }}</td>
              <td v-if="detail.forms[lang]" class="py-1.5 font-mono text-slate-200">{{ detail.forms[lang] }}</td>
              <td v-else class="py-1.5 text-amber-500/80">缺项 — {{ missingReason(lang) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="text-xs text-slate-500">来源：{{ detail.source }} · 更新于 {{ detail.updatedAt }}</div>
      </div>

      <!-- 右侧说明面板：缺项 / 断档 / 部分词形，均按当前词条给出原因 -->
      <div class="space-y-3">
        <div class="bg-slate-900 rounded p-3">
          <h4 class="text-xs font-bold text-slate-400 mb-2">语种缺项</h4>
          <div v-if="detail.missingLanguages.length" class="space-y-2">
            <div v-for="m in detail.missingLanguages" :key="m.language">
              <div class="text-xs font-bold text-amber-400">{{ m.language }}</div>
              <div class="text-xs text-slate-500">{{ m.reason }}</div>
            </div>
          </div>
          <div v-else class="text-xs text-slate-600">无缺项，语系内语种均已收录</div>
        </div>
        <div class="bg-slate-900 rounded p-3">
          <h4 class="text-xs font-bold text-slate-400 mb-2">来源路径中断</h4>
          <div v-if="detail.pathBreaks.length" class="space-y-2">
            <div v-for="(p, i) in detail.pathBreaks" :key="i">
              <div class="text-xs font-mono text-orange-400">{{ p.from }} → {{ p.to }}</div>
              <div class="text-xs text-slate-500">{{ p.reason }}</div>
            </div>
          </div>
          <div v-else class="text-xs text-slate-600">来源路径完整，无断档</div>
        </div>
        <div class="bg-slate-900 rounded p-3">
          <h4 class="text-xs font-bold text-slate-400 mb-2">部分词形收录</h4>
          <div v-if="detail.partialForms.length" class="space-y-2">
            <div v-for="p in detail.partialForms" :key="p.language">
              <div class="text-xs text-purple-400">{{ p.language }} <span class="font-mono">{{ p.recorded }}</span></div>
              <div class="text-xs text-slate-500">{{ p.note }}</div>
            </div>
          </div>
          <div v-else class="text-xs text-slate-600">词形收录完整</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEtymologyStore, LANGUAGE_FAMILIES } from '../store/etymology'

const store = useEtymologyStore()
const detail = computed(() => store.detail)

const familyName = computed(() =>
  LANGUAGE_FAMILIES.find(f => f.id === detail.value?.family)?.name ?? detail.value?.family ?? ''
)
const expectedLanguages = computed(() =>
  LANGUAGE_FAMILIES.find(f => f.id === detail.value?.family)?.languages ?? Object.keys(detail.value?.forms ?? {})
)

function missingReason(lang: string): string {
  return detail.value?.missingLanguages.find(m => m.language === lang)?.reason ?? '该语种暂无收录记录'
}
</script>
