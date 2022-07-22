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

  describe('loaded display', () => {
    it('display items', async () => {
      await flushPromises()
      expect(wrapper.findAll('h1').length).toBe(3)
    })
  })

  describe('customize view', () => {
    it('loading prop', async () => {
      wrapper = mount(SpearlyContentList, {
        props: {
          id: 'CONTENT_TYPE_ID',
        },
        global: {
          provide: {
            $spearly: new SpearlyApiClient('', ''),
          },
        },
      })

      const Loading = {
        template: '<div>Now Loading...</div>',
      }
      await wrapper.setProps({ loading: Loading })
      expect(wrapper.text()).toBe('Now Loading...')
    })

    it('wrapper prop', async () => {
      const Wrapper = {
        template: '<div class="test"><slot /></div>',
      }
      await wrapper.setProps({ wrapper: Wrapper })
      const div = wrapper.find('.test')
      expect(div).toBeInstanceOf(DOMWrapper)
    })

    it('item prop', async () => {
      const Item = {
        template: '<div class="test"><slot /></div>',
      }
      await wrapper.setProps({ item: Item })
      const div = wrapper.find('.test')
      expect(div).toBeInstanceOf(DOMWrapper)
    })
  })

  describe('get list when props is changed', () => {
    it('limit', async () => {
      await wrapper.setProps({ limit: 20 })
      expect(getListMock).toHaveBeenCalledWith('CONTENT_TYPE_ID', { limit: 20 })
    })

    it('offset', async () => {
      await wrapper.setProps({ offset: 20 })
      expect(getListMock).toHaveBeenCalledWith('CONTENT_TYPE_ID', { offset: 20 })
    })

    it('order', async () => {
      await wrapper.setProps({ order: 'asc' })
      expect(getListMock).toHaveBeenCalledWith('CONTENT_TYPE_ID', { order: 'asc' })
    })

    it('orderBy', async () => {
      await wrapper.setProps({ orderBy: 'popular' })
      expect(getListMock).toHaveBeenCalledWith('CONTENT_TYPE_ID', { orderBy: 'popular' })
    })

    it('filterBy / filterValue / filterRef', async () => {
      await wrapper.setProps({ filterBy: 'test', filterValue: 'value' })
      expect(getListMock).toHaveBeenCalledWith('CONTENT_TYPE_ID', { filterBy: 'test', filterValue: 'value' })
      await wrapper.setProps({ filterBy: 'test', filterValue: 'value', filterRef: 'ref' })
      expect(getListMock).toHaveBeenCalledWith('CONTENT_TYPE_ID', {
        filterBy: 'test',
        filterValue: 'value',
        filterRef: 'ref',
      })
    })

    it('rangeTo', async () => {
      await wrapper.setProps({ rangeTo: new Date('2022-06-06') })
      expect(getListMock).toHaveBeenCalledWith('CONTENT_TYPE_ID', { rangeTo: new Date('2022-06-06') })
    })

    it('rangeFrom', async () => {
      await wrapper.setProps({ rangeFrom: new Date('2022-06-06') })
      expect(getListMock).toHaveBeenCalledWith('CONTENT_TYPE_ID', { rangeFrom: new Date('2022-06-06') })
    })
  })
})
