import type { RouteRecordRaw } from "vue-router";
import { RouteNames } from "./route-names";
import ViewLandingPage from "../views/landing/ViewLandingPage.vue";
import ViewLogin from "../views/ViewLogin.vue";
import ViewCadastro from "../views/ViewCadastro.vue";
import ViewRequisitosDoacao from "../views/landing/ViewRequisitosDoacao.vue";
import ViewRecuperacaoSenha from "../views/recuperacaoSenha/ViewRecuperacaoSenha.vue";

export const routesDeslogadas : RouteRecordRaw[] = [
    {
      path: '/',
      name: RouteNames.LANDING_PAGE,
      component: ViewLandingPage
    },
    {
      path: '/login',
      name: RouteNames.LOGIN,
      component: ViewLogin
    },
    {
      path: '/cadastrar',
      name: RouteNames.CADASTRAR,
      component: ViewCadastro
    },
    {
      path: '/requisitos-doacao',
      name: RouteNames.REQUISITOS_DOACAO,
      component: ViewRequisitosDoacao
    },
    {
      path: '/recuperar-senha',
      name: RouteNames.RECUPERAR_SENHA,
      component: ViewRecuperacaoSenha
    },
];