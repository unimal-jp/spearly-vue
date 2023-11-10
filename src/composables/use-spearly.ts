import { ref, getCurrentInstance } from 'vue'
import { SpearlyApiClient, SpearlyAnalytics } from '@spearly/sdk-js'
import type { GetContentParams, GetParams } from '@spearly/sdk-js'

export const useSpearly = () => {
  const app = getCurrentInstance()
  const apiClient = new SpearlyApiClient(app?.appContext.config.globalProperties.apiKey)
  const analytics = new SpearlyAnalytics()

  const contentId = ref<string>()
  const contentPatternName = ref<'a' | 'b'>()
  const formVersion = ref<number>()

  const getContentList = async (contentTypeId: string, params?: GetParams) => {
    return await apiClient.getList(contentTypeId, params)
  }

  const getContent = async (contentTypeId: string, id: string, params?: GetContentParams) => {
    const response = await apiClient.getContent(contentTypeId, id, params)
    contentId.value = response.id
    contentPatternName.value = response.attributes.patternName
    return response
  }

  const getContentPreview = async (contentTypeId: string, id: string, previewToken: string) => {
    return await apiClient.getContentPreview(contentTypeId, id, previewToken)
  }

  const getFormLatest = async (publicUid: string) => {
    const response = await apiClient.getFormLatest(publicUid)
    formVersion.value = response.id
    return response
  }

  const postFormAnswer = async (
    fields: { [key: string]: unknown } & { _spearly_gotcha: string },
    formVersionId?: number
  ) => {
    if (!formVersionId && !formVersion.value) throw new Error('version ID is not specified')
    return await apiClient.postFormAnswers(formVersionId || formVersion.value!, fields)
  }

  const pageView = async (id?: string, patternName?: 'a' | 'b') => {
    const submitData = {
      contentId: id || contentId.value,
      patternName: patternName || contentPatternName.value,
    }

    if (!submitData.contentId) throw new Error('contentId is not defined.')
    if (!submitData.patternName) throw new Error('patternName is not defined.')

    await analytics.pageView({
      contentId: submitData.contentId,
      patternName: submitData.patternName,
    })
  }

  const conversion = async (id?: string, patternName?: 'a' | 'b') => {
    const submitData = {
      contentId: id || contentId.value,
      patternName: patternName || contentPatternName.value,
    }

    if (!submitData.contentId) throw new Error('contentId is not defined.')
    if (!submitData.patternName) throw new Error('patternName is not defined.')

    await analytics.conversion({
      contentId: submitData.contentId,
      patternName: submitData.patternName,
    })
  }

  return { getContentList, getContent, getContentPreview, getFormLatest, postFormAnswer, pageView, conversion }
}
