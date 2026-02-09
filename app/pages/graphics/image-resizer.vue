<template>
  <div class="!p-4 h-screen flex flex-col gap-4 overflow-hidden">
    <!-- Header -->
    <div class="shrink-0">
      <h1 class="text-base font-medium text-white">Image Resizer</h1>
      <p class="text-sm text-white/50">
        Resize and scale images directly in your browser.
      </p>
    </div>

    <!-- Dropzone -->
    <div
      v-if="showDropzone"
      class="relative flex-1 border-2 border-dashed border-white/15 rounded-2xl
             flex items-center justify-center transition
             hover:border-white/40 hover:bg-white/[2%]
             group cursor-pointer"
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <div
          class="size-14 rounded-full bg-white/[6%]
                 flex items-center justify-center
                 text-white/70 group-hover:scale-105 transition"
        >
          <svg
            class="size-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            />
          </svg>
        </div>

        <div class="text-sm font-medium text-white/80">
          Drop your image here
        </div>

        <div class="text-xs text-white/50">
          or
          <span class="text-white underline underline-offset-4">
            click to upload
          </span>
        </div>

        <div class="text-[11px] text-white/40">
          PNG, JPG, WEBP • Max 10MB
        </div>
      </div>
    </div>

    <!-- Editor -->
    <div
      v-else
      class="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden"
    >
      <!-- Image Preview -->
      <div class="flex-1 min-h-0 flex flex-col gap-3">
        <div class="shrink-0 text-white/60 text-sm font-medium">
          Original Image
        </div>

        <div
          class="flex-1 min-h-0 p-4
                 border border-white/10 rounded-lg
                 bg-white/[8%]
                 flex items-center justify-center
                 overflow-hidden"
        >
          <img
            :src="image"
            class="max-h-full max-w-full object-contain rounded-lg"
          />
        </div>
      </div>

      <!-- Controls -->
      <div
        class="lg:w-[320px] shrink-0
               flex flex-col gap-3
               min-h-0"
      >
        <div class="shrink-0 text-white/60 text-sm font-medium">
          Settings
        </div>

        <!-- Dimensions -->
        <div
          class="!p-4 bg-white/[8%] border border-white/10
                 rounded-lg flex flex-col gap-3"
        >
          <div class="text-sm text-white/60 font-medium">
            Dimensions
          </div>

          <div class="flex items-center gap-2.5">
            <v-text-field
              hide-details
              variant="outlined"
              placeholder="Width"
              density="compact"
              class="mono w-full"
              type="number"
            />

            <div
              class="min-w-8 min-h-8 flex items-center justify-center
                     hover:bg-white/10 rounded-full
                     text-white/40 hover:text-white
                     cursor-pointer transition"
              v-ripple
              @click="isRatioLocked = !isRatioLocked"
            >
              <icon
                :name="isRatioLocked ? 'tabler:lock' : 'tabler:lock-open'"
              />
            </div>

            <v-text-field
              hide-details
              variant="outlined"
              placeholder="Height"
              density="compact"
              class="mono w-full"
              type="number"
            />
          </div>

          <div
            class="text-xs text-center text-white/60 font-medium p-2
                   border border-white/5 bg-white/[8%]
                   rounded-lg hover:bg-white/15
                   cursor-pointer select-none
                   transition hover:text-white"
            v-ripple
          >
            Reset to Original
          </div>
        </div>

        <!-- Quick Scale -->
        <div
          class="!p-4 bg-white/[8%] border border-white/10
                 rounded-lg flex flex-col gap-3"
        >
          <div class="text-sm text-white/60 font-medium">
            Quick Scale
          </div>

          <div class="grid grid-cols-4 gap-2.5">
            <div
              v-for="p in ['25%', '50%', '75%', '100%']"
              :key="p"
              class="text-xs text-center text-white/60 font-medium p-2
                     border border-white/5 bg-white/[8%]
                     rounded-lg hover:bg-white/15
                     cursor-pointer select-none
                     transition hover:text-white"
              v-ripple
            >
              {{ p }}
            </div>
          </div>
        </div>

        <!-- Output Format -->
        <div
          class="!p-4 bg-white/[8%] border border-white/10
                 rounded-lg flex flex-col gap-3"
        >
          <div class="text-sm text-white/60 font-medium">
            Output Format
          </div>

          <v-select
            v-model:model-value="selectedFormat"
            variant="outlined"
            density="compact"
            hide-details
            :items="['JPG', 'PNG', 'WEBP']"
            class="w-full"
          />
        </div>

        <!-- Action -->
        <v-btn color="white">
          <span class="text-[13px] font-medium normal-case">
            Resize Image
          </span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const showDropzone = ref(false);

const image = ref(
  "https://www.mydomaine.com/thmb/MBYl8FUvZi9r3ZgTl6gyNLLGHkk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/cdn.cliqueinc.com__cache__posts__253245__most-beautiful-flowers-253245-1522430144413-main.700x0c-54d089becbe64976827e9ed0461e3f24.jpg"
);

const selectedFormat = ref("JPG");
const isRatioLocked = ref(true);
</script>
