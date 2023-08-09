import { getCurrentInstance } from 'vue'
import { SpearlyApiClient } from '@spearly/sdk-js'
import type { GetContentParams, GetParams } from '@spearly/sdk-js'

export const useSpearly = () => {
  const app = getCurrentInstance()
  const apiClient = new SpearlyApiClient(app?.appContext.config.globalProperties.apiKey)

  const getContentList = async (contentTypeId: string, params: GetParams) => {
    return await apiClient.getList(contentTypeId, params)
  }

  const getContent = async (contentId: string, params?: GetContentParams) => {
    return await apiClient.getContent(contentId, params)
  }

  const getContentPreview = async (contentId: string, previewToken: string) => {
    return await apiClient.getContentPreview(contentId, previewToken)
  }

  const getFormLatest = async (publicUid: string) => {
    return await apiClient.getFormLatest(publicUid)
  }

  const postFormAnswer = async (
    formVersionId: number,
    fields: { [key: string]: unknown } & { _spearly_gotcha: string }
  ) => {
    return await apiClient.postFormAnswers(formVersionId, fields)
  }

  return { getContentList, getContent, getContentPreview, getFormLatest, postFormAnswer }
}
