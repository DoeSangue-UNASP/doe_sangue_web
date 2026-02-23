import type { RouteRecordRaw } from "vue-router";
import { RouteNames } from "./route-names";
import ViewLandingPage from "../views/landing/ViewLandingPage.vue";
import ViewLogin from "../views/ViewLogin.vue";
import ViewCadastro from "../views/ViewCadastro.vue";
import ViewRequisitosDoacao from "../views/landing/ViewRequisitosDoacao.vue";
import ViewRecuperacaoSenha from "../views/recuperacaoSenha/ViewRecuperacaoSenha.vue";
import ViewSobreNos from "../views/landing/ViewSobreNos.vue";
import ViewPontosDeColeta from "../views/landing/ViewPontosDeColeta.vue";
import ViewQuizAptidao from "../views/landing/ViewQuizAptidao.vue";

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
      path: '/recuperar-senha',
      name: RouteNames.RECUPERAR_SENHA,
      component: ViewRecuperacaoSenha
    },
    {
      path: '/requisitos-doacao',
      name: RouteNames.REQUISITOS_DOACAO,
      component: ViewRequisitosDoacao
    },
    {
      path: '/sobre-nos',
      name: RouteNames.SOBRE_NOS,
      component: ViewSobreNos
    },
    {
      path: '/pontos-coleta',
      name: RouteNames.PONTOS_COLETA,
      component: ViewPontosDeColeta
    },
    {
      path: '/quiz-aptidao',
      name: RouteNames.QUIZ_APTIDAO,
      component: ViewQuizAptidao
    }
];