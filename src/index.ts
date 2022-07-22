import { SpearlyApiClient } from '@spearly/sdk-js'
import { SpearlyContentList, SpearlyContent, SpearlyForm } from './components'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $spearly: SpearlyApiClient
  }
}

export type PluginOptions = {
  apiKey: string
}

const plugin = {
  install(app: any, options: PluginOptions) {
    const apiClient = new SpearlyApiClient('api.spearly.com', options.apiKey)
    app.config.globalProperties.$spearly = apiClient
    app.provide('$spearly', apiClient)
    app.component('spearly-content-list', SpearlyContentList)
    app.component('spearly-content', SpearlyContent)
    app.component('spearly-form', SpearlyForm)
  },
}

export const SpearlyPlugin = plugin
