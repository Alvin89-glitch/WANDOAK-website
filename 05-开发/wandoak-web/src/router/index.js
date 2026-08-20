import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/HomeView.vue'
import { categoryBySlug } from '@/data/site'

/* Home and Work-With-Us are the trade-show pages and ship complete;
   the other five are routed skeletons so the nav never 404s. */
const routes = [
  // Eager: this is the landing route, and deferring it leaves <main> empty
  // on first paint, which drops the footer into the viewport and then shoves
  // it down — a 0.5 CLS all by itself.
  { path: '/', name: 'home', component: HomeView, meta: { titleKey: 'site.metaTitle', bare: true } },
  { path: '/design', name: 'design', component: () => import('@/pages/DesignView.vue'), meta: { titleKey: 'design.heroH1' } },
  { path: '/products', name: 'products', component: () => import('@/pages/ProductsView.vue'), meta: { titleKey: 'products.heroH1' } },
  {
    path: '/products/:category',
    name: 'productCategory',
    component: () => import('@/pages/ProductCategoryView.vue'),
    // The title depends on which category was asked for, so meta carries a
    // resolver instead of a fixed key (see syncHead in App.vue). `navName`
    // tells SiteNav which top-level item owns this route — it is a sibling of
    // /products, not a child, so router-link-active does not reach it.
    meta: {
      titleKey: (route) => categoryBySlug(route.params.category)?.titleKey ?? 'nav.products',
      navName: 'products',
    },
    // An unknown slug is a wrong address, not an empty category — hand it to
    // the 404 rather than rendering a page with nothing in it.
    beforeEnter: (to) =>
      categoryBySlug(to.params.category)
        ? true
        : { name: 'notFound', params: { pathMatch: to.path.slice(1).split('/') }, replace: true },
  },
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
