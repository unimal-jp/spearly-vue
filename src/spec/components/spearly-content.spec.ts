import { mount, VueWrapper } from '@vue/test-utils'
import * as composable from '../../composables'
import SpearlyContent from '../../components/spearly-content/index.vue'
import { createUseSpearlyMock } from '../createMock'

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
    jest.mock('../../composables')

    jest.spyOn(composable, 'useSpearly').mockReturnValue(
      createUseSpearlyMock({
        getContent: getContentMock,
        getContentPreview: getContentPreviewMock,
      })
    )

    wrapper = mount(SpearlyContent, {
      props: {
        contentTypeId: 'CONTENT_TYPE_ID',
        id: 'CONTENT_ID',
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
      expect(getContentMock).toHaveBeenCalledWith('CONTENT_TYPE_ID', 'CONTENT_ID', {})
    })

    it('call getContentPreview if preview-token prop is specified', () => {
      wrapper = mount(SpearlyContent, {
        props: {
          contentTypeId: 'CONTENT_TYPE_ID',
          id: 'CONTENT_ID',
          previewToken: 'TOKEN',
        },
      })
      expect(getContentPreviewMock).toHaveBeenCalledWith('CONTENT_TYPE_ID', 'CONTENT_ID', 'TOKEN')
    })
  })
})
