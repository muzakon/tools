<template>
  <div class="!p-4 flex flex-col gap-4">
    <!-- Cron input -->
    <div
      class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-3"
    >
      <div class="text-sm text-white/60 font-medium">Cron Expression</div>

      <v-text-field
        hide-details
        variant="outlined"
        v-model:model-value="cron"
        placeholder="* * * * *"
        clearable
        density="compact"
        class="mono w-full"
      />

      <!-- Presets -->
      <div class="flex flex-wrap gap-1">
        <v-chip
          v-for="preset in presets"
          :key="preset.expression"
          class="!text-xs"
          color="primary"
          @click="setPreset(preset.expression)"
        >
          {{ preset.label }}
        </v-chip>
      </div>
    </div>

    <!-- Error -->
    <v-alert
      v-if="hasError"
      type="error"
      variant="tonal"
      text="Invalid cron expression. Expected format: minute hour day-of-month month day-of-week"
    />

    <div v-if="!hasError" class="flex flex-col gap-4">
      <!-- Description -->
      <div
        class="!p-4 bg-white/[8%] border border-white/10 rounded-lg"
      >
        <div class="text-sm leading-relaxed">
          {{ description }}
        </div>
      </div>

      <!-- Controls -->
      <div
        class="!p-4 bg-white/[8%] border border-white/10 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div>
          <div class="text-sm text-white/50">Timezone</div>
          <v-autocomplete
            v-model="timezone"
            variant="outlined"
            density="compact"
            hide-details
            :items="timezones"
            class="mt-2 w-full"
          />
        </div>

        <div>
          <div class="text-sm text-white/50">Next Runs</div>
          <v-text-field
            v-model="nextRuns"
            type="number"
            variant="outlined"
            density="compact"
            hide-details
            class="mt-2 w-full"
          />
        </div>

        <div>
          <div class="text-sm text-white/50">Last Runs</div>
          <v-text-field
            v-model="lastRuns"
            type="number"
            variant="outlined"
            density="compact"
            hide-details
            class="mt-2 w-full"
          />
        </div>
      </div>

      <!-- Executions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Next -->
        <div
          class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-3"
        >
          <div class="text-sm text-white/60">
            Next {{ nextRuns }} Executions
          </div>

          <div class="border rounded overflow-x-auto">
            <v-table striped="even" density="compact" class="!bg-inherit min-w-[320px]">
              <tbody>
                <tr v-for="(item, index) in nextExecutions" :key="index">
                  <td class="whitespace-nowrap">{{ item.date }}</td>
                  <td class="whitespace-nowrap">{{ item.time }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>

        <!-- Last -->
        <div
          class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-3"
        >
          <div class="text-sm text-white/60">
            Last {{ lastRuns }} Executions
          </div>

          <div class="border rounded overflow-x-auto">
            <v-table striped="even" density="compact" class="!bg-inherit min-w-[320px]">
              <tbody>
                <tr v-for="(item, index) in lastExecutions" :key="index">
                  <td class="whitespace-nowrap">{{ item.date }}</td>
                  <td class="whitespace-nowrap">{{ item.time }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
useHead({
  title: 'Cron Expression Parser | DevKit',
  meta: [
    { name: 'description', content: 'Parse cron expressions, preview upcoming runs, and pick from common presets.' },
  ],
})

const {
  cron,
  timezone,
  nextRuns,
  lastRuns,
  hasError,
  description,
  presets,
  timezones,
  nextExecutions,
  lastExecutions,
  setPreset,
} = useCron();
</script>

<style scoped lang="scss">
:deep(.v-alert) {
  border-radius: 12px;

  .v-alert__content {
    font-size: 0.8125rem;
  }
}
</style>