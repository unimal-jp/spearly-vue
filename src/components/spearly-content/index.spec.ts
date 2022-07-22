import { mount, VueWrapper } from '@vue/test-utils'
import SpearlyContent from './index.vue'

describe('SpearlyContent', () => {
  let wrapper: VueWrapper
  const getContentMock = jest.fn().mockResolvedValue({})
  const getContentPreviewMock = jest.fn().mockResolvedValue({})

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
      expect(getContentMock).toHaveBeenCalledWith('CONTENT_ID')
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
          },
        },
      })
      expect(getContentPreviewMock).toHaveBeenCalledWith('CONTENT_ID', 'TOKEN')
    })
  })
})
