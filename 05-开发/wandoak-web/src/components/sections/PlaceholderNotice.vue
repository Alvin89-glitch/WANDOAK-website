<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  title: { type: String, default: '' },
  body: { type: String, default: '' },
})

const { t } = useI18n()
</script>

<template>
  <!-- Deliberately the loudest thing on the page. A visitor at a trade show
       reading an invented gsm or MOQ off a screen and repeating it to a
       customer is the one failure mode this whole page has to prevent, so the
       warning is not a footnote — it sits above the content, in the one
       non-brand colour on the site, and it says what to do about it. -->
  <aside class="notice section" role="note">
    <div class="container-c">
      <div class="notice__box">
        <p class="notice__tag t-smcaps">{{ title || t('products.cat.noticeTitle') }}</p>
        <p class="notice__body t-body">{{ body || t('products.cat.noticeBody') }}</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.notice__box {
  display: flex;
  flex-direction: column;
  gap: var(--sp-sm);
  padding: var(--sp-mlg) var(--sp-lg);
  background: var(--wash-band);
  /* --parent is the only warm colour the palette carries; it is otherwise
     reserved for the parent-company mark in the footer, and nothing else on
     the site is allowed to look like this. */
  border-left: 4px solid var(--parent);
}

.notice__tag { color: var(--parent); }
.notice__body { color: var(--ink-75); max-width: 84ch; }
</style>
