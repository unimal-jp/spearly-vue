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
import { defineProps, reactive, inject, watch, onBeforeUnmount } from 'vue'
import type { SpearlyApiClient, SpearlyAnalytics, Content, GetContentParams } from '@spearly/sdk-js'

export type Props = {
  id: string
  patternName?: 'a' | 'b'
  previewToken?: string
  loading?: string
}

export type State = {
  content: {
    attributes: {
      createdAt: Date | null
      updatedAt: Date | null
      publishedAt: Date | null
    } & Omit<Content['attributes'], 'createdAt' | 'updatedAt' | 'publishedAt'>
  } & Omit<Content, 'attributes'>
  isLoaded: boolean
}

const props = defineProps<Props>()
const state = reactive<State>({
  content: {
    attributes: {
      publicUid: '',
      patternName: 'a',
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
const $spearlyAnalytics = inject<SpearlyAnalytics>('$spearlyAnalytics')
const getContent = async () => {
  if (!$spearly) return

  if (!props.previewToken) {
    const params: GetContentParams = {}
    if (props.patternName) params.patternName = props.patternName

    const res = await $spearly.getContent(props.id, params)

    state.content = res
  } else {
    const res = await $spearly.getContentPreview(props.id, props.previewToken)
    state.content = res
  }

  state.isLoaded = true
}

getContent()

watch(
  () => state.isLoaded,
  (value) => {
    if (!$spearlyAnalytics || !value || props.previewToken) return
    $spearlyAnalytics.pageView({
      contentId: state.content.id,
      patternName: state.content.attributes.patternName,
    })
  }
)

onBeforeUnmount(() => {
  state.isLoaded = false
})
</script>

<script lang="ts">
export default {
  name: 'spearly-content',
}
</script>
