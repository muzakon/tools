<template>
  <div class="!p-4 flex flex-col gap-5">
    <div class="text-sm text-white/50 shrink-0">
      Free, privacy-first developer tools that run entirely in your browser.
    </div>

    <v-divider />

    <div v-for="category in categories" :key="category.title" class="flex flex-col gap-2.5">
      <div class="text-xs text-white/50">
        {{ category.title }}
      </div>

      <div class="grid md:grid-cols-2 gap-2">
        <nuxt-link
          v-for="tool in category.items"
          :key="tool.to"
          :to="tool.to!"
          class="border !p-3 !bg-white/5 hover:!bg-white/10 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <v-icon size="16" color="white" class="opacity-50">{{ tool.icon }}</v-icon>
            <div class="text-xs font-semibold text-white/70">
              {{ tool.title }}
            </div>
          </div>

          <div class="text-xs text-white/40 mt-2">
            {{ tool.description }}
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { categories } = useNavigation();

useHead({
  title: 'DevKit',
  meta: [
    { name: 'description', content: 'A collection of handy tools for product development — converters, graphics utilities, text tools, and more.' },
  ],
})
</script>
