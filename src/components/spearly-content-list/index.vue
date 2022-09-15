<template>
  <div class="spearly-content-list">
    <template v-if="props.loading && !state.isLoaded">
      <component :is="props.loading" />
    </template>
    <component :is="props.wrapper" v-else>
      <component :is="props.item" v-for="content in state.contents" :key="content.attributes.publicUid">
        <slot :content="content" />
      </component>
    </component>

    <slot name="pager" :paging="paging" />
  </div>
</template>

<script lang="ts" setup>
import { inject, reactive, computed, watch, onBeforeUnmount } from 'vue'
import type { PropType } from 'vue'
import { SpearlyApiClient, SpearlyContent, SpearlyGetParams } from '@spearly/sdk-js'

export type State = {
  contents: SpearlyContent[]
  isLoaded: boolean
  next: number
  matchingContentsCount: number
  totalContentsCount: number
}

const $spearly = inject<SpearlyApiClient>('$spearly')

const props = defineProps({
  id: { type: String, required: true },
  limit: { type: Number },
  offset: { type: Number },
  order: { type: String },
  orderBy: { type: String },
  orders: { type: Object as PropType<SpearlyGetParams['orders']> },
  filterBy: { type: String },
  filterValue: { type: [String, Array] as PropType<string | string[]> },
  filterRef: { type: String },
  filterMode: { type: String as PropType<'or' | 'and'> },
  filters: { type: Object as PropType<SpearlyGetParams['filters']> },
  rangeFrom: { type: Date },
  rangeTo: { type: Date },
  wrapper: { type: [String, Object], default: 'div' },
  item: { type: [String, Object], default: 'div' },
  loading: { type: [String, Object] },
})
const state = reactive<State>({
  contents: [],
  isLoaded: false,
  next: 0,
  matchingContentsCount: 0,
  totalContentsCount: 0,
})

const paging = computed(() => ({
  limit: props.limit,
  offset: props.offset,
  next: state.next,
  matchingContentsCount: state.matchingContentsCount,
  totalContentsCount: state.totalContentsCount,
}))

const getList = async () => {
  if (!$spearly) return

  const params: SpearlyGetParams = {}
  if (props.limit) params.limit = props.limit
  if (props.offset) params.offset = props.offset
  if (props.order && ['asc', 'desc'].includes(props.order)) params.order = props.order as 'desc' | 'asc'
  if (props.orderBy) params.orderBy = props.orderBy
  if (props.orders) params.orders = props.orders
  if (props.filterBy) params.filterBy = props.filterBy
  if (props.filterValue) params.filterValue = props.filterValue
  if (props.filterRef) params.filterRef = props.filterRef
  if (props.filterMode) params.filterMode = props.filterMode
  if (props.filters) params.filters = props.filters
  if (props.rangeFrom) params.rangeFrom = props.rangeFrom
  if (props.rangeTo) params.rangeTo = props.rangeTo

  const res = await $spearly.getList(props.id, Object.keys(params).length ? params : undefined)

  state.contents = res.data
  state.isLoaded = true
  state.next = res.next
  state.matchingContentsCount = res.matchingContentsCount
  state.totalContentsCount = res.totalContentsCount
}

getList()

watch(
  () => props.limit,
  () => {
    getList()
  }
)
watch(
  () => props.offset,
  () => {
    getList()
  }
)

watch(
  () => props.order,
  () => {
    getList()
  }
)
watch(
  () => props.orderBy,
  () => {
    getList()
  }
)
watch(
  () => props.filterBy,
  () => {
    getList()
  }
)
watch(
  () => props.filterValue,
  () => {
    getList()
  }
)
watch(
  () => props.filterRef,
  () => {
    getList()
  }
)
watch(
  () => props.rangeFrom,
  () => {
    getList()
  }
)
watch(
  () => props.rangeTo,
  () => {
    getList()
  }
)

onBeforeUnmount(() => {
  state.isLoaded = false
})
</script>

<script lang="ts">
export default {
  name: 'SpearlyContentList',
}
</script>
