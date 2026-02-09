<template>
  <v-layout>
    <v-navigation-drawer :width="240">
      <v-list nav density="compact">
        <template v-for="(item, i) in items" :key="i">
          <!-- Subheader -->
          <v-list-subheader v-if="item.type === 'subheader'">
            {{ item.title }}
          </v-list-subheader>

          <!-- Divider -->
          <v-divider v-else-if="item.type === 'divider'" />

          <!-- Navigation item -->
          <v-list-item
            v-else
            :to="item.to"
            router
            rounded="lg"
            active-class="v-list-item--active"
          >
            <template #prepend>
              <v-icon size="18">
                {{ item.icon }}
              </v-icon>
            </template>

            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>


<script setup lang="ts">
const items = [
  { type: "subheader", title: "Notes" },
  {
    title: "Paint",
    to: "/notes/paint",
    icon: "mdi-brush",
  },
  {
    title: "Markdown",
    to: "/notes/markdown",
    icon: "mdi-language-markdown",
  },
  { type: "divider" },
  { type: "subheader", title: "Converters" },
  {
    title: "Cron",
    to: "/converters/cron",
    icon: "mdi-clock-outline",
  },
  {
    title: "Timestamp",
    to: "/converters/timestamp",
    icon: "mdi-timer",
  },
  {
    title: "Base64",
    to: "/converters/base64",
    icon: "mdi-code-braces",
  },
  {
    title: "Color Converter",
    to: "/converters/color",
    icon: "mdi-palette",
  },
  { type: "divider" },
  { type: "subheader", title: "Graphics" },
  {
    title: "Image Resizer",
    to: "/graphics/image-resizer",
    icon: "mdi-image-resize",
  },
  {
    title: "Image Compressor",
    to: "/graphics/compress",
    icon: "mdi-image-off",
  },
  {
    title: "Filters",
    to: "/graphics/filters",
    icon: "mdi-image-filter",
  },
  {
    title: "Gradient Generator",
    to: "/graphics/gradient",
    icon: "mdi-gradient-horizontal",
  },
  {
    title: "Shadow Generator",
    to: "/graphics/shadow",
    icon: "mdi-box-shadow",
  },
  { type: "divider" },
  { type: "subheader", title: "Text Utilities" },
  {
    title: "Regex Tester",
    to: "/text/regex",
    icon: "mdi-regex",
  },
  {
    title: "Emoji Picker",
    to: "/text/emoji",
    icon: "mdi-emoticon-outline",
  },
];
</script>

<style scoped lang="scss">
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

:deep(.v-divider) {
  margin: 8px 0;
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
