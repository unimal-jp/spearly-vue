# @spearly/vue

This package allows you to easily implement Spearly in your vue project!

[![Spec Test](https://github.com/unimal-jp/spearly-vue/actions/workflows/spec.yml/badge.svg)](https://github.com/unimal-jp/spearly-vue/actions/workflows/spec.yml)

## Getting Started

### Install

```
// npm
$ npm i -S @spearly/vue

// yarn
$ yarn add @spearly/vue
```

### Setup

#### main.[j|t]s
```ts
import { createApp } from 'vue'
import { SpearlyPlugin } from '@spearly/vue'
import App from './App.vue'

const app = createApp(App)

app.use(SpearlyPlugin, { apiKey: 'SPEARLY_API_KEY' })
```

## How to use

### Components

#### Content List

```vue
<template>
  <spearly-content-list id="CONTENT_TYPE_ID">
      <template v-slot="item">
        <nuxt-link :to="`/${item.content.attributes.publicUid}`">
          {{ item.content.values.title }}
        </nuxt-link>
      </template>
    </spearly-content-list>
</template>

<script>
export default {}
</script>
```

##### use Custom Components

- Make the wrapper its custom component: Specify a component name for `wrapper` prop.
- Make the items its custom component: Specify a component name for `item` prop.

```vue
<template>
  <spearly-content-list wrapper="Wrapper" item="ListItem" id="CONTENT_TYPE_ID">
      <template v-slot="item">
        <nuxt-link :to="`/${item.content.attributes.publicUid}`">
          {{ item.content.values.title }}
        </nuxt-link>
      </template>
    </spearly-content-list>
</template>

<script>
export default {}
</script>
```

##### use Show Loading

Specify a component name for `loading` prop.

```vue
<template>
  <spearly-content-list loading="Loading" id="CONTENT_TYPE_ID">
      <template v-slot="item">
        <nuxt-link :to="`/${item.content.attributes.publicUid}`">
          {{ item.content.values.title }}
        </nuxt-link>
      </template>
    </spearly-content-list>
</template>

<script>
export default {}
</script>
```

##### Advanced props

- `limit` (number, 10)
- `offset` (number, 0)
- `order` ('desc' | 'asc', 'desc')
- `order-by` ('latest' | 'popular' | string)
- `orders` ( { [fieldId: string]: 'desc' | 'asc' } )
- `filter-by` (string)
- `filter-value` (string | string[])
- `filter-ref` (string)
- `filters` ( { [fieldId: string]: string | string[] } )
- `filter-mode` ('or' | 'and')
- `range-to` (string)
- `range-from` (string)
- `session-id` (string)
- `pattern-name` ('a' | 'b')
- `wrapper` (string | Vue)
- `item` (string | Vue)
- `loading` (Vue)

##### pager slot

The `pager` slot is a slot for creating paginations.
Since the `pager slot has a `paging` scope, you can freely create paginations with it.

- `limit` (number) : The same number as the limit property for the component
- `offset` (number) : The same number as the offset property for the component
- `next` (number) : Indicates the number of offsets on the next page
- `matchingContentsCount` (number) : Indicates the total number of articles narrowed down by filters, etc
- `totalContentsCount` (number) : Indicates the total number of articles registered for the content type

```vue
<template>
  <spearly-content-list id="CONTENT_TYPE_ID">
      <template v-slot="item">
        <nuxt-link :to="`/${item.content.attributes.publicUid}`">
          {{ item.content.values.title }}
        </nuxt-link>
      </template>
      <template #pager="data">
        <button v-if="data.paging.offset > 0" @click="offset -= 10">Previous</button>
        <button v-if="data.paging.next > 0" @click="offset += 10">Next</button>
      </template>
    </spearly-content-list>
</template>

<script>
export default {}
</script>
```

#### Content

> **Warning**  
> `content-type-id` props have been required since v0.7.0

```vue
<template>
  <spearly-content content-type-id="CONTENT_TYPE_ID" id="CONTENT_PUBLIC_UID">
    <template v-slot="content">
      <header>
        <h1>{{ content.values.title }}</h1>
      </header>
      <div v-html="content.values.body" />
    </template>
  </spearly-content>
</template>

<script>
export default {}
</script>
```

##### props

- `pattern-name` ('a' | 'b')

##### use Show Loading

Specify a component name for `loading` prop.

```vue
<template>
  <spearly-content loading="Loading" content-type-id="CONTENT_TYPE_ID" id="CONTENT_PUBLIC_UID">
    <template v-slot="content">
      <header>
        <h1>{{ content.values.title }}</h1>
      </header>
      <div v-html="content.values.body" />
    </template>
  </spearly-content>
</template>

<script>
export default {}
</script>
```

##### show Preview

You can preview the draft content by specifying `preview-token` and `id`.

```vue
<template>
  <spearly-content content-type-id="CONTENT_TYPE_ID" :id="$route.query.content_id" :preview-token="$route.query.preview_token">
    <template v-slot="content">
      <header>
        <h1>{{ content.values.title }}</h1>
      </header>
      <div v-html="content.values.body" />
    </template>
  </spearly-content>
</template>

<script>
export default {}
</script>
```

#### Form

```vue
<template>
  <spearly-form id="FORM_ID" />
</template>

<script>
export default {}
</script>
```

##### Advanced form

```vue
<template>
  <spearly-form id="FORM_ID">
    <template v-slot="form">
      <fieldset v-for="field in form.fields" :key="field.identifier">
        <label :for="['radio', 'checkbox'].includes(field.inputType) ? null : field.identifier">
          {{ field.name }}
          <i v-if="field.required">*</i>
        </label>

        <input
          :id="field.identifier"
          v-model="answers[field.identifier]"
          :required="field.required"
          :aria-describedby="field.description ? `${field.identifier}-description` : null"
          type="text"
        />
      </fieldset>
      ...
      <input v-model="answers._spearly_gotcha" type="text" style="position: absolute; width: 1px; height: 1px; overflow: hidden;" />
      <button @click="form.submit(answers)">Submit</button> // form.submit is the method to submit the spearly form.
    </template>
  </spearly-form>
</template>

<script>
export default {
  data() {
    return {
      answers: {
        YOUR_FORM_FIELD_ID: '',
        ...,
        _spearly_gotcha: '',
      }
    }
  }
}
</script>
```

##### use Show Loading

Specify a component name for `loading` prop.

```vue
<template>
  <spearly-form loading="Loading" id="FORM_ID" />
</template>

<script>
export default {}
</script>
```

### Composable

We provide composable functions to get content from Spearly CMS and to send A/B test impressions and conversions.


#### getContentList

```ts
import { useSpearly } from "@spearly/vue"

const spearly = useSpearly()

const contentList = await spearly.getContentList(CONTENT_TYPE_ID, PARAMS)
```

- `CONTENT_TYPE_ID` (string) : Specify the ID of the content type in Spearly CMS.
- `PARAMS` (Object) : Optional. Specify an Object that contains the following.
  - `limit` (number, 10)
  - `offset` (number, 0)
  - `order` ('desc' | 'asc', 'desc')
  - `order-by` ('latest' | 'popular' | string)
  - `orders` ( { [fieldId: string]: 'desc' | 'asc' } )
  - `filter-by` (string)
  - `filter-value` (string | string[])
  - `filter-ref` (string)
  - `filters` ( { [fieldId: string]: string | string[] } )
  - `filter-mode` ('or' | 'and')
  - `range-to` (string)
  - `range-from` (string)
  - `session-id` (string)
  - `pattern-name` ('a' | 'b')

#### getContent

```ts
import { useSpearly } from "@spearly/vue"

const spearly = useSpearly()

const content = await spearly.getContent(CONTENT_TYPE_ID, CONTENT_ID, PARAMS)
```

- `CONTENT_TYPE_ID` (string) : Specify the ID of the content type that contains the content in Spearly CMS.
- `CONTENT_ID` (string) : Specify the alias of the content in Spearly CMS.
- `PARAMS` (Object) : Optional. Specify an Object that contains the following.
  - `patternName` ('a' | 'b'): Use this when you want to get a fixed pattern when A/B testing is enabled.

#### getContentPreview

```ts
import { useSpearly } from "@spearly/vue"

const spearly = useSpearly()

const content = await spearly.getContent(CONTENT_TYPE_ID, CONTENT_ID, PREVIEW_TOKEN)
```

- `CONTENT_TYPE_ID` (string) : Specify the ID of the content type that contains the content in Spearly CMS.
- `CONTENT_ID` (string) : Specify the alias of the content in Spearly CMS.
- `PREVIEW_TOKEN` (string) : Specify the preview token published by Spearly CMS.


#### getFormLatest

```ts
import { useSpearly } from "@spearly/vue"

const spearly = useSpearly()

const form = await spearly.getFormLatest(FORM_PUBLIC_UID)
```

- `FORM_PUBLIC_UID` (string) : Specify the form public uid in Spearly CMS.

#### postFormAnswer

```ts
import { useSpearly } from "@spearly/vue"

const spearly = useSpearly()

const onSubmit = async () => {
  await spearly.postFormAnswer(FIELDS, FORM_VERSION_ID)
}
```

- `FIELDS` (Record<string, unknown>) : Specify an Object with the form field ID as key and the input content as value. You must also specify `_spearly_gotcha: ""` .
- `FORM_VERSION_ID` (string) : Optional. Specify if you want to send to a version that is not the latest.

#### pageView

This function must wait for getContent to resolve.

```ts
import { useSpearly } from "@spearly/vue"

const spearly = useSpearly()
const content = await spearly.getContent(CONTENT_TYPE_ID, CONTENT_ID);

await spearly.pageView()

// If you want send to a different pattern
await spearly.pageView(CONTENT_ID, PATTERN_NAME)
```

- `CONTENT_ID` (string) : Optional. Specify if you want to send an ID different from the content ID obtained with the `getContent` function.
- `PATTERN_NAME` ('a' | 'b') : Optional. Specify if you want to send a pattern different from the pattern obtained with the `getContent` function.

#### conversion

This function must wait for getContent to resolve.

```ts
import { useSpearly } from "@spearly/vue"

const spearly = useSpearly()
const content = await spearly.getContent(CONTENT_TYPE_ID, CONTENT_ID);

const onSubmit = async () => {
  await spearly.conversion()

  // If you want send to a different pattern
  await spearly.conversion(CONTENT_ID, PATTERN_NAME)
}
```

- `CONTENT_ID` (string) : Optional. Specify if you want to send an ID different from the content ID obtained with the `getContent` function.
- `PATTERN_NAME` ('a' | 'b') : Optional. Specify if you want to send a pattern different from the pattern obtained with the `getContent` function.

### Provide data

The following two data are provide.

- `$spearly` : API Client for get content list, form submission, etc.
- `$spearlyAnalytics` : Used to send pageView (impressions) and conversions required for A/B Testing

### A/B Testing analytics

> **Warning**  
> A/B Testing does not support SSR, only SPA can use this feature.  
> We are working on it now, so please wait for a while.

#### Impression

If you are using the SpearlyContent component, you do not need to do anything special. The component will send the impression for you.

If you wish to send your own, you can do so with the following code:

```js
const $spearlyAnalytics = inject('$spearlyAnalytics')

await $spearlyAnalytics.pageView({
  contentId: CONTENT_ID,
  patternName: 'a' or 'b',
})
```

#### Conversion

If you are using A/B testing, you can count conversions by using the conversion method as follows

```js
const $spearlyAnalytics = inject('$spearlyAnalytics')

const handleSubmit = async () => {
  await $spearlyAnalytics.conversion({
    contentId: CONTENT_ID,
    patternName: 'a' or 'b',
  })
}
```
