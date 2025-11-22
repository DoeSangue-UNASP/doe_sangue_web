import type { RouteRecordRaw } from "vue-router";
import { RouteNames } from "./route-names";
import ViewPaginaInicialDoador from "../views/doador/ViewPaginaInicialDoador.vue";
import ViewBuscarHemocentro from "../views/doador/ViewBuscarHemocentro.vue";
import ViewMeusDadosDoador from "../views/doador/ViewMeusDadosDoador.vue";
import ViewMinhasDoacoes from "../views/doador/ViewMinhasDoacoes.vue";

export const routesDoador : RouteRecordRaw[] = [
  {
    path: '/doador/home',
    name: RouteNames.HOME_DOADOR,
    component: ViewPaginaInicialDoador
  },
  {
    path: '/doador/buscar-hemocentros',
    name: RouteNames.BUSCAR_HEMOCENTROS_DOADOR,
    component: ViewBuscarHemocentro
  },
  {
    path: '/doador/doacoes',
    name: RouteNames.MINHAS_DOACOES,
    component: ViewMinhasDoacoes
  },
  // {
  //   path: '/doador/agendamentos',
  //   name: RouteNames.AGENDAMENTOS_DOADOR,
  //   component: 
  // },
  {
    path: '/doador/meus-dados',
    name: RouteNames.MEUS_DADOS_DOADOR,
    component: ViewMeusDadosDoador
  },
  
]