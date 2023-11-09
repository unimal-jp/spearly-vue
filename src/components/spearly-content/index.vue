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
import { defineProps, reactive, watch, onBeforeUnmount } from 'vue'
import { useSpearly } from 'src/composables'
import type { Content, GetContentParams } from '@spearly/sdk-js'

export type Props = {
  id: string
  contentTypeId: string
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

const spearly = useSpearly()
const getContent = async () => {
  if (!props.previewToken) {
    const params: GetContentParams = {}
    if (props.patternName) params.patternName = props.patternName

    const res = await spearly.getContent(props.contentTypeId, props.id, params)

    state.content = res
  } else {
    const res = await spearly.getContentPreview(props.contentTypeId, props.id, props.previewToken)
    state.content = res
  }

  state.isLoaded = true
}

getContent()

watch(
  () => state.isLoaded,
  (value) => {
    if (!value || props.previewToken) return
    spearly.pageView()
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
