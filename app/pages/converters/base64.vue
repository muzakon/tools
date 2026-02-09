<template>
  <div class="h-screen flex flex-col !p-4 gap-4">
    <div class="text-sm text-white/50 shrink-0">
      Encode text to Base64, decode encoded strings, or download
      decoded content as a file.
    </div>

    <v-btn-toggle density="compact" v-model="mode" class="shrink-0">
      <v-btn>
        <div class="text-xs" style="text-transform: none;">Decode</div>
      </v-btn>
      <v-btn>
        <div class="text-xs" style="text-transform: none;">Encode</div>
      </v-btn>
    </v-btn-toggle>

    <div class="flex-1 min-h-0 grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2">
      <div class="flex flex-col min-h-0 overflow-hidden lg:!pr-2">
        <label class="text-xs !mb-2 font-medium text-neutral-500 mono shrink-0">
          {{ inputLabel }}
        </label>

        <div
          class="relative flex-1 min-h-0 border overflow-hidden rounded-lg"
          :class="hasError ? 'bg-red-500/[8%] border-red-500/40' : 'bg-white/[8%] border-white/10'"
        >
          <textarea
            v-model="input"
            class="absolute inset-0 !p-3 lg:!p-4 !text-xs mono outline-none !resize-none bg-transparent"
            spellcheck="false"
            :placeholder="mode === 0 ? 'Paste Base64 encoded string...' : 'Enter text to encode...'"
          />
        </div>
        <div v-if="hasError" class="text-xs text-red-400 !mt-1">{{ errorMessage }}</div>
      </div>

      <!-- Output -->
      <div class="flex flex-col min-h-0 overflow-hidden lg:!pl-2">
        <label class="text-xs !mb-2 font-medium text-neutral-500 mono shrink-0">
          {{ outputLabel }}
        </label>

        <div
          class="relative flex-1 min-h-0 bg-white/[8%] border border-white/10 overflow-hidden rounded-lg"
        >
          <textarea
            :value="output"
            readonly
            class="absolute inset-0 !p-3 lg:!p-4 !text-xs mono outline-none !resize-none bg-transparent"
            :placeholder="hasError ? '' : 'Output will appear here...'"
          />
        </div>
      </div>

    </div>
  </div>
</template>


<script lang="ts" setup>
useHead({
  title: 'Base64 Encoder / Decoder | DevKit',
  meta: [
    { name: 'description', content: 'Encode text to Base64 or decode Base64 strings instantly in your browser.' },
  ],
})

const { input, mode, output, hasError, errorMessage, inputLabel, outputLabel } = useBase64();
</script>
