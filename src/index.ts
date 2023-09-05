import { SpearlyApiClient, SpearlyAnalytics } from '@spearly/sdk-js'
import { SpearlyContentList, SpearlyContent, SpearlyForm } from './components'

export { useSpearly } from './composables'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $spearly: SpearlyApiClient
    $spearlyAnalytics: SpearlyAnalytics
  }
}

export type PluginOptions = {
  apiKey: string
}

const plugin = {
  install(app: any, options: PluginOptions) {
    const apiClient = new SpearlyApiClient(options.apiKey)
    const analytics = new SpearlyAnalytics()

    app.config.globalProperties.$spearly = apiClient
    app.config.globalProperties.$spearlyAnalytics = analytics

    app.provide('$spearly', apiClient)
    app.provide('$spearlyAnalytics', analytics)
    app.component('spearly-content-list', SpearlyContentList)
    app.component('spearly-content', SpearlyContent)
    app.component('spearly-form', SpearlyForm)
  },
}

export const SpearlyPlugin = plugin
