<template>
  <div>
    <template v-if="props.loading && !state.isLoaded">
      <component :is="props.loading" />
    </template>
    <template v-else>
      <slot v-bind="state.form" :submit="submit">
        <div class="spearly-form">
          <template v-if="!state.submitted">
            <h1 class="spearly-form-title">
              {{ state.form.name }}
            </h1>
            <p class="spearly-form-description">
              {{ state.form.description }}
            </p>

            <p v-if="state.form.startedAt || state.form.endedAt" class="spearly-form-period">
              このフォームの受付期間は{{ state.form.startedAt && formattedDate(state.form.startedAt) }}〜{{
                state.form.endedAt && formattedDate(state.form.endedAt)
              }}です。
            </p>

            <p v-if="state.error" class="spearly-form-error">
              <span>フォームを送信できませんでした。内容をご確認の上、再度お試しください。</span>
            </p>

            <fieldset v-for="field in state.form.fields" :key="field.identifier" class="spearly-form-fieldset">
              <label
                :for="['radio', 'checkbox'].includes(field.inputType) ? undefined : field.identifier"
                class="spearly-form-label"
              >
                {{ field.name }}
                <i v-if="field.required" class="spearly-form-label-required">*</i>
              </label>

              <template v-if="state.confirm">
                <p class="spearly-form-answer-confirm">
                  {{ getConfirmText(field.identifier) }}
                </p>
              </template>

              <template v-else-if="['text', 'number', 'email', 'tel', 'url'].includes(field.inputType)">
                <input
                  :id="field.identifier"
                  :value="state.answers[field.identifier]"
                  :required="field.required"
                  :disabled="!isActive"
                  :aria-invalid="!!state.errors.get(field.identifier)"
                  :aria-describedby="field.description ? `${field.identifier}-description` : undefined"
                  :type="field.inputType"
                  class="spearly-form-input"
                  @input="onInput(field.identifier, $event)"
                />
              </template>

              <template v-else-if="field.inputType === 'text_area'">
                <textarea
                  :id="field.identifier"
                  v-model="state.answers[field.identifier]"
                  :required="field.required"
                  :disabled="!isActive"
                  :aria-invalid="!!state.errors.get(field.identifier)"
                  :aria-describedby="field.description ? `${field.identifier}-description` : undefined"
                  class="spearly-form-textarea"
                />
              </template>

              <template v-else-if="(field.inputType === 'radio' || field.inputType === 'checkbox') && field.data">
                <label v-for="(option, i) in field.data.options" :key="i" :class="`spearly-form-${field.inputType}`">
                  <input
                    v-model="state.answers[field.identifier]"
                    :type="field.inputType"
                    :name="field.name"
                    :value="option"
                    :required="field.required"
                    :disabled="!isActive"
                    :aria-describedby="field.description ? `${field.identifier}-description` : undefined"
                  />
                  <span>{{ option }}</span>
                </label>
              </template>

              <template v-else-if="field.inputType === 'file'">
                <label class="spearly-form-file">
                  <input
                    :id="field.identifier"
                    :required="field.required"
                    :accept="field.data?.allowedExtensions?.map((extension) => `.${extension}`).join(',')"
                    :disabled="!isActive"
                    type="file"
                    class="spearly-form-file-input"
                    @change="onChangeFile($event, field.identifier)"
                  />
                </label>
              </template>

              <template v-else-if="field.inputType === 'select_box' && field.data">
                <select
                  :id="field.identifier"
                  v-model="state.answers[field.identifier]"
                  :required="field.required"
                  :disabled="!isActive"
                  :aria-invalid="!!state.errors.get(field.identifier)"
                  :aria-describedby="field.description ? `${field.identifier}-description` : undefined"
                  class="spearly-form-select"
                >
                  <option v-for="(option, i) in field.data.options" :key="i" :value="option">
                    {{ option }}
                  </option>
                </select>
              </template>

              <p
                v-if="state.errors.get(field.identifier)"
                :id="`spearly-form-field-${field.identifier}-error`"
                role="alert"
                aria-live="assertive"
                class="spearly-form-field-error"
              >
                {{ state.errors.get(field.identifier) }}
              </p>

              <p
                v-if="field.description"
                :id="`${field.identifier}-description`"
                class="spearly-form-field-description"
              >
                {{ field.description }}
              </p>
            </fieldset>

            <input
              v-model="state.answers._spearly_gotcha"
              type="text"
              name="_spearly_gotcha"
              tabindex="-1"
              style="position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden"
            />

            <p v-if="!isActive" class="spearly-form-outside">
              <span>このフォームは現在受付期間外です。</span>
            </p>

            <p v-if="hasError" class="spearly-form-error">
              <span>入力されていない項目があります。</span>
            </p>

            <div class="spearly-form-btns">
              <button :disabled="!isActive" class="spearly-form-submit" @click="onClick">
                <span>{{
                  state.form.confirmationScreen.enabled ? state.form.confirmationScreen.submitButtonLabel : '送信'
                }}</span>
              </button>

              <button v-if="state.confirm" class="spearly-form-back" @click="state.confirm = false">
                <span>{{ state.form.confirmationScreen.backButtonLabel }}</span>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="spearly-form-thanks">
              <h1 class="spearly-form-thanks-title">
                <span>{{ state.form.name }}を送信しました。</span>
              </h1>
              <p v-if="state.form.thankYouMessage" class="spearly-form-thanks-message">
                {{ state.form.thankYouMessage }}
              </p>
            </div>
          </template>
        </div>
      </slot>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { inject, reactive, computed, useSlots, onMounted, onUnmounted } from 'vue'
import { SpearlyApiClient } from '@spearly/sdk-js'
import type { Form } from '@spearly/sdk-js'

export type Props = {
  id: string
  loading?: string
}

export type State = {
  form: { createdAt: Date | null } & Omit<Form, 'createdAt'>
  answers: { [key: string]: string | string[]; _spearly_gotcha: string }
  files: { [key: string]: string }
  errors: Map<string, string>
  error: boolean
  confirm: boolean
  submitted: boolean
  isLoaded: boolean
}

const slots = useSlots()
const props = defineProps<Props>()
const state = reactive<State>({
  form: {
    id: 0,
    publicUid: '',
    identifier: '',
    name: '',
    description: '',
    thankYouMessage: '',
    fields: [],
    callbackUrl: '',
    startedAt: null,
    endedAt: null,
    createdAt: null,
    confirmationEmail: {
      enabled: false,
      name: '',
      description: '',
    },
    confirmationScreen: {
      enabled: false,
      backButtonLabel: '',
      submitButtonLabel: '',
    },
  },
  answers: { _spearly_gotcha: '', confirmation_email: '' },
  files: {},
  error: false,
  errors: new Map(),
  confirm: false,
  submitted: false,
  isLoaded: false,
})

const $spearly = inject<SpearlyApiClient>('$spearly')
const setFormData = async () => {
  if (!$spearly) return
  const res = await $spearly.getFormLatest(props.id)
  state.form = res

  if (res.confirmationEmail.enabled && !state.form.fields.find((field) => field.identifier === 'confirmation_email')) {
    state.form.fields.unshift({
      identifier: 'confirmation_email',
      name: res.confirmationEmail.name,
      inputType: 'email',
      description: res.confirmationEmail.description,
      order: 0,
      required: true,
      validationRegex: '',
    })
  }

  state.isLoaded = true
}

const setAnswersObj = () => {
  state.form.fields.forEach((field) => {
    state.answers[field.identifier] = field.inputType === 'checkbox' && field.data?.options?.length ? [] : ''

    if (field.inputType === 'file') {
      state.files[field.identifier] = ''
    }
  })
}

setFormData()

onMounted(() => {
  setAnswersObj()
})

onUnmounted(() => {
  state.isLoaded = false
})

const formattedDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const days = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}/${month}/${days} ${hours}:${minutes}`
}

const getConfirmText = (identifier: string) => {
  if (Array.isArray(state.answers[identifier])) return (state.answers[identifier] as string[]).join(', ')
  return state.answers[identifier]
}

const now = computed(() => Date.now())
const isActive = computed(() => {
  if (state.form.startedAt && !state.form.endedAt) return now.value >= state.form.startedAt.getTime()
  if (!state.form.startedAt && state.form.endedAt) return now.value <= state.form.endedAt.getTime()
  if (state.form.startedAt && state.form.endedAt)
    return now.value >= state.form.startedAt.getTime() && now.value <= state.form.endedAt.getTime()
  return true
})

const validate = () => {
  state.errors.clear()

  const requiredFields = state.form.fields.filter((field) => field.required).map((field) => field.identifier)
  const numberFields = state.form.fields
    .filter((field) => field.inputType === 'number')
    .map((field) => field.identifier)
  const emailFields = state.form.fields.filter((field) => field.inputType === 'email').map((field) => field.identifier)
  const telFields = state.form.fields.filter((field) => field.inputType === 'tel').map((field) => field.identifier)
  const urlFields = state.form.fields.filter((field) => field.inputType === 'url').map((field) => field.identifier)

  requiredFields.forEach((identifier) => {
    if (Array.isArray(state.answers[identifier]) && !state.answers.length) {
      state.errors.set(identifier, '選択してください。')
      return
    }

    if (!state.answers[identifier]) {
      state.errors.set(identifier, '入力してください。')
    }
  })

  numberFields.forEach((identifier) => {
    if (state.answers[identifier] && !/^[\-\+0-9]+$/.test(state.answers[identifier] as string)) {
      state.errors.set(identifier, '数字を入力してください。')
    }
  })

  emailFields.forEach((identifier) => {
    if (state.answers[identifier] && !/^[\w\-._]+@[\w\-._]+\.[A-Za-z]+$/.test(state.answers[identifier] as string)) {
      state.errors.set(identifier, 'メールアドレスの形式で入力してください。')
    }
  })

  telFields.forEach((identifier) => {
    const field = state.form.fields.find((field) => field.identifier === identifier)!
    if (!field.validationRegex) return

    const regex = new RegExp(field.validationRegex)

    if (state.answers[identifier] && !regex.test(state.answers[identifier] as string)) {
      const format = field.validationRegex === '^[+]?\\d+$' ? 'ハイフンなし' : '半角数字とハイフン'
      state.errors.set(identifier, `電話番号（${format}）を入力してください。`)
    }
  })

  urlFields.forEach((identifier) => {
    if (
      state.answers[identifier] &&
      !/^https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+?\..*?$/.test(state.answers[identifier] as string)
    ) {
      state.errors.set(identifier, 'URLを入力してください。')
    }
  })
}

const hasError = computed(() => {
  return !!state.errors.size
})

const onInput = (identifier: string, event: Event) => {
  if (!event.target || !(event.target instanceof HTMLInputElement)) return
  state.answers[identifier] = event.target.value
}

const onClick = () => {
  if (!state.confirm) {
    validate()
    if (hasError.value) return
    if (state.form.confirmationScreen.enabled) {
      state.confirm = true
      return
    }
  }
  submit(state.answers)
}

const onChangeFile = (event: Event, identifier: string) => {
  const files = (event.target as HTMLInputElement).files

  if (!files) return
  if (!files.length) {
    state.answers[identifier] = ''
    state.files[identifier] = ''
  }

  const fileReader = new FileReader()

  fileReader.onload = () => {
    state.answers[identifier] = fileReader.result as string
    state.files[identifier] = files[0].name
  }

  fileReader.readAsDataURL(files[0])
}

const submit = async (fields: { [key: string]: unknown } & { _spearly_gotcha: string }) => {
  if (!$spearly) throw new Error('$spearly is not inject.')
  try {
    await $spearly.postFormAnswers(state.form.id, fields)

    if (typeof location !== 'undefined' && state.form.callbackUrl) {
      location.href = state.form.callbackUrl
    } else {
      state.submitted = true
    }
  } catch {
    state.error = true
    state.confirm = false
  }
}
</script>

<script lang="ts">
export default {
  name: 'spearly-form',
}
</script>
