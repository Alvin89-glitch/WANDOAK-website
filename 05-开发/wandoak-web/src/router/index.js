import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/HomeView.vue'

/* Home and Work-With-Us are the trade-show pages and ship complete;
   the other six are routed skeletons so the nav never 404s. */
const routes = [
  // Eager: this is the landing route, and deferring it leaves <main> empty
  // on first paint, which drops the footer into the viewport and then shoves
  // it down — a 0.5 CLS all by itself.
  { path: '/', name: 'home', component: HomeView, meta: { titleKey: 'site.metaTitle', bare: true } },
  { path: '/about', name: 'about', component: () => import('@/pages/AboutView.vue'), meta: { titleKey: 'about.heroH1' } },
  { path: '/design', name: 'design', component: () => import('@/pages/DesignView.vue'), meta: { titleKey: 'design.heroH1' } },
  { path: '/products', name: 'products', component: () => import('@/pages/ProductsView.vue'), meta: { titleKey: 'products.heroH1' } },
  { path: '/factory', name: 'factory', component: () => import('@/pages/FactoryView.vue'), meta: { titleKey: 'factory.heroH1' } },
  { path: '/quality', name: 'quality', component: () => import('@/pages/QualityView.vue'), meta: { titleKey: 'quality.heroH1' } },
  { path: '/partner', name: 'partner', component: () => import('@/pages/PartnerView.vue'), meta: { titleKey: 'partner.heroH1' } },
  { path: '/contact', name: 'contact', component: () => import('@/pages/ContactView.vue'), meta: { titleKey: 'contact.h1' } },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: () => import('@/pages/NotFoundView.vue'), meta: { titleKey: 'ui.notFoundTitle' } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 96 }
    return { top: 0 }
  },
})
