import { SpearlyApiClient } from '@spearly/sdk-js'
import { useSpearly } from '../../composables'
import { createContentListMock, createContentMock, createFormMock, createFormAnswerResponse } from '../createMock'

describe('spearly composable', () => {
  const spearly = useSpearly()

  it('Should return 5 functions', () => {
    expect(Object.keys(spearly).length).toBe(5)
  })

  describe('getContentList', () => {
    let spyGetList: jest.SpyInstance

    beforeEach(() => {
      spyGetList = jest.spyOn(SpearlyApiClient.prototype, 'getList').mockResolvedValue(createContentListMock())
    })

    afterEach(() => {
      spyGetList.mockClear()
    })

    it('Should be requested with specified arguments', () => {
      spearly.getContentList('CONTENT_TYPE_ID', { limit: 100, patternName: 'b' })
      expect(spyGetList).toHaveBeenCalledWith('CONTENT_TYPE_ID', { limit: 100, patternName: 'b' })
    })

    it('Should be return content', async () => {
      const res = await spearly.getContentList('CONTENT_TYPE_ID', { limit: 100, patternName: 'b' })
      expect(res).toEqual(createContentListMock())
    })
  })

  describe('getContent', () => {
    let spyGetContent: jest.SpyInstance

    beforeEach(() => {
      spyGetContent = jest.spyOn(SpearlyApiClient.prototype, 'getContent').mockResolvedValue(createContentMock())
    })

    afterEach(() => {
      spyGetContent.mockClear()
    })

    it('Should be requested with specified arguments', () => {
      spearly.getContent('CONTENT_ID', { distinctId: 'DISTINCT_ID' })
      expect(spyGetContent).toHaveBeenCalledWith('CONTENT_ID', { distinctId: 'DISTINCT_ID' })
    })

    it('Should be return content', async () => {
      const res = await spearly.getContent('CONTENT_ID')
      expect(res).toEqual(createContentMock())
    })
  })

  describe('getContentPreview', () => {
    let spyGetContentPreview: jest.SpyInstance

    beforeEach(() => {
      spyGetContentPreview = jest
        .spyOn(SpearlyApiClient.prototype, 'getContentPreview')
        .mockResolvedValue(createContentMock())
    })

    afterEach(() => {
      spyGetContentPreview.mockClear()
    })

    it('Should be requested with specified arguments', () => {
      spearly.getContentPreview('CONTENT_ID', 'PREVIEW_TOKEN')
      expect(spyGetContentPreview).toHaveBeenCalledWith('CONTENT_ID', 'PREVIEW_TOKEN')
    })

    it('Should be return content', async () => {
      const res = await spearly.getContentPreview('CONTENT_ID', 'PREVIEW_TOKEN')
      expect(res).toEqual(createContentMock())
    })
  })

  describe('getFormLatest', () => {
    let spyGetFormLatest: jest.SpyInstance

    beforeEach(() => {
      spyGetFormLatest = jest.spyOn(SpearlyApiClient.prototype, 'getFormLatest').mockResolvedValue(createFormMock())
    })

    afterEach(() => {
      spyGetFormLatest.mockClear()
    })

    it('Should be return content', async () => {
      const res = await spearly.getFormLatest('FORM_ID')
      expect(res).toEqual(createFormMock())
    })
  })

  describe('postFormAnswer', () => {
    let spyPostFormAnswer: jest.SpyInstance

    beforeEach(() => {
      spyPostFormAnswer = jest
        .spyOn(SpearlyApiClient.prototype, 'postFormAnswers')
        .mockResolvedValue(createFormAnswerResponse())
    })

    afterEach(() => {
      spyPostFormAnswer.mockClear()
    })

    it('Should be return form answered', async () => {
      const res = await spearly.postFormAnswer(1, { name: 'name', _spearly_gotcha: '' })
      expect(res).toEqual(createFormAnswerResponse())
    })
  })
})
