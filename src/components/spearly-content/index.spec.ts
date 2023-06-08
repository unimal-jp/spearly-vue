import { mount, VueWrapper } from '@vue/test-utils'
import SpearlyContent from './index.vue'

describe('SpearlyContent', () => {
  let wrapper: VueWrapper
  const getContentMock = jest.fn().mockResolvedValue({
    attributes: {
      patternName: 'a',
    },
    id: '1',
  })
  const getContentPreviewMock = jest.fn().mockResolvedValue({})
  const pageViewMock = jest.fn().mockResolvedValue({})

  beforeEach(() => {
    wrapper = mount(SpearlyContent, {
      props: {
        id: 'CONTENT_ID',
      },
      global: {
        provide: {
          $spearly: {
            getContent: getContentMock,
            getContentPreview: getContentPreviewMock,
          },
          $spearlyAnalytics: {
            pageView: pageViewMock,
          },
        },
      },
    })
  })

  afterEach(() => {
    getContentMock.mockClear()
    getContentPreviewMock.mockClear()
  })

  describe('initialized', () => {
    it('snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })

  describe('get content', () => {
    it('call getContent if preview-token prop is not specified', () => {
      expect(getContentMock).toHaveBeenCalledWith('CONTENT_ID', {})
    })

    it('call getContentPreview if preview-token prop is specified', () => {
      wrapper = mount(SpearlyContent, {
        props: {
          id: 'CONTENT_ID',
          previewToken: 'TOKEN',
        },
        global: {
          provide: {
            $spearly: {
              getContent: getContentMock,
              getContentPreview: getContentPreviewMock,
            },
            $spearlyAnalytics: {
              pageView: pageViewMock,
            },
          },
        },
      })
      expect(getContentPreviewMock).toHaveBeenCalledWith('CONTENT_ID', 'TOKEN')
    })
  })
})
