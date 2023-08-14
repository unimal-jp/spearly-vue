import { SpearlyApiClient, SpearlyAnalytics } from '@spearly/sdk-js'
import { useSpearly } from '../../composables'
import { createContentListMock, createContentMock, createFormMock, createFormAnswerResponse } from '../createMock'

describe('spearly composable', () => {
  const spearly = useSpearly()

  it('Should return 7 functions', () => {
    expect(Object.keys(spearly).length).toBe(7)
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
    const fields = { name: 'name', _spearly_gotcha: '' }
    let spyPostFormAnswer: jest.SpyInstance

    beforeEach(() => {
      jest.spyOn(SpearlyApiClient.prototype, 'getFormLatest').mockResolvedValue(createFormMock())
      spyPostFormAnswer = jest
        .spyOn(SpearlyApiClient.prototype, 'postFormAnswers')
        .mockResolvedValue(createFormAnswerResponse())
    })

    afterEach(() => {
      spyPostFormAnswer.mockClear()
    })

    it('Should be return form answered', async () => {
      const res = await spearly.postFormAnswer({ name: 'name', _spearly_gotcha: '' }, 1)
      expect(res).toEqual(createFormAnswerResponse())
    })

    it('Version should be able to send form using response if not specified', async () => {
      await spearly.getFormLatest('FORM_ID')
      await spearly.postFormAnswer(fields)
      expect(spyPostFormAnswer).toHaveBeenCalledWith(1, fields)
    })

    it('If you specify a version, should be submit the form with that version', async () => {
      await spearly.postFormAnswer(fields, 15)
      expect(spyPostFormAnswer).toHaveBeenCalledWith(15, fields)
    })

    it('Should throw an error with no version id', () => {
      const newSpearly = useSpearly()
      expect(() => newSpearly.postFormAnswer(fields)).rejects.toThrowError(new Error('version ID is not specified'))
    })
  })

  describe('Analytics', () => {
    describe('PageView', () => {
      let spyPageView: jest.SpyInstance

      beforeEach(() => {
        spyPageView = jest.spyOn(SpearlyAnalytics.prototype, 'pageView').mockResolvedValue()
        jest.spyOn(SpearlyApiClient.prototype, 'getContent').mockResolvedValue(createContentMock())
      })

      afterEach(() => {
        jest.clearAllMocks()
      })

      it('Pageview should send the specified params', async () => {
        await spearly.pageView('SPECIFIED_CONTENT_ID', 'b')
        expect(spyPageView).toHaveBeenCalledWith({ patternName: 'b', contentId: 'SPECIFIED_CONTENT_ID' })
      })

      it('If params is not specified, ID and patternName obtained by getContent should be used', async () => {
        await spearly.getContent('CONTENT_ID')
        await spearly.pageView()
        expect(spyPageView).toHaveBeenCalledWith({ patternName: 'b', contentId: '1' })
      })

      it('if "contentId" is not in either, it should be an error', async () => {
        const newSpearly = useSpearly()
        expect(() => newSpearly.pageView()).rejects.toThrowError(new Error('contentId is not defined.'))
      })

      it('if "patternName" is not in either, it should be an error', () => {
        const newSpearly = useSpearly()
        expect(() => newSpearly.pageView('CONTENT_ID')).rejects.toThrowError(new Error('patternName is not defined.'))
      })
    })
  })

  describe('Conversion', () => {
    let spyConversion: jest.SpyInstance

    beforeEach(() => {
      spyConversion = jest.spyOn(SpearlyAnalytics.prototype, 'conversion').mockResolvedValue()
    })

    it('Pageview should send the specified params', async () => {
      await spearly.conversion('SPECIFIED_CONTENT_ID', 'b')
      expect(spyConversion).toHaveBeenCalledWith({ patternName: 'b', contentId: 'SPECIFIED_CONTENT_ID' })
    })

    it('If params is not specified, ID and patternName obtained by getContent should be used', async () => {
      await spearly.getContent('CONTENT_ID')
      await spearly.conversion()
      expect(spyConversion).toHaveBeenCalledWith({ patternName: 'b', contentId: '1' })
    })

    it('if "contentId" is not in either, it should be an error', async () => {
      const newSpearly = useSpearly()
      expect(() => newSpearly.conversion()).rejects.toThrowError(new Error('contentId is not defined.'))
    })

    it('if "patternName" is not in either, it should be an error', () => {
      const newSpearly = useSpearly()
      expect(() => newSpearly.conversion('CONTENT_ID')).rejects.toThrowError(new Error('patternName is not defined.'))
    })
  })
})
