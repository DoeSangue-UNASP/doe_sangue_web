<script setup lang="ts">
import { useRouter } from 'vue-router';
import CustomAccordion from '../../components/CustomAccordion.vue';
import CustomButton from '../../components/CustomButton.vue';
import LinkButton from '../../components/LinkButton.vue';
import NavbarLanding from '../../components/NavbarLanding.vue';

const router = useRouter();

const irParaQuiz = () => {
    router.push({ name: 'quiz-aptidao' });
};
</script>

<template>
    <div class="background">
        <NavbarLanding />
        <main>
            <section class="requisitos">
                <h1>Requisitos para Doar Sangue</h1>
                <p>Confira os critérios básicos e os principais impedimentos para garantir uma doação segura para todos.
                </p>

                <CustomAccordion title="Requisitos Básicos">
                    <div class="accordion-content">
                        <p><strong>Idade e Peso:</strong></p>
                        <ul>
                            <li>Ter entre 16 e 69 anos (menores de 18 anos necessitam de consentimento do responsável)</li>
                            <li>Pesar no mínimo 50 kg</li>
                        </ul>

                        <p><strong>Critérios de Saúde:</strong></p>
                        <ul>
                            <li>Estar em bom estado de saúde no dia da doação</li>
                            <li>Ter pressão arterial normal (máximo 180/100 mmHg)</li>
                            <li>Ter frequência cardíaca entre 60 e 100 batidas por minuto em repouso</li>
                            <li>Ter hemoglobina adequada</li>
                        </ul>

                        <p><strong>Documentação e Registro:</strong></p>
                        <ul>
                            <li>Apresentar documento de identidade com foto</li>
                            <li>Estar registrado no sistema do hemocentro</li>
                        </ul>

                        <p><strong>Repouso e Alimentação:</strong></p>
                        <ul>
                            <li>Ter dormido bem na noite anterior</li>
                            <li>Ter se alimentado adequadamente (evitar alimentos gordurosos nas 2 horas antes da doação)</li>
                            <li>Estar hidratado</li>
                        </ul>
                    </div>
                </CustomAccordion>
                <CustomAccordion title="O que impede de doar?">
                    <div class="accordion-content">
                        <p><strong>Impedimentos Permanentes:</strong></p>
                        <ul>
                            <li>Ter AIDS ou ser portador do HIV</li>
                            <li>Ter hepatite B ou C</li>
                            <li>Ter doença de Chagas</li>
                            <li>Ter sífilis</li>
                            <li>Ter história de malária</li>
                        </ul>

                        <p><strong>Impedimentos Temporários:</strong></p>
                        <ul>
                            <li>Estar resfriado ou com febre</li>
                            <li>Ter diarreia (aguarde 7 dias após a cura)</li>
                            <li>Ter feito tatuagem nos últimos 12 meses</li>
                            <li>Ter feito piercing nos últimos 12 meses</li>
                            <li>Ter recebido transfusão de sangue (aguarde 1 ano)</li>
                            <li>Estar grávida ou amamentando (aguarde 90 dias após o parto)</li>
                            <li>Ter tomado vacina (aguarde o tempo específico de cada vacina)</li>
                            <li>Ter feito endoscopia, colonoscopia ou outro procedimento invasivo (aguarde 6 meses)</li>
                            <li>Estar tomando certos medicamentos</li>
                        </ul>

                        <p><strong>Comportamento e Risco:</strong></p>
                        <ul>
                            <li>Ter tido relações sexuais sem proteção com parceiro desconhecido nos últimos 12 meses</li>
                            <li>Ser usuário de drogas injetáveis</li>
                            <li>Ter exercido profissão do sexo ou ter tido parceiro que exerce</li>
                        </ul>

                        <p><strong>Doenças Crônicas:</strong></p>
                        <ul>
                            <li>Ter pressão alta descontrolada</li>
                            <li>Ter problemas cardíacos graves</li>
                            <li>Ter diabetes tipo 1 (tipo 2 controlado pode ser permitido)</li>
                            <li>Ter doença neurológica grave</li>
                        </ul>
                    </div>
                </CustomAccordion>
            </section>
            <section class="section-logo-redirecionamento">
                <div class="bloco-logo-redirecionamento">
                    <div class="logo">
                        <img src="../../assets/logo-light-horizontal.svg" alt="logo-doe-sangue" />
                    </div>

                    <h1>Pronto para salvar vidas?</h1>
                    <p>Não tem certeza se atende a todos os critérios? Responda nosso quiz rápido e descubra!</p>

                    <CustomButton class="poppins-bold" label="Ir para Quiz de Aptidão" @click="irParaQuiz" />
                    <LinkButton class="poppins-medium" label="ou Encontrar Ponto de Coleta"
                        route-name="encontrar-ponto-coleta" />
                </div>
            </section>
        </main>
    </div>
</template>

<style scoped>
.background {
    background-color: var(--background-color);
}

main {
    display: flex;
    flex-direction: row;

    min-height: 100vh;
    padding-top: 100px;
    padding-bottom: 100px;
    margin: 0 100px 0 100px;

    gap: 50px;
}

.requisitos {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 50px;
    width: 60%;
}

.requisitos h1 {
    color: var(--primary-color);
    font-size: 2rem;
    margin-bottom: 10px;
}

.requisitos > p {
    color: var(--text-color);
    line-height: 1.6;
    margin-bottom: 20px;
}

.accordion-content {
    padding: 10px 0;
    color: var(--text-color);
    line-height: 1.8;
}

.accordion-content p {
    margin: 15px 0 10px 0;
    font-weight: 600;
    color: var(--primary-color);
}

.accordion-content ul {
    list-style: none;
    padding-left: 0;
    margin: 10px 0 15px 0;
}

.accordion-content li {
    padding: 8px 0;
    padding-left: 25px;
    position: relative;
    color: var(--text-color);
}

.accordion-content li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-weight: bold;
}

.section-logo-redirecionamento {
    padding-top: 50px;
    width: 40%;
}

.bloco-logo-redirecionamento {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    padding: 70px;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

    gap: 20px;
    position: sticky;
    top: 150px;
}

.bloco-logo-redirecionamento h1 {
    color: var(--primary-color);
    font-size: 1.5rem;
    text-align: center;
}

.bloco-logo-redirecionamento p {
    color: var(--text-color);
    text-align: center;
    font-size: 0.95rem;
    line-height: 1.6;
}

.logo {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--primary-color);
    padding: 80px;
    border-radius: 16px;
}

.logo img {
    max-width: 100%;
    height: auto;
}

.bloco-logo-redirecionamento button {
    width: 100%;
}

@media (max-width: 1024px) {
    main {
        flex-direction: column;
        margin: 0 50px;
    }

    .requisitos {
        width: 100%;
    }

    .section-logo-redirecionamento {
        width: 100%;
    }

    .bloco-logo-redirecionamento {
        position: static;
    }
}

@media (max-width: 768px) {
    main {
        margin: 0 30px;
        padding-top: 50px;
    }

    .requisitos h1 {
        font-size: 1.5rem;
    }

    .bloco-logo-redirecionamento {
        padding: 40px;
    }

    .logo {
        padding: 40px;
    }
}
</style>