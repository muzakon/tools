<template>
  <div class="!p-4 flex flex-col gap-4">
    <!-- Cron input -->
    <div
      class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-3"
    >
      <div class="flex items-center justify-between w-full">
        <div class="text-sm text-white/60 font-medium">Current Timestamp</div>
        <div class="text-xs text-white/60 font-medium cursor-pointer" @click="copy(String(currentUnix))">Copy</div>
      </div>

      <v-text-field
        hide-details
        variant="outlined"
        density="compact"
        class="mono w-full"
        readonly
        v-model:model-value="currentUnix"
      />
    </div>

    <!-- Error -->
    <v-alert
      v-if="hasError"
      type="error"
      variant="tonal"
      :text="errorMessage"
    />

    <div v-if="!hasError" class="flex flex-col gap-4">
      <!-- Executions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Next -->
        <div
          class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-3"
        >
          <div class="text-sm text-white/60">Timestamp to Date</div>

          <div>
            <div class="text-xs mb-2">
              Unix Timestamp (seconds or milliseconds)
            </div>
            <v-text-field
              v-model="timestampInput"
              hide-details
              variant="outlined"
              density="compact"
              placeholder="Enter unix"
              class="mono w-full"
            />
          </div>

          <div>
            <div class="text-xs mb-2">Display Timezone</div>
            <v-autocomplete
              v-model="timezone"
              variant="outlined"
              density="compact"
              hide-details
              :items="timezones"
              class="mt-2 w-full"
            />
          </div>

          <div class="border rounded overflow-x-auto !p-4">
            <div class="flex flex-col gap-1 border-b pb-2 !border-white/5">
              <div class="flex items-center justify-between">
                <div class="text-xs text-white/40">Human Readable (UTC)</div>
                <div class="text-xs text-white/40 cursor-pointer" @click="copy(humanReadable)">Copy</div>
              </div>

              <div class="text-sm">
                {{ humanReadable }}
              </div>
            </div>

            <div class="flex flex-col gap-1 border-b py-2 !border-white/5">
              <div class="flex items-center justify-between">
                <div class="text-xs text-white/40">Relative Time</div>
                <div class="text-xs text-white/40 cursor-pointer" @click="copy(relativeTime)">Copy</div>
              </div>

              <div class="text-sm">{{ relativeTime }}</div>
            </div>

            <div class="flex flex-col gap-1 border-b py-2 !border-white/5">
              <div class="flex items-center justify-between">
                <div class="text-xs text-white/40">Date Only</div>
                <div class="text-xs text-white/40 cursor-pointer" @click="copy(dateOnly)">Copy</div>
              </div>

              <div class="text-sm">{{ dateOnly }}</div>
            </div>

            <div class="flex flex-col gap-1 pt-2">
              <div class="flex items-center justify-between">
                <div class="text-xs text-white/40">Time Only</div>
                <div class="text-xs text-white/40 cursor-pointer" @click="copy(timeOnly)">Copy</div>
              </div>

              <div class="text-sm">{{ timeOnly }}</div>
            </div>
          </div>
        </div>

        <div
          class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-3"
        >
          <div class="text-sm text-white/60">Date to Timestamp</div>

          <div>
            <div class="text-xs mb-2">Date</div>
            <v-text-field
              v-model="dateInput"
              hide-details
              variant="outlined"
              density="compact"
              placeholder="eg: 2026-02-09 15:39:19"
              class="mono w-full"
            />
          </div>


          <div>
            <div class="text-xs mb-2">Date Picker</div>
            <v-date-input v-model="datePickerValue" hide-details variant="outlined" density="compact" placeholder="Date input"></v-date-input>
          </div>

          <v-divider />

          <div>
            <div class="text-xs mb-2">Timestamp Result</div>
            <v-text-field
              :model-value="timestampResult"
              hide-details
              variant="outlined"
              density="compact"
              placeholder="Result"
              class="mono w-full"
              readonly
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimestamp } from '~/composables/useTimestamp';

const {
  currentUnix,
  timestampInput,
  timezone,
  timezones,
  hasError,
  errorMessage,
  humanReadable,
  relativeTime,
  dateOnly,
  timeOnly,
  dateInput,
  datePickerValue,
  timestampResult,
  copy,
} = useTimestamp();
</script>
