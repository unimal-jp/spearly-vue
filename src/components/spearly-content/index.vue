<template>
  <div>
    <template v-if="props.loading && !state.isLoaded">
      <component :is="props.loading" />
    </template>
    <template v-else>
      <slot v-if="state.content.id" :content="state.content" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, inject, onBeforeUnmount } from 'vue'
import { SpearlyApiClient, SpearlyContent } from '@spearly/sdk-js'

export type Props = {
  id: string
  previewToken?: string
  loading?: string
}

export type State = {
  content: {
    attributes: {
      createdAt: Date | null
      updatedAt: Date | null
      publishedAt: Date | null
    } & Omit<SpearlyContent['attributes'], 'createdAt' | 'updatedAt' | 'publishedAt'>
  } & Omit<SpearlyContent, 'attributes'>
  isLoaded: boolean
}

const props = defineProps<Props>()
const state = reactive<State>({
  content: {
    attributes: {
      publicUid: '',
      createdAt: null,
      updatedAt: null,
      publishedAt: null,
      contentAlias: '',
      fields: {
        data: [],
      },
      nextContent: null,
      previousContent: null,
    },
    id: '',
    type: 'content',
    values: {},
  },
  isLoaded: false,
})

const $spearly = inject<SpearlyApiClient>('$spearly')
const getContent = async () => {
  if (!$spearly) return

  if (!props.previewToken) {
    const res = await $spearly.getContent(props.id)
    state.content = res
  } else {
    const res = await $spearly.getContentPreview(props.id, props.previewToken)
    state.content = res
  }

  state.isLoaded = true
}

getContent()

onBeforeUnmount(() => {
  state.isLoaded = false
})
</script>

<script lang="ts">
export default {
  name: 'spearly-content',
}
</script>
