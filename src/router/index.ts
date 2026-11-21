import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { routesDoador } from './doador'
import { routesDeslogadas } from './deslogado'
import { routesHemocentro } from './hemocentro';
import { ApiError } from '../services/api';
import { consultarPerfil, obterToken, sair, type Perfil } from '../services/auth';
import { RouteNames } from './route-names';

const routes : RouteRecordRaw[] = [
  ...routesDeslogadas,
  ...routesDoador.map(route => ({ ...route, meta: { ...route.meta, perfil: 'DOADOR' } })),
  ...routesHemocentro.map(route => ({ ...route, meta: { ...route.meta, perfil: 'HEMOCENTRO' } })),
];

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const perfilNecessario = to.meta.perfil as Perfil | undefined;
  if (!perfilNecessario) return true;

  const token = obterToken();
  if (!token) return { name: RouteNames.LOGIN };

  try {
    const perfil = await consultarPerfil(token);
    if (perfil !== perfilNecessario) {
      return { name: perfil === 'DOADOR' ? RouteNames.HOME_DOADOR : RouteNames.HOME_HEMOCENTRO };
    }
    return true;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      sair();
      return { name: RouteNames.LOGIN, query: { sessao: 'expirada' } };
    }
    return { name: RouteNames.LOGIN, query: { sessao: 'indisponivel' } };
  }
});