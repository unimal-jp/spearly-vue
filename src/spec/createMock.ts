import { List, Content, Form } from '@spearly/sdk-js'

export const createContentMock = (index = 0): Content => ({
  attributes: {
    publicUid: `content_${index}`,
    createdAt: new Date('2021-08-01'),
    updatedAt: new Date('2021-08-01'),
    publishedAt: new Date('2021-08-01'),
    nextContent: null,
    previousContent: null,
    contentAlias: `content_${index}`,
    patternName: 'b',
    fields: {
      data: [
        {
          attributes: {
            identifier: 'test',
            inputType: 'text',
            value: `text ${index}`,
          },
          id: '1',
          type: 'field',
        },
      ],
    },
  },
  id: '1',
  type: 'content',
  values: {
    test: `text ${index}`,
  },
})

export const createContentListMock = (length = 10): List => ({
  totalContentsCount: 100,
  matchingContentsCount: 90,
  limit: length,
  offset: 0,
  next: length,
  data: Array(length).map((_, i) => createContentMock(i)),
})

export const createFormMock = (startedAt: Date | null = null, endedAt: Date | null = null): Form => ({
  id: 1,
  publicUid: '1',
  identifier: 'form_1',
  name: 'Form Name',
  description: 'Form description.',
  thankYouMessage: 'Thank You Messaage.',
  confirmationEmail: {
    enabled: true,
    name: 'e-mail',
    description: 'description',
  },
  confirmationScreen: {
    enabled: true,
    backButtonLabel: 'Back',
    submitButtonLabel: 'Submit',
  },
  fields: [
    {
      identifier: 'text',
      name: 'Text',
      description: 'Text description.',
      inputType: 'text',
      order: 0,
      required: true,
      validationRegex: '',
    },
    {
      identifier: 'number',
      name: 'Number',
      description: 'Number description.',
      inputType: 'number',
      order: 1,
      required: true,
      validationRegex: '',
    },
    {
      identifier: 'email',
      name: 'Email',
      description: 'Email description.',
      inputType: 'email',
      order: 2,
      required: true,
      validationRegex: '',
    },
    {
      identifier: 'tel',
      name: 'TEL',
      description: 'TEL description.',
      inputType: 'tel',
      order: 3,
      required: true,
      validationRegex: '/^[+]?\\d+-\\d+-\\d+$/',
    },
    {
      identifier: 'url',
      name: 'URL',
      description: 'URL description.',
      inputType: 'url',
      order: 4,
      required: true,
      validationRegex: '',
    },
    {
      identifier: 'textArea',
      name: 'Textarea',
      description: 'Textarea description.',
      inputType: 'text_area',
      order: 5,
      required: true,
      validationRegex: '',
    },
    {
      identifier: 'radio',
      name: 'Radio',
      description: 'Radio description.',
      inputType: 'radio',
      order: 6,
      required: false,
      data: {
        options: ['r1', 'r2'],
        allowedExtensions: [],
      },
      validationRegex: '',
    },
    {
      identifier: 'checkbox',
      name: 'Checkbox',
      description: 'Checkbox description.',
      inputType: 'checkbox',
      order: 7,
      required: false,
      data: {
        options: ['c1', 'c2', 'c3'],
        allowedExtensions: [],
      },
      validationRegex: '',
    },
    {
      identifier: 'select',
      name: 'Select',
      description: 'Select description.',
      inputType: 'select_box',
      order: 8,
      required: false,
      data: {
        options: ['s1', 's2', 's3'],
        allowedExtensions: [],
      },
      validationRegex: '',
    },
  ],
  callbackUrl: '',
  startedAt: startedAt,
  endedAt: endedAt,
  createdAt: new Date('2021-08-01'),
})

export const createFormAnswerResponse = (publicUid = 'FORM_ID') => ({
  formVersionId: 1,
  formPublicUid: publicUid,
  data: {
    ipAddress: '0.1.2.3',
    userAgent: 'agent',
  },
  createdAt: new Date('2021-08-01'),
})

type UseSpearlyMockParams = {
  getContent?: jest.Mock
  getContentList?: jest.Mock
  getContentPreview?: jest.Mock
  getFormLatest?: jest.Mock
  postFormAnswer?: jest.Mock
  pageView?: jest.Mock
  conversion?: jest.Mock
}

export const createUseSpearlyMock = (mocks: UseSpearlyMockParams = {}) => {
  return Object.assign(
    {},
    {
      getContent: jest.fn().mockResolvedValue(createContentMock),
      getContentList: jest.fn().mockResolvedValue(createContentListMock),
      getContentPreview: jest.fn().mockResolvedValue(createContentMock),
      getFormLatest: jest.fn().mockResolvedValue(createFormMock),
      postFormAnswer: jest.fn().mockResolvedValue(createFormAnswerResponse),
      pageView: jest.fn().mockResolvedValue(undefined),
      conversion: jest.fn().mockResolvedValue(undefined),
    },
    mocks
  )
}
