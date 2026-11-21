<script setup lang="ts">
import CustomButton from '../../components/CustomButton.vue';
import NavbarLanding from '../../components/NavbarLanding.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <div class="background">
        <NavbarLanding />
        <main>
            <header>
                <h1>Sobre Nós</h1>
            </header>

            <section class="about-content">
                <article class="intro">
                    <p>
                        A <strong>DoeSangue</strong> é uma plataforma inovadora dedicada a revolucionar o processo de
                        doação de sangue.
                        Acreditamos que a tecnologia pode salvar vidas, tornando a doação de sangue mais acessível,
                        transparente e
                        organizada para doadores, hemocentros e toda a comunidade.
                    </p>
                </article>

                <article class="mission">
                    <h2>Missão</h2>
                    <p>
                        Conectar doadores e hemocentros através de uma plataforma digital inovadora, simplificando o
                        processo de
                        doação de sangue e aumentando o acesso a transfusões seguras. Buscamos eliminar as barreiras que
                        impedem
                        pessoas de doarem sangue, garantindo que cada doação chegue àqueles que precisam com eficiência
                        e segurança.
                    </p>
                </article>

                <article class="vision">
                    <h2>Visão</h2>
                    <p>
                        Ser a plataforma líder de doação de sangue no Brasil, transformando vidas através da tecnologia
                        e solidariedade.
                        Almejamos um futuro onde a doação de sangue é simples, acessível e realizada com segurança,
                        garantindo que
                        pacientes tenham acesso a sangue seguro sempre que precisarem, contribuindo para uma sociedade
                        mais saudável
                        e humanitária.
                    </p>
                </article>

                <article class="values">
                    <h2>Valores</h2>
                    <div class="values-list">
                        <div class="value-item">
                            <h3>Solidariedade</h3>
                            <p>Acreditamos no poder do altruísmo e na responsabilidade de ajudar quem precisa.</p>
                        </div>
                        <div class="value-item">
                            <h3>Transparência</h3>
                            <p>Mantemos comunicação clara e honesta com nossos usuários sobre o impacto de suas doações.
                            </p>
                        </div>
                        <div class="value-item">
                            <h3>Segurança</h3>
                            <p>Priorizamos a proteção de dados e a qualidade do sangue, seguindo rigorosamente os
                                protocolos de saúde.</p>
                        </div>
                        <div class="value-item">
                            <h3>Acessibilidade</h3>
                            <p>Tornamos a doação de sangue simples e acessível para todos, independentemente de sua
                                localização.</p>
                        </div>
                        <div class="value-item">
                            <h3>Inovação</h3>
                            <p>Utilizamos tecnologia de ponta para melhorar continuamente nossa plataforma e os serviços
                                oferecidos.</p>
                        </div>
                        <div class="value-item">
                            <h3>Colaboração</h3>
                            <p>Trabalhamos junto com hemocentros, profissionais de saúde e comunidades para alcançar
                                nossos objetivos.</p>
                        </div>
                    </div>
                </article>

                <article class="why-donate">
                    <h2>Por que Doar Sangue?</h2>
                    <p>
                        A doação de sangue é um ato de solidariedade que salva vidas. Cada doação pode beneficiar até
                        três pessoas
                        diferentes. Pessoas submetidas a cirurgias, vítimas de acidentes, pacientes com câncer e anemia,
                        e muitos outros
                        dependem de doações de sangue voluntárias para sobreviver.
                    </p>
                    <p>
                        Através da DoeSangue, você pode:
                    </p>
                    <ul>
                        <li><strong>Agendar doações</strong> de forma simples e conveniente</li>
                        <li><strong>Localizar hemocentros</strong> próximos a você</li>
                        <li><strong>Acompanhar seu histórico</strong> de doações</li>
                        <li><strong>Receber informações</strong> sobre como manter-se apto a doar</li>
                        <li><strong>Contribuir</strong> para salvar vidas em sua comunidade</li>
                    </ul>
                </article>

                <article class="commitment">
                    <h2>Nosso Compromisso</h2>
                    <p>
                        Comprometemo-nos com a excelência no atendimento aos doadores e hemocentros. Nossas iniciativas
                        incluem:
                    </p>
                    <ul>
                        <li>Manutenção de <strong>altos padrões de segurança</strong> em todos os processos</li>
                        <li><strong>Educação contínua</strong> sobre os benefícios e requisitos da doação de sangue</li>
                        <li><strong>Suporte personalizado</strong> para doadores e hemocentros</li>
                        <li><strong>Inovação constante</strong> para melhorar a experiência do usuário</li>
                        <li><strong>Sustentabilidade</strong> em nossas operações e práticas ambientais</li>
                    </ul>
                </article>
            </section>

            <div class="footer">
                <CustomButton label="Voltar" @click="router.back()" />
            </div>
        </main>
    </div>
</template>

<style scoped>
.background {
    background-color: var(--background-color);
}

header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px 0;
}

main {
    display: flex;
    flex-direction: column;
    gap: 20px;

    padding-top: 100px;
    padding-bottom: 100px;
    margin: 0 100px;
}

.about-content {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

article {
    padding: 20px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
}

article h2 {
    color: var(--primary-color);
    margin-bottom: 15px;
    font-size: 1.5rem;
}

article p {
    line-height: 1.8;
    color: var(--text-color);
    margin-bottom: 10px;
}

.intro p {
    font-size: 1.1rem;
    font-weight: 500;
}

.values-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 15px;
}

.value-item {
    padding: 15px;
    background-color: rgba(185, 28, 28, 0.1);
    border-left: 4px solid var(--primary-color);
    border-radius: 4px;
}

.value-item h3 {
    color: var(--primary-color);
    margin-bottom: 8px;
    font-size: 1.1rem;
}

.value-item p {
    font-size: 0.95rem;
    margin-bottom: 0;
}

article ul {
    list-style: none;
    padding-left: 0;
    margin-top: 15px;
}

article li {
    padding: 8px 0;
    padding-left: 25px;
    position: relative;
    color: var(--text-color);
    line-height: 1.6;
}

article li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-weight: bold;
}

.footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    margin-top: 20px;
}

.footer button {
    width: 200px;
}

@media (max-width: 768px) {
    main {
        margin: 0 30px;
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .values-list {
        grid-template-columns: 1fr;
    }

    article h2 {
        font-size: 1.3rem;
    }

    .intro p {
        font-size: 1rem;
    }
}
</style>