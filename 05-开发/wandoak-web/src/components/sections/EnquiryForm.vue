<script setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { enquiryTypes } from '@/data/site'
import AppButton from '@/components/primitives/AppButton.vue'
import { useReveal } from '@/composables/useReveal'

const { t } = useI18n()
const { el, shown } = useReveal({ threshold: 0.05 })

const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT || ''
const MAILTO = import.meta.env.VITE_ENQUIRY_MAILTO || 'ken@chinaqs.com'

const form = reactive({
  company: '',
  name: '',
  country: '',
  email: '',
  type: '',
  message: '',
})

const touched = reactive({})
const status = ref('idle') // idle | sending | sent | error

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors = computed(() => {
  const e = {}
  if (!form.company.trim()) e.company = t('ui.required')
  if (!form.name.trim()) e.name = t('ui.required')
  if (!form.email.trim()) e.email = t('ui.required')
  else if (!EMAIL_RE.test(form.email.trim())) e.email = t('ui.invalidEmail')
  if (!form.type) e.type = t('ui.required')
  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)
const showError = (field) => touched[field] && errors.value[field]

/**
 * With no endpoint configured the form composes a prefilled mail draft
 * instead. A trade-show stand often has no reliable network, and an enquiry
 * that leaves in the visitor's own mail client is better than one that
 * silently fails.
 */
function mailtoHref() {
  const subject = `Enquiry — ${form.company || form.name}`
  const body = [
    `${t('partner.fieldCompany')}: ${form.company}`,
    `${t('partner.fieldName')}: ${form.name}`,
    `${t('partner.fieldCountry')}: ${form.country}`,
    `${t('partner.fieldEmail')}: ${form.email}`,
    `${t('partner.fieldType')}: ${form.type}`,
    '',
    form.message,
  ].join('\n')
  return `mailto:${MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

async function submit() {
  for (const k of Object.keys(form)) touched[k] = true
  if (!isValid.value) return

  if (!ENDPOINT) {
    window.location.href = mailtoHref()
    status.value = 'sent'
    return
  }

  status.value = 'sending'
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...form }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    status.value = 'sent'
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <section ref="el" id="enquire" class="form section reveal" :class="{ 'is-in': shown }">
    <div class="container-c">
      <div class="form__grid">
        <div class="form__intro">
          <h2 class="t-h2 u-balance">{{ t('partner.formH2') }}</h2>
          <p class="form__lead t-lead">{{ t('partner.formLead') }}</p>

          <dl class="form__contact">
            <div>
              <dt class="t-micro">{{ t('contact.exportLabel') }}</dt>
              <dd class="t-body">
                <a href="mailto:ken@chinaqs.com">ken@chinaqs.com</a> ·
                <a href="mailto:anne@chinaqs.com">anne@chinaqs.com</a>
              </dd>
            </div>
            <div>
              <dt class="t-micro">{{ t('contact.phoneLabel') }}</dt>
              <dd class="t-body">{{ t('contact.phoneValue') }}</dd>
            </div>
            <div>
              <dt class="t-micro">{{ t('contact.addressLabel') }}</dt>
              <dd class="t-body">{{ t('contact.addressValue') }}</dd>
            </div>
          </dl>
        </div>

        <div class="form__panel">
          <p v-if="status === 'sent'" class="form__note form__note--ok t-body" role="status">
            {{ t('partner.formSuccess') }}
          </p>

          <form v-else class="form__fields" novalidate @submit.prevent="submit">
            <p v-if="status === 'error'" class="form__note form__note--bad t-body" role="alert">
              {{ t('partner.formError') }}
            </p>

            <div class="form__row">
              <label class="field">
                <span class="field__label t-micro">{{ t('partner.fieldCompany') }} *</span>
                <input
                  v-model="form.company" type="text" name="company" autocomplete="organization"
                  :aria-invalid="!!showError('company')"
                  @blur="touched.company = true"
                />
                <span v-if="showError('company')" class="field__err t-sm">{{ errors.company }}</span>
              </label>

              <label class="field">
                <span class="field__label t-micro">{{ t('partner.fieldName') }} *</span>
                <input
                  v-model="form.name" type="text" name="name" autocomplete="name"
                  :aria-invalid="!!showError('name')"
                  @blur="touched.name = true"
                />
                <span v-if="showError('name')" class="field__err t-sm">{{ errors.name }}</span>
              </label>
            </div>

            <div class="form__row">
              <label class="field">
                <span class="field__label t-micro">{{ t('partner.fieldCountry') }}</span>
                <input v-model="form.country" type="text" name="country" autocomplete="country-name" />
              </label>

              <label class="field">
                <span class="field__label t-micro">{{ t('partner.fieldEmail') }} *</span>
                <input
                  v-model="form.email" type="email" name="email" autocomplete="email"
                  :aria-invalid="!!showError('email')"
                  @blur="touched.email = true"
                />
                <span v-if="showError('email')" class="field__err t-sm">{{ errors.email }}</span>
              </label>
            </div>

            <label class="field">
              <span class="field__label t-micro">{{ t('partner.fieldType') }} *</span>
              <select
                v-model="form.type" name="type"
                :aria-invalid="!!showError('type')"
                @blur="touched.type = true"
              >
                <option value="" disabled>{{ t('ui.selectPlaceholder') }}</option>
                <option v-for="key in enquiryTypes" :key="key" :value="t(key)">{{ t(key) }}</option>
              </select>
              <span v-if="showError('type')" class="field__err t-sm">{{ errors.type }}</span>
            </label>

            <label class="field">
              <span class="field__label t-micro">{{ t('partner.fieldMessage') }}</span>
              <textarea v-model="form.message" name="message" rows="5"></textarea>
            </label>

            <AppButton type="submit" :disabled="status === 'sending'">
              {{ status === 'sending' ? t('ui.sending') : t('btn.sendEnquiry') }}
            </AppButton>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.form__grid {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: var(--sp-5xl);
  align-items: start;
}

.form__lead { color: var(--ink-60); margin-top: var(--sp-md); }

.form__contact {
  margin-top: var(--sp-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--sp-mlg);
  padding-top: var(--sp-mlg);
  border-top: 1px solid var(--line);
}
.form__contact dt { color: var(--ink-40); margin-bottom: var(--sp-xs); }
.form__contact dd { margin: 0; color: var(--ink-60); }
.form__contact a { border-bottom: 1px solid var(--line); }
.form__contact a:hover { color: var(--brand-ink); border-color: currentColor; }

.form__panel { background: var(--wash-band); padding: var(--sp-2xl); }

.form__fields { display: flex; flex-direction: column; gap: var(--sp-mlg); }
.form__row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--sp-md); }

.field { display: flex; flex-direction: column; gap: var(--sp-sm); }
.field__label { color: var(--ink-60); }

.field input,
.field select,
.field textarea {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 12px 14px;
  font-size: var(--t-body-size);
  line-height: var(--t-body-lh);
  color: var(--ink);
  border-radius: 0;
  transition: border-color var(--dur-ui);
  width: 100%;
}
.field input:focus,
.field select:focus,
.field textarea:focus { border-color: var(--ink); outline-offset: 1px; }
.field [aria-invalid="true"] { border-color: var(--parent); }

.field textarea { resize: vertical; min-height: 120px; }
.field select { appearance: none; background-image: none; }

.field__err { color: var(--parent); }

.form__note { padding: var(--sp-md); }
.form__note--ok { background: var(--paper); border-left: 2px solid var(--brand); }
.form__note--bad { background: var(--paper); border-left: 2px solid var(--parent); }

@media (max-width: 991.98px) {
  .form__grid { grid-template-columns: minmax(0, 1fr); gap: var(--sp-2xl); }
}
@media (max-width: 575.98px) {
  .form__row { grid-template-columns: minmax(0, 1fr); }
  .form__panel { padding: var(--sp-lg); }
}
</style>
