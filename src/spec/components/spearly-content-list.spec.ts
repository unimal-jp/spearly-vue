import { mount, VueWrapper } from '@vue/test-utils'
import { createUseSpearlyMock } from '../createMock'
import * as composable from '../../composables'
import SpearlyContentList from '../../components/spearly-content-list/index.vue'

const mockResponse = {
  data: [
    {
      attributes: { publicUid: '1' },
      values: { title: 'test' },
    },
    {
      attributes: { publicUid: '2' },
      values: { title: 'test' },
    },
    {
      attributes: { publicUid: '3' },
      values: { title: 'test' },
    },
  ],
  next: 10,
  matchingContentsCount: 150,
  totalContentsCount: 300,
}

describe('SpearlyContentList', () => {
  let wrapper: VueWrapper
  let getListMock = jest.fn().mockReturnValue(Promise.resolve(mockResponse))
  jest.mock('../../composables')

  jest.spyOn(composable, 'useSpearly').mockReturnValue(
    createUseSpearlyMock({
      getContentList: getListMock,
    })
  )
  beforeEach(() => {
    wrapper = mount(SpearlyContentList, {
      props: {
        id: 'CONTENT_TYPE_ID',
      },
      slots: {
        default: {
          template: '<h1>test</h1>',
        },
      },
    })
  })

  afterEach(() => {
    getListMock.mockClear()
  })

  describe('initialized', () => {
    it('snapshot', () => {
      expect(wrapper.element).toMatchSnapshot()
    })

    it('call getList', () => {
      expect(getListMock).toHaveBeenCalledTimes(1)
    })
  })
})
