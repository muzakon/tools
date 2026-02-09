<template>
  <div class="h-screen flex flex-col !p-4 gap-4">
    <div class="text-sm text-white/50 shrink-0">
      Convert colors between different formats (HEX, RGB, HSL, CMYK) or
      create a palette.
    </div>

    <div
      class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-3"
    >
      <div class="text-sm text-white/60 font-medium">Color (Hex | RGB | HSL | CMYK)</div>

      <div class="flex items-center gap-2">
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
        <v-text-field
          hide-details
          variant="outlined"
          placeholder="eg: #ffffff"
          clearable
          density="compact"
          class="mono w-full"
        />
      </div>
    </div>


     <div
      class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-3"
    >
      <div class="text-sm text-white/60 font-medium">Palette</div>

      <div class="flex items-center gap-2">
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
        <div class="rounded-[4px]" :style="{ backgroundColor: color, width: `36px`, height: `36px` }"></div>
      </div>
    </div>


    <div
        class="!p-4 bg-white/[8%] border border-white/10 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div>
          <div class="text-sm text-white/50">Hex</div>
           <div class="flex items-center mt-2 text-white/90 gap-5">
            <span class="inline-block !px-4 !py-2 bg-white/5 rounded-[9px] mono text-xs">255, 255, 255</span>
            <span class="text-xs cursor-pointer text-white/40 hover:text-white/60">Copy</span>
          </div>
        </div>

        <div>
          <div class="text-sm text-white/50">RGB</div>
          <div class="flex items-center mt-2 text-white/90 gap-5">
            <span class="inline-block !px-4 !py-2 bg-white/5 rounded-[9px] mono text-xs">255, 255, 255</span>
            <span class="text-xs cursor-pointer text-white/40 hover:text-white/60">Copy</span>
          </div>
        </div>

        <div>
          <div class="text-sm text-white/50">HSL</div>
           <div class="flex items-center mt-2 text-white/90 gap-5">
            <span class="inline-block !px-4 !py-2 bg-white/5 rounded-[9px] mono text-xs">255, 255, 255</span>
            <span class="text-xs cursor-pointer text-white/40 hover:text-white/60">Copy</span>
          </div>
        </div>

         <div>
          <div class="text-sm text-white/50">CMYK</div>
           <div class="flex items-center mt-2 text-white/90 gap-5">
            <span class="inline-block !px-4 !py-2 bg-white/5 rounded-[9px] mono text-xs">255, 255, 255</span>
            <span class="text-xs cursor-pointer text-white/40 hover:text-white/60">Copy</span>
          </div>
        </div>
      </div>
  </div>
</template>


<script setup lang="ts">
const color = ref('#ffffff');
</script>
