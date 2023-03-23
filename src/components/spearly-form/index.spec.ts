import { mount, flushPromises, VueWrapper } from '@vue/test-utils'
import SpearlyForm from './index.vue'

const getFormLatestMockData = {
  id: 1,
  publicUid: 'public_1',
  identifier: 'form',
  name: 'Contact Form',
  description: 'this is contact form.',
  thankYouMessage: 'Thank you for message.',
  confirmationEmail: {
    enabled: true,
    name: 'e-mail',
    description: 'description',
  },
  confirmationScreen: {
    enabled: true,
    backButtonLabel: 'back',
    submitButtonLabel: 'submit',
  },
  fields: [
    {
      identifier: 'name',
      description: '',
      inputType: 'text',
      name: 'Name',
      order: 1,
      required: false,
    },
    {
      identifier: 'tel',
      description: 'Please fill your phone number.',
      inputType: 'tel',
      name: 'Phone',
      order: 1,
      required: false,
    },
    {
      data: {
        options: ['1', '2'],
      },
      description: 'Please choice your contact subject',
      identifier: 'subject',
      inputType: 'radio',
      name: 'Subject',
      order: 3,
      required: false,
    },
    {
      identifier: 'content',
      inputType: 'text_area',
      description: '',
      name: 'Content',
      order: 4,
      required: true,
    },
  ],
  callbackUrl: '',
  startedAt: null,
  endedAt: null,
  createdAt: new Date('2022-06-06'),
}

const getFormLatestDefaultMock = jest.fn().mockResolvedValue(getFormLatestMockData)
const postFormAnswerDefaultMock = jest.fn().mockResolvedValue({})

const wrapperFactory = (
  props = { id: 'FORM_ID' },
  getFormLatestMock: jest.Mock = getFormLatestDefaultMock,
  postFormAnswersMock: jest.Mock = postFormAnswerDefaultMock,
  defaultSlots: any = null
) => {
  const options: any = {
    props,
    global: {
      provide: {
        $spearly: {
          getFormLatest: getFormLatestMock,
          postFormAnswers: postFormAnswersMock,
        },
      },
    },
  }

  if (defaultSlots) options.slots = { default: defaultSlots }

  const wrapper = mount(SpearlyForm, options)

  return {
    getFormLatestMock,
    postFormAnswersMock,
    wrapper,
  }
}

describe('SpearlyForm', () => {
  describe('initialized', () => {
    it('snapshot', () => {
      const { wrapper } = wrapperFactory()
      expect(wrapper.element).toMatchSnapshot()
    })

    it('should be getting the latest data with getFormLatest', async () => {
      const { wrapper, getFormLatestMock } = wrapperFactory()
      await flushPromises()
      expect(getFormLatestMock).toHaveBeenCalledWith('FORM_ID')
      expect((wrapper.vm.$ as any).setupState.state.form.id).toBe(1)
    })
  })

  describe('default view', () => {
    let wrapper: VueWrapper
    let postFormAnswersMock: jest.Mock

    beforeEach(() => {
      const res = wrapperFactory()
      wrapper = res.wrapper
      postFormAnswersMock = res.postFormAnswersMock
    })

    it('display form name', () => {
      expect(wrapper.find('.spearly-form-title').text()).toBe('Contact Form')
    })

    it('display form description', () => {
      expect(wrapper.find('.spearly-form-description').text()).toBe('this is contact form.')
    })

    describe('display period', () => {
      it('if neither started-at nor ended-at props is specified, no DOM is created', () => {
        expect(wrapper.findAll('.spearly-form-period')).toEqual([])
      })

      it('display text if started-at or ended-at props is set', async () => {
        const res = wrapperFactory(
          { id: 'FORM_ID' },
          jest.fn().mockResolvedValue(
            Object.assign({}, getFormLatestMockData, {
              startedAt: new Date('2022-01-01 10:00'),
              endedAt: new Date('2022-12-31 23:00'),
            })
          )
        )
        await flushPromises()
        expect(res.wrapper.find('.spearly-form-period').text()).toBe(
          'このフォームの受付期間は2022/01/01 10:00〜2022/12/31 23:00です。'
        )
      })
    })

    describe('display out of period', () => {
      let nowMock: jest.Mock
      let wrapper: VueWrapper

      beforeEach(() => {
        nowMock = jest.fn(() => 1640919600000)
        const res = wrapperFactory(
          { id: 'FORM_ID' },
          jest.fn().mockResolvedValue(
            Object.assign({}, getFormLatestMockData, {
              startedAt: new Date('2022-01-01 10:00'),
              endedAt: new Date('2022-12-31 23:00'),
            })
          )
        )
        Date.now = nowMock
        wrapper = res.wrapper
      })

      afterEach(() => {
        nowMock.mockReset()
        nowMock.mockRestore()
      })

      it('show text', () => {
        expect(wrapper.find('.spearly-form-outside').text()).toBe('このフォームは現在受付期間外です。')
      })

      it('submit button should be disabled', () => {
        expect(wrapper.find('.spearly-form-submit').attributes('disabled')).toBe('')
      })
    })

    describe('display fields', () => {
      describe('label', () => {
        it('show label', () => {
          expect(wrapper.findAll('.spearly-form-label')[1].text()).toBe('Name')
        })

        it('if required field, show required mark', () => {
          expect(wrapper.findAll('.spearly-form-label')[4].find('.spearly-form-label-required').text()).toBe('*')
        })
      })

      describe('description', () => {
        it('if description is set, show description text', () => {
          const $description = wrapper.findAll('.spearly-form-fieldset')[2].find('.spearly-form-field-description')
          expect($description.text()).toBe('Please fill your phone number.')
          expect($description.attributes('id')).toBe('tel-description')
        })

        it('if description is set, aria-describedby should be specified for input element', () => {
          expect(
            wrapper.findAll('.spearly-form-fieldset')[2].find('.spearly-form-input').attributes('aria-describedby')
          ).toBe('tel-description')
        })

        it('if no description is set, no DOM is created', () => {
          expect(wrapper.findAll('.spearly-form-fieldset')[1].findAll('.spearly-form-field-description')).toEqual([])
        })

        it('if no description is set, aria-describedby should not be specified for input element', () => {
          expect(
            wrapper.findAll('.spearly-form-fieldset')[1].find('.spearly-form-input').attributes('aria-describedby')
          ).toBeUndefined()
        })
      })

      it('elements should be displayed according to inputType', () => {
        expect(wrapper.findAll('.spearly-form-input').length).toBe(3)
        expect(wrapper.findAll('.spearly-form-radio').length).toBe(2)
        expect(wrapper.findAll('.spearly-form-textarea').length).toBe(1)
      })
    })

    describe('submit button action', () => {
      it('if everything has been filled, move to the confirmation screen', async () => {
        wrapper.findAll('.spearly-form-input')[0].setValue('test@example.com')
        wrapper.findAll('.spearly-form-input')[1].setValue('example name')
        wrapper.findAll('.spearly-form-textarea')[0].setValue('text')
        wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        expect(wrapper.findAll('.spearly-form-answer-confirm').length).toBe(5)
      })
    })

    describe('form validation', () => {
      it('error text should be displayed if all required fields are not filled in', async () => {
        wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        expect(wrapper.find('.spearly-form-field-error').text()).toBe('入力してください。')
        expect(wrapper.find('.spearly-form-error').text()).toBe('入力されていない項目があります。')
      })

      it('if the value in the email field is not an email, an error should be displayed', async () => {
        const latestMock = Object.assign({}, getFormLatestMockData, {
          fields: [
            {
              identifier: 'email',
              inputType: 'email',
              name: 'Email',
              order: 1,
              required: false,
            },
          ],
        })
        wrapper = wrapperFactory({ id: 'id' }, jest.fn().mockResolvedValue(latestMock)).wrapper
        await flushPromises()
        wrapper.findAll('.spearly-form-input[type="email"]')[0].setValue('test')
        wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        expect(wrapper.find('.spearly-form-error').text()).toBe('入力されていない項目があります。')
        expect(wrapper.findAll('.spearly-form-field-error')[0].text()).toBe('メールアドレスの形式で入力してください。')
      })

      it('if the value in the tel field is not an tel, an error should be displayed', async () => {
        const latestMock = Object.assign({}, getFormLatestMockData, {
          fields: [
            {
              identifier: 'tel',
              inputType: 'tel',
              name: 'TEL',
              order: 1,
              required: false,
            },
          ],
        })
        wrapper = wrapperFactory({ id: 'id' }, jest.fn().mockResolvedValue(latestMock)).wrapper
        await flushPromises()
        wrapper.findAll('.spearly-form-input[type="tel"]')[0].setValue('test')
        wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        expect(wrapper.find('.spearly-form-error').text()).toBe('入力されていない項目があります。')
        expect(wrapper.findAll('.spearly-form-field-error')[1].text()).toBe('電話番号を入力してください。')
      })

      it('if the value in the url field is not an url, an error should be displayed', async () => {
        const latestMock = Object.assign({}, getFormLatestMockData, {
          fields: [
            {
              identifier: 'url',
              inputType: 'url',
              name: 'URL',
              order: 1,
              required: false,
            },
          ],
        })
        wrapper = wrapperFactory({ id: 'id' }, jest.fn().mockResolvedValue(latestMock)).wrapper
        await flushPromises()
        wrapper.findAll('.spearly-form-input[type="url"]')[0].setValue('test')
        wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        expect(wrapper.find('.spearly-form-error').text()).toBe('入力されていない項目があります。')
        expect(wrapper.findAll('.spearly-form-field-error')[1].text()).toBe('URLを入力してください。')
      })
    })

    describe('confirm screen', () => {
      beforeEach(() => {
        wrapper.findAll('.spearly-form-input')[0].setValue('test@example.com')
        wrapper.findAll('.spearly-form-input')[1].setValue('example name')
        wrapper.findAll('.spearly-form-textarea')[0].setValue('text')
        wrapper.find('.spearly-form-submit').trigger('click')
      })

      it('back button should appear', () => {
        expect(wrapper.find('.spearly-form-back').text()).toBe('back')
      })

      it('should return to the input screen after pressing the back button', async () => {
        wrapper.find('.spearly-form-back').trigger('click')
        await flushPromises()
        expect(wrapper.findAll('.spearly-form-answer-confirm')).toEqual([])
      })
    })

    describe('submit form', () => {
      beforeEach(() => {
        wrapper.findAll('.spearly-form-input')[0].setValue('test@example.com')
        wrapper.findAll('.spearly-form-input')[1].setValue('example name')
        wrapper.findAll('.spearly-form-textarea')[0].setValue('text')
        wrapper.find('.spearly-form-submit').trigger('click')
        wrapper.find('.spearly-form-submit').trigger('click')
      })

      it('postFormAnswers is called when clicked on the confirm screen', () => {
        expect(postFormAnswersMock).toHaveBeenCalledWith(1, {
          _spearly_gotcha: '',
          confirmation_email: 'test@example.com',
          name: 'example name',
          content: 'text',
        })
      })

      it('display text on screen if an error occurs in form submission', async () => {
        const rejectMock = jest.fn().mockRejectedValue({})
        const res = wrapperFactory({ id: 'FORM_ID' }, getFormLatestDefaultMock, rejectMock)
        await flushPromises()
        res.wrapper.findAll('.spearly-form-input')[0].setValue('test@example.com')
        res.wrapper.findAll('.spearly-form-input')[1].setValue('example name')
        res.wrapper.findAll('.spearly-form-textarea')[0].setValue('text')
        res.wrapper.find('.spearly-form-submit').trigger('click')
        res.wrapper.find('.spearly-form-submit').trigger('click')
        await flushPromises()
        expect(res.wrapper.find('.spearly-form-error').text()).toBe(
          'フォームを送信できませんでした。内容をご確認の上、再度お試しください。'
        )
      })

      it('thanks screen should be displayed when finished submitting', () => {
        expect(wrapper.find('.spearly-form-thanks-title').text()).toBe('Contact Formを送信しました。')
        expect(wrapper.find('.spearly-form-thanks-message').text()).toBe('Thank you for message.')
      })
    })
  })

  describe('if default slot exists', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      const res = wrapperFactory({ id: 'FORM_ID' }, getFormLatestDefaultMock, postFormAnswerDefaultMock, {
        template: '<div>Slot</div>',
      })
      wrapper = res.wrapper
    })

    it('display slot', () => {
      expect(wrapper.text()).toBe('Slot')
    })
  })
})
