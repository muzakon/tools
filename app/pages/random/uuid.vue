<template>
  <div class="h-screen flex flex-col !p-4 gap-2.5">
    <div class="text-sm text-white/50 shrink-0">
      Generate random UUIDs on the client-side.
    </div>

    <div class="flex items-center gap-1.5">
      <div class="text-xs cursor-pointer !px-3 !py-1.5 rounded-lg" :class="{
        'bg-white/10': selectedIdType === idType.value,
        'hover:bg-white/5': selectedIdType !== idType.value
      }" v-for="idType in idTypes" :key="idType.value" @click="selectedIdType = idType.value">
        {{ idType.name }}
      </div>
    </div>

    <div
      class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-4"
    >
      <div class="flex items-center gap-2">
        <div class="text-sm mono">
          {{ uuid }}
        </div>
        <div
          class="text-xs cursor-pointer text-white/40 hover:text-white/60 select-none !px-2 !py-1"
          @click="copy(uuid)"
        >
          {{ copied ? 'Copied!' : 'Copy' }}
        </div>
        <v-divider vertical />
        <div
          class="text-xs cursor-pointer text-white/40 hover:text-white/60 select-none !px-2 !py-1"
          @click="uuid = generate()"
        >
          Generate New
        </div>
      </div>
    </div>

    <div class="text-sm text-white/50 shrink-0 mt-4">Create Multiple IDs</div>

    <div class="flex items-center gap-2">
      <div
        class="w-full flex items-center rounded-lg border border-white/12 bg-white/5 focus-within:border-blue-500/50 transition-colors"
      >
        <input
          v-model="count"
          :step="1"
          :min="1"
          :max="100"
          type="number"
          placeholder="Count"
          class="outline-none w-full placeholder:text-neutral-600 bg-transparent text-white mono !px-4 h-[40px] !text-sm"
        />
      </div>

      <v-btn style="height: 40px" variant="flat" @click="generateBulk">
        <div
          style="
            font-size: 0.8125rem;
            font-weight: 500;
            text-transform: none;
            letter-spacing: normal;
          "
        >
          Generate
        </div>
      </v-btn>
    </div>

    <div
      class="!p-4 bg-white/[8%] border border-white/10 rounded-lg flex flex-col gap-4"
    >
      <div v-for="(id, idx) in bulkIds" :key="idx">
        <div class="text-sm mono text-white/50" :class="{
            'mb-3': idx !== bulkIds.length - 1
        }">
            {{ id }}
        </div>

        <v-divider v-if="idx !== bulkIds.length - 1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { v1, v4, v6, v7 } from "uuid";
import { ulid } from "ulid";
import { useClipboard } from "@vueuse/core";

const { copy, copied } = useClipboard();

const idTypes = [
  { name: "UUID v1", value: "v1" },
  { name: "UUID v4", value: "v4" },
  { name: "UUID v6", value: "v6" },
  { name: "UUID v7", value: "v7" },
  { name: "ULID", value: "ulid" },
];
const selectedIdType = ref("v4");

const generators: Record<string, () => string> = {
  v1: () => v1(),
  v4: () => v4(),
  v6: () => v6(),
  v7: () => v7(),
  ulid: () => ulid(),
};

function generate() {
  const gen = generators[selectedIdType.value];
  return gen ? gen() : v4();
}

const uuid = ref("");
const count = ref(5);
const bulkIds = ref<string[]>([]);

function generateBulk() {
  bulkIds.value = Array.from({ length: count.value }, () => generate());
}

watch(selectedIdType, () => {
  uuid.value = generate();
  generateBulk();
});

onMounted(() => {
  uuid.value = generate();
  generateBulk();
});
</script>
