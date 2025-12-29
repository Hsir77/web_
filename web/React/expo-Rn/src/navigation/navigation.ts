import { router } from 'expo-router';
import { ROUTES } from './routes';

export const Navigation = {
  toHome() {
    router.push(ROUTES.HOME);
  },
  toMine() {
    router.push(ROUTES.MINE);
  },
  toDetail(id: string | number) {
    router.push(ROUTES.DETAIL(id));
  },
  back() {
    router.back();
  },
};