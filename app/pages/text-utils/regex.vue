<template>
  <div class="h-screen flex flex-col !p-4 gap-2.5">
    <div class="text-sm text-white/50 shrink-0">
      Test regular expressions with real-time matching, capture groups, and
      flags.
    </div>

    <div
      class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-4"
    >
      <div class="flex flex-col gap-1.5">
        <div class="flex justify-between">
          <div class="text-sm text-white/60 font-medium">Pattern</div>
          <div v-if="error" class="text-xs text-red-400 font-mono">
            {{ error }}
          </div>
        </div>
        <div
          class="flex items-center rounded-lg border border-white/12 bg-black/20 focus-within:border-blue-500/50 transition-colors"
        >
          <div
            class="size-[40px] !border-r border-white/12 flex items-center justify-center mono text-neutral-500 font-semibold select-none text-sm"
          >
            /
          </div>
          <input
            v-model="pattern"
            type="text"
            placeholder="Regex pattern..."
            class="outline-none w-full placeholder:text-neutral-600 bg-transparent text-white mono !px-2 h-[40px] !text-sm"
          />
          <div
            class="h-[40px] !px-3 !border-l border-white/12 flex items-center justify-center mono text-neutral-500 font-semibold select-none text-sm"
          >
            /{{ activeFlags }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <div class="text-sm text-white/60 font-medium">Flags</div>
        <div class="flex flex-wrap items-center gap-4">
          <v-checkbox hide-details density="compact" v-model="flags.global">
            <template #label>
              <span class="text-xs text-white/60 mono">Global (g)</span>
            </template>
          </v-checkbox>
          <v-checkbox hide-details density="compact" v-model="flags.ignoreCase">
            <template #label>
              <span class="text-xs text-white/60 mono">Insensitive (i)</span>
            </template>
          </v-checkbox>
          <v-checkbox hide-details density="compact" v-model="flags.multiline">
            <template #label>
              <span class="text-xs text-white/60 mono">Multiline (m)</span>
            </template>
          </v-checkbox>
          <v-checkbox hide-details density="compact" v-model="flags.dotAll">
            <template #label>
              <span class="text-xs text-white/60 mono">DotAll (s)</span>
            </template>
          </v-checkbox>
          <v-checkbox hide-details density="compact" v-model="flags.unicode">
            <template #label>
              <span class="text-xs text-white/60 mono">Unicode (u)</span>
            </template>
          </v-checkbox>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-2">
      <div class="text-sm text-white/60 font-medium">Your Text</div>
      <div class="text-xs text-white/60 font-medium mono">
        {{ matchCount }} Match{{ matchCount !== 1 ? "es" : "" }}
      </div>
    </div>

    <div class="flex-1 min-h-0">
      <div class="flex flex-col min-h-0 h-full overflow-hidden">
        <div
          class="relative flex-1 min-h-0 border border-white/10 overflow-hidden rounded-lg bg-white/[4%]"
        >
          <div
            ref="backdropRef"
            class="absolute inset-0 !p-3 lg:!p-4 font-mono text-xs whitespace-pre-wrap break-all overflow-auto pointer-events-none text-transparent/0"
            aria-hidden="true"
          >
            <span class="text-white/50" v-html="highlightedHtml"></span>
          </div>

          <textarea
            ref="textareaRef"
            v-model="text"
            @scroll="handleScroll"
            class="absolute inset-0 size-full !p-3 lg:!p-4 !text-xs mono outline-none !resize-none bg-transparent text-transparent caret-white whitespace-pre-wrap break-all"
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  pattern,
  text,
  error,
  flags,
  activeFlags,
  matchCount,
  highlightedHtml,
} = useRegex();

const backdropRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const handleScroll = () => {
  if (backdropRef.value && textareaRef.value) {
    backdropRef.value.scrollTop = textareaRef.value.scrollTop;
    backdropRef.value.scrollLeft = textareaRef.value.scrollLeft;
  }
};
</script>

<style scoped>
textarea::-webkit-scrollbar,
div::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

textarea::-webkit-scrollbar-track,
div::-webkit-scrollbar-track {
  background: transparent;
}

textarea::-webkit-scrollbar-thumb,
div::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover,
div::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

:deep(.v-selection-control) {
  min-height: 28px;
}
</style>
