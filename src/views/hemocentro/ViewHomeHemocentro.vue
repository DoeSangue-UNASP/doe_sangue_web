<script setup lang="ts">
import { PhHandHeart } from '@phosphor-icons/vue';
import type { ApexOptions } from 'apexcharts';
import VueApexCharts from 'vue3-apexcharts';
import CustomButton from '../../components/CustomButton.vue';
import CustomInput from '../../components/CustomInput.vue';
import { router } from '../../router';
import { RouteNames } from '../../router/route-names';

const doadores = [
    {
        nome: "fulano",
        data: "01/11/2025 10:45",
        tipo_sangue: "O+"
    },
    {
        nome: "fulano",
        data: "01/11/2025 10:45",
        tipo_sangue: "O+"
    }
];

const estoqueSangue = [
    { tipo: 'A+', quantidade: 32 },
    { tipo: 'A-', quantidade: 12 },
    { tipo: 'B+', quantidade: 24 },
    { tipo: 'B-', quantidade: 8 },
    { tipo: 'AB+', quantidade: 15 },
    { tipo: 'AB-', quantidade: 5 },
    { tipo: 'O+', quantidade: 40 },
    { tipo: 'O-', quantidade: 10 }
];

const totalEstoque = estoqueSangue.reduce((acumulado, item) => acumulado + item.quantidade, 0);

const estoquePercentual = estoqueSangue.map((item) => ({
    tipo: item.tipo,
    percentual: totalEstoque === 0 ? 0 : Number(((item.quantidade / totalEstoque) * 100).toFixed(2))
}));

const estoqueSeries = [
    {
        name: 'Percentual do estoque',
        data: estoquePercentual.map((item) => item.percentual)
    }
];

const estoqueChartOptions: ApexOptions = {
    chart: {
        fontFamily: 'Poppins, sans-serif',
        toolbar: {
            show: true
        }
    },
    colors: ['var(--primary-color)'],
    plotOptions: {
        bar: {
            borderRadius: 4,
            columnWidth: '50%'
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        fontSize: '14px'
    },
    xaxis: {
        categories: estoquePercentual.map((item) => item.tipo),
        labels: {
            style: {
                fontSize: '14px'
            }
        },
        title: {
            text: 'Tipo sanguíneo',
            style: {
                fontSize: '16px'
            }
        }
    },
    yaxis: {
        title: {
            text: 'Percentual do estoque total (%)',
            style: {
                fontSize: '16px'
            }
        },
        min: 0,
        max: 100,
        tickAmount: 10,
        labels: {
            style: {
                fontSize: '14px'
            },
            formatter: (valor) => `${valor.toFixed(0)}%`
        }
    },
    tooltip: {
        y: {
            formatter: (valor) => `${valor.toFixed(2)}%`
        }
    }
};
</script>

<template>
    <div class="view-container">
        <header>
            <h1>Olá, Hemocentro!</h1>
            <CustomButton label="Nova Doação" @click="router.push(RouteNames.CRIAR_BOLSA_SANGUE_HEMOCENTRO)" />
        </header>
        <main>
            <section class="secao-ultimas-doacoes">
                <div class="header-ultimas-doacoes">
                    <h2>Últimas Doações</h2>
                    <CustomInput label="Pesquisar" id="pesquisar" model-value="" placeholder="pesquisar" />
                </div>
                <div class="listagem-ultimas-doacoes">
                    <div class="ultimas-doacoes" v-for="doador in doadores">
                        <div class="icon">
                            <PhHandHeart size="25" color="var(--primary-color)" />
                        </div>
                        <div class="nome-data">
                            <p>{{ doador.nome }}</p>
                            <p>{{ doador.data }}</p>
                        </div>
                        <div class="tipo-sangue">
                            <p>{{ doador.tipo_sangue }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="grafico">
                <h2>Banco de Sangue</h2>
                <div class="grafico-container">
                    <VueApexCharts type="bar" height="100%" width="100%" :options="estoqueChartOptions"
                        :series="estoqueSeries" />
                </div>
            </section>
        </main>
    </div>
</template>

<style scoped>
.view-container {
    display: flex;
    flex-direction: column;
    gap: 50px;
    height: 100%;
}

header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

header button {
    width: 200px;
}

main section {
    border: 1px solid;
    border-color: var(--input-border-color);
    border-radius: 16px;
    height: 100%;
}

main section:nth-child(1) {
    width: 40%;
}

main section:nth-child(2) {
    width: 60%;
}

main {
    display: flex;
    flex-direction: row;
    gap: 20px;

    height: 100%;
}

.secao-ultimas-doacoes {
    height: 100%;
    padding: 30px;

    display: flex;
    flex-direction: column;

    gap: 20px;
}

.header-ultimas-doacoes {
    display: flex;
    flex-direction: column;

    gap: 20px;
}

.ultimas-doacoes {
    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: space-evenly;
    gap: 20px;

    width: 100%;

    border: 1px solid;
    border-color: var(--input-border-color);
    border-radius: 16px;

    padding: 20px;
}

.listagem-ultimas-doacoes {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.grafico {
    padding: 30px;

    display: flex;
    flex-direction: column;
    gap: 20px;
}

.grafico-container {
    flex: 1;
    min-height: 0;
}
</style>