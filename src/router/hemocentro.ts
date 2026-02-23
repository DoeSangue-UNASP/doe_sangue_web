import type { RouteRecordRaw } from "vue-router";
import { RouteNames } from "./route-names";
import ViewHomeHemocentro from "../views/hemocentro/ViewHomeHemocentro.vue";
import ViewBolsasSangue from "../views/hemocentro/ViewBolsasSangue.vue";
import ViewDoadores from "../views/hemocentro/ViewDoadores.vue";
import ViewGerenciarDoador from "../views/hemocentro/ViewGerenciarDoador.vue";
import ViewGerenciarBolsasSangue from "../views/hemocentro/ViewGerenciarBolsasSangue.vue";
import ViewAgendamentos from "../views/hemocentro/ViewAgendamentos.vue";

export const routesHemocentro : RouteRecordRaw[] = [
  {
    path: '/hemocentro/home',
    name: RouteNames.HOME_HEMOCENTRO,
    component: ViewHomeHemocentro
  },
  {
    path: '/hemocentro/doadores',
    name: RouteNames.DOADORES_HEMOCENTRO_LISTAR,
    component: ViewDoadores
  },
  {
    path: '/hemocentro/doadores/novo',
    name: RouteNames.DOADORES_HEMOCENTRO_NOVO,
    component: ViewGerenciarDoador
  },
  {
    path: '/hemocentro/doadores/:id',
    name: RouteNames.DOADORES_HEMOCENTRO_EDITAR,
    component: ViewGerenciarDoador
  },
  {
    path: '/hemocentro/bolsas-sangue',
    name: RouteNames.BOLSAS_SANGUE_HEMOCENTRO,
    component: ViewBolsasSangue
  },
  {
    path: '/hemocentro/nova-bolsa-sangue',
    name: RouteNames.CRIAR_BOLSA_SANGUE_HEMOCENTRO,
    component: ViewGerenciarBolsasSangue
  },
  {
    path: '/hemocentro/detalhes-bolsa-sangue',
    name: RouteNames.EDITAR_BOLSA_SANGUE_HEMOCENTRO,
    component: ViewGerenciarBolsasSangue
  },
  {
    path: '/hemocentro/agendamentos',
    name: RouteNames.AGENDAMENTOS_HEMOCENTRO,
    component: ViewAgendamentos
  },
  
]