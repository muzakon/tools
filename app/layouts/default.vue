<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      :permanent="isDesktop"
      :temporary="!isDesktop"
      :width="240"
      app
    >
      <v-list nav density="compact">
        <template v-for="(item, i) in items" :key="i">
          <v-list-subheader v-if="item.type === 'subheader'">
            {{ item.title }}
          </v-list-subheader>

          <v-divider v-else-if="item.type === 'divider'" class="my-2" />

          <v-list-item
            v-else
            :to="item.to"
            router
            rounded="lg"
            active-class="v-list-item--active"
          >
            <template #prepend>
              <v-icon size="18">{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>

      <template #append>
        <div class="pa-2">
          <v-divider class="mb-2" />
          
          <v-list-item
            href="https://github.com/muzakon/tools"
            target="_blank"
            rel="noopener noreferrer"
            rounded="lg"
            nav
            density="compact"
          >
            <template #prepend>
              <v-icon size="18" icon="mdi-github" />
            </template>
            <v-list-item-title>GitHub</v-list-item-title>
            <template #append>
              <v-icon size="12" icon="mdi-open-in-new" color="grey" />
            </template>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar v-if="!isDesktop" app color="transparent" class="border-b" flat>
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";

const drawer = ref(false);
const breakpoints = useBreakpoints(breakpointsTailwind);
const isDesktop = computed(() => {
  return breakpoints.xl.value;
})

const { items } = useNavigation();

onMounted(() => {
  if (breakpoints.xl.value) {
    drawer.value = true;
  }
})
</script>

<style scoped lang="scss">
/* Utility class usage in template allows reducing CSS here */
.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.v-list-item) {
  padding: 0 1rem;
  border-radius: 12px !important;
}

:deep(.v-list-subheader__text) {
  font-family: "Reddit Mono", monospace;
  font-size: 0.5625rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 2px;
  color: oklch(55.6% 0 0);
}

:deep(.v-list-item-title) {
  color: oklch(75.6% 0 0);
}

:deep(.v-list-item--active) {
  .v-list-item-title {
    color: white;
  }
  .v-list-item__overlay {
    opacity: 0.08 !important;
  }
}
</style>