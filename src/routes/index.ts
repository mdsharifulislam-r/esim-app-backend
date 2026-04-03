import { AdminRoutes } from '../app/modules/admin/admin.route';
import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { CountryRoutes } from '../app/modules/country/country.route';
import { EsimRoutes } from '../app/modules/esim/esim.route';
import { DisclaimerRoutes } from '../app/modules/disclaimer/disclaimer.route';
import { FaqRoutes } from '../app/modules/faq/faq.route';
import { BlogRoutes } from '../app/modules/blog/blog.route';
import { CouponRoutes } from '../app/modules/coupon/coupon.route';
import { ReviewRoutes } from '../app/modules/review/review.route';
import { SupportRoutes } from '../app/modules/support/support.route';
const router = express.Router();

export const apiRoutes: { path: string; route: any }[] = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/country',
    route: CountryRoutes,
  },
  {
    path: '/esim',
    route: EsimRoutes,
  },
  {
    path: '/disclaimer',
    route: DisclaimerRoutes,
  },
  {
    path: '/faq',
    route: FaqRoutes,
  },
  {
    path: '/blog',
    route: BlogRoutes,
  },
  {
    path:"/coupon",
    route:CouponRoutes
  },
  {
    path:"/review",
    route:ReviewRoutes
  },
  {
    path:"/support",
    route:SupportRoutes
  },
  { path: '/admin', route: AdminRoutes },
];





apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
