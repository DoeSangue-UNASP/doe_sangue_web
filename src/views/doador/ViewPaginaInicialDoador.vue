<script setup lang="ts">
import { PhCalendarDots } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import CustomInput from '../../components/CustomInput.vue';

</script>

<template>
    <div class="view-container">
        <header class="home-header">
            <section class="welcome">
                <h1 class="poppins-bold">Olá, doador!</h1>
            </section>
            <section class="btn-hemocentro">
                <CustomButton label="Buscar Hemocentro"/>
            </section>
        </header>
        <main>
            <div class="next-donation">
                <div class="next-donation-title">
                    <PhCalendarDots size="25"/>
                    <h2>Seu próximo agendamento</h2>
                </div>
                <p class="next-dotaion-info"><span>Data: </span>20/12/2025</p>
                <p class="next-dotaion-info"><span>Hora: </span>10:00</p>
                <p class="next-dotaion-info"><span>Local: </span>Hemocentro</p>
            </div>
            <div class="last-donations">
                <div class="last-dontaion-title">
                    <h2>Últimas Doações</h2>
                </div>
                <CustomInput label="Hemocentro" id="hemocentro" model-value="" placeholder="Pesquisar"/>
            </div>
        </main>
    </div>
</template>

<style scoped>
.view-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.home-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    gap: 50px;
}

.welcome {
    width: 100%;
}

.btn-hemocentro {
    display: flex;
    justify-content: flex-end;

    width: 100%;
}

.btn-hemocentro button {
    width: 200px;
}

main {
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.next-donation {
    display: flex;
    flex-direction: column;
    gap: 10px;

    border: 1px solid;
    border-color: var(--input-border-color);
    border-radius: 16px;
    padding: 30px;
}

.next-donation-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
}

.last-donations {
    display: flex;
    flex-direction: column;
    gap: 30px;

    border: 1px solid;
    border-color: var(--input-border-color);
    border-radius: 16px;
    padding: 16px;
}
</style>