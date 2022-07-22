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

### Content List

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

#### use Custom Components

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

#### use Show Loading

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

#### Advanced props

- `limit` (number, 10)
- `offset` (number, 0)
- `order` ('desc' | 'asc', 'desc')
- `order-by` ('latest' | 'popular' | string)
- `filter-by` (string)
- `filter-value` (string)
- `filter-ref` (string)
- `range-to` (string)
- `range-from` (string)
- `wrapper` (string | Vue)
- `item` (string | Vue)
- `loading` (Vue)

#### pager slot

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

### Content

```vue
<template>
  <spearly-content id="CONTENT_PUBLIC_UID">
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

#### use Show Loading

Specify a component name for `loading` prop.

```vue
<template>
  <spearly-content loading="Loading" id="CONTENT_PUBLIC_UID">
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

#### show Preview

You can preview the draft content by specifying `preview-token` and `id`.

```vue
<template>
  <spearly-content :id="$route.query.content_id" :preview-token="$route.query.preview_token">
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

### Form

```vue
<template>
  <spearly-form id="FORM_ID" />
</template>

<script>
export default {}
</script>
```

#### Advanced form

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

#### use Show Loading

Specify a component name for `loading` prop.

```vue
<template>
  <spearly-form loading="Loading" id="FORM_ID" />
</template>

<script>
export default {}
</script>
```
