import { mount, flushPromises, VueWrapper, DOMWrapper } from '@vue/test-utils'
import { SpearlyApiClient } from '@spearly/sdk-js'
import SpearlyContentList from './index.vue'

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
      global: {
        provide: {
          $spearly: {
            getList: getListMock,
          },
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
