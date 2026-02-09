<template>
  <div class="!p-4 h-screen flex flex-col gap-4 overflow-hidden">
    <!-- Header -->
    <div class="shrink-0">
      <h1 class="text-base font-medium text-white">Image Compressor</h1>
      <p class="text-sm text-white/50">
        Compress and optimize images directly in your browser.
      </p>
    </div>

    <!-- Dropzone -->
    <div
      v-if="!hasImage"
      ref="dropZoneRef"
      class="relative flex-1 border-2 border-dashed rounded-2xl
             flex items-center justify-center transition
             group cursor-pointer"
      :class="isOverDropZone
        ? 'border-white/60 bg-white/[5%]'
        : 'border-white/15 hover:border-white/40 hover:bg-white/[2%]'"
      @click="() => openFileDialog()"
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
          PNG, JPG, WEBP &bull; Max 10MB
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
        <div class="shrink-0 flex items-center justify-between">
          <span class="text-white/60 text-sm font-medium">Preview</span>
          <div class="flex items-center gap-2 text-xs text-white/40">
            <span>{{ dimensionSummary }}</span>
            <span>&bull;</span>
            <span>{{ fileSizeText }}</span>
          </div>
        </div>

        <div
          class="flex-1 min-h-0 p-4
                 border border-white/10 rounded-lg
                 bg-white/[8%]
                 flex items-center justify-center
                 overflow-hidden relative"
        >
          <img
            :src="imageSrc"
            class="max-h-full max-w-full object-contain rounded-lg"
          />
        </div>
      </div>

      <!-- Controls -->
      <div
        class="lg:w-[320px] shrink-0
               flex flex-col gap-3
               min-h-0 overflow-y-auto"
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
            Quality: <span class="text-white text-sm">
              {{ quality }}%
            </span>
          </div>

          <div class="flex flex-col gap-2.5">
            <v-slider hide-details density="compact" :min="1" :max="100" :step="1" v-model="quality" />
            <div class="flex items-center justify-between">
              <span class="text-xs text-white/60">Low</span>
              <span class="text-xs text-white/60">High</span>
            </div>
          </div>
        </div>

        <!-- Quick Presets -->
        <div
          class="!p-4 bg-white/[8%] border border-white/10
                 rounded-lg flex flex-col gap-3"
        >
          <div class="text-sm text-white/60 font-medium">
            Quick Presets
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div
              v-for="p in ['High (90%)', 'Medium (75%)', 'Low (50%)', 'Very Low (25%)']"
              :key="p"
              class="text-xs text-center text-white/60 font-medium !p-2
                     border border-white/5 bg-white/[8%]
                     rounded-lg hover:bg-white/15
                     cursor-pointer select-none
                     transition hover:text-white"
              v-ripple
              @click="applyPreset(p)"
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
            :items="['JPG', 'WEBP']"
            class="w-full"
          />
        </div>

        <!-- Actions -->
        <v-btn
          color="white"
          :loading="isProcessing"
          @click="compressAndDownload"
        >
          <span class="text-[13px] font-medium normal-case">
            Compress &amp; Download
          </span>
        </v-btn>

        <div
          class="text-xs text-center text-white/40 font-medium !p-2
                 border border-white/5 bg-white/[4%]
                 rounded-lg hover:bg-white/10
                 cursor-pointer select-none
                 transition hover:text-white/60"
          v-ripple
          @click="removeImage"
        >
          Remove Image
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDropZone, useFileDialog } from "@vueuse/core";
import { useTemplateRef } from "vue";

const {
  imageSrc,
  quality,
  selectedFormat,
  isProcessing,
  hasImage,
  fileSizeText,
  dimensionSummary,
  loadFile,
  applyPreset,
  removeImage,
  compressAndDownload,
} = useImageCompressor();

const dropZoneRef = useTemplateRef("dropZoneRef");

function onDrop(files: File[] | null) {
  if (files?.[0]) loadFile(files[0]);
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ["image/png", "image/jpeg", "image/webp"],
});

const { open: openFileDialog, onChange } = useFileDialog({
  accept: "image/png,image/jpeg,image/webp",
  multiple: false,
});

onChange((fileList) => {
  if (fileList?.[0]) loadFile(fileList[0]);
});
</script>
