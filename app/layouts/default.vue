<template>
  <v-layout>
    <v-navigation-drawer :width="240">
      <v-list nav density="compact" :items="items" />
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center">
      <v-container>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt ducimus perspiciatis ratione necessitatibus architecto eaque suscipit. Minima veritatis expedita velit adipisci sequi enim eius, similique laborum quis iusto facilis hic!
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
const items = [
    { type: 'subheader', title: 'Notes' },
    {
      title: 'Paint',
      value: 1,
    },
    {
      title: 'Markdown',
      value: 2,
    },
    {
      title: 'Text',
      value: 3,
    },
    { type: 'divider' },
    { type: 'subheader', title: 'Converters' },
    {
      title: 'Cron',
      value: 4,
    },
    {
      title: 'Timestamp',
      value: 5,
    },
    {
      title: 'Base64',
      value: 6,
    },
    {
      title: 'Color Converter',
      value: 6,
    },
    { type: 'divider' },
    { type: 'subheader', title: 'Graphics' },
    {
      title: 'Image Resizer',
      value: 4,
    },
    {
      title: 'Image Compressor',
      value: 5,
    },
    {
      title: 'Filtering',
      value: 6,
    },
    {
      title: 'Gradient Generator',
      value: 7,
    },
    {
      title: 'Shadow Generator',
      value: 8,
    },
    { type: 'divider' },
    { type: 'subheader', title: 'Text' },
    {
      title: 'Regex',
      value: 4,
    },
    {
      title: 'Emoji Picker',
      value: 4,
    },
  ]

</script>

<style scoped lang="scss">
:deep(.v-list-item) {
    padding: 0 1rem;
    border-radius: 12px;
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