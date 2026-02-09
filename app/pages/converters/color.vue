<template>
  <div class="h-screen flex flex-col !p-4 gap-4">
    <div class="text-sm text-white/50 shrink-0">
      Convert colors between different formats (HEX, RGB, HSL, CMYK) or create a
      palette.
    </div>

    <div
      class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-3"
    >
      <div class="text-sm text-white/60 font-medium">
        Color (Hex | RGB | HSL | CMYK)
      </div>

      <div class="flex items-center gap-2">
        <div
          class="rounded-[4px]"
          :style="{ backgroundColor: previewColor, width: `36px`, height: `36px` }"
        ></div>
        <v-text-field
          v-model="input"
          hide-details
          variant="outlined"
          placeholder="eg: #ffffff"
          clearable
          density="compact"
          class="mono w-full"
        />
      </div>
    </div>

    <v-alert
      v-if="hasError"
      style="max-height: 60px"
      type="error"
      variant="tonal"
      :text="errorMessage"
    />

    <div
      v-if="!hasError && palette.length"
      class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-3"
    >
      <div class="text-sm text-white/60 font-medium">Palette</div>

      <div class="flex items-center gap-2">
        <div
          v-for="(c, i) in palette"
          :key="i"
          class="rounded-[4px] cursor-pointer"
          :style="{ backgroundColor: c, width: `36px`, height: `36px` }"
          :title="c"
          @click="copy(c)"
        ></div>
      </div>
    </div>

    <div
      v-if="!hasError && input.trim()"
      class="!p-4 bg-white/[8%] border border-white/10 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <div>
        <div class="text-sm text-white/50">Hex</div>
        <div class="flex items-center mt-2 text-white/90 gap-5">
          <span
            class="inline-block !px-4 !py-2 bg-white/5 rounded-[9px] mono text-xs"
            >{{ hex }}</span
          >
          <span
            class="text-xs cursor-pointer text-white/40 hover:text-white/60"
            @click="copy(hex)"
            >{{ copied ? 'Copied' : 'Copy' }}</span
          >
        </div>
      </div>

      <div>
        <div class="text-sm text-white/50">RGB</div>
        <div class="flex items-center mt-2 text-white/90 gap-5">
          <span
            class="inline-block !px-4 !py-2 bg-white/5 rounded-[9px] mono text-xs"
            >{{ rgb }}</span
          >
          <span
            class="text-xs cursor-pointer text-white/40 hover:text-white/60"
            @click="copy(rgb)"
            >{{ copied ? 'Copied' : 'Copy' }}</span
          >
        </div>
      </div>

      <div>
        <div class="text-sm text-white/50">HSL</div>
        <div class="flex items-center mt-2 text-white/90 gap-5">
          <span
            class="inline-block !px-4 !py-2 bg-white/5 rounded-[9px] mono text-xs"
            >{{ hsl }}</span
          >
          <span
            class="text-xs cursor-pointer text-white/40 hover:text-white/60"
            @click="copy(hsl)"
            >{{ copied ? 'Copied' : 'Copy' }}</span
          >
        </div>
      </div>

      <div>
        <div class="text-sm text-white/50">CMYK</div>
        <div class="flex items-center mt-2 text-white/90 gap-5">
          <span
            class="inline-block !px-4 !py-2 bg-white/5 rounded-[9px] mono text-xs"
            >{{ cmyk }}</span
          >
          <span
            class="text-xs cursor-pointer text-white/40 hover:text-white/60"
            @click="copy(cmyk)"
            >{{ copied ? 'Copied' : 'Copy' }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  input,
  previewColor,
  hasError,
  errorMessage,
  palette,
  hex,
  rgb,
  hsl,
  cmyk,
  copy,
  copied,
} = useColor();
</script>

<style scoped lang="scss">
:deep(.v-alert) {
  border-radius: 12px;

  .v-alert__content {
    font-size: 0.8125rem;
  }
}
</style>
