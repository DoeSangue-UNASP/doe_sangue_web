<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RouteNames } from '../../router/route-names';
import CustomInput from '../../components/CustomInput.vue';
import RadioButtom from '../../components/RadioButtom.vue';
import CustomButton from '../../components/CustomButton.vue';
import CustomDropdown from '../../components/CustomDropdown.vue';
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import CustomSearchSelect from '../../components/CustomSearchSelect.vue';
import CustomSelect from '../../components/CustomSelect.vue';
import Badge from '../../components/Badge.vue';
import { useToast } from '../../composables/useToast';
import { obterToken } from '../../services/auth';
import * as agendamentoService from '../../services/agendamento';
import { buscarDoadores, formatarCpf, formatarDataNascimento, formatarSexo, type Doador } from '../../services/doador';
import {
    atualizarStatusBolsa,
    buscarBolsa,
    criarBolsa,
    formatarStatusBolsa,
    listarBolsasHemocentro,
    type BolsaSangue,
    type StatusBolsa,
} from '../../services/bolsa';

const route = useRoute();
const router = useRouter();
const { sucesso, erro } = useToast();

// A mesma tela cadastra uma bolsa e, no modo de visualização, mostra a bolsa e permite aprová-la ou reprová-la
const modoVisualizacao = computed(() => route.name === RouteNames.EDITAR_BOLSA_SANGUE_HEMOCENTRO);
const bolsaAtual = ref<BolsaSangue | null>(null);
const atualizandoStatus = ref(false);

const TipoSangue = ref("");
const FatorRH = ref("");
const TipoComponente = ref("");
const ResultadoSorologico = ref("");
const codigo = ref("");
const volume = ref("");
const dataColeta = ref("");
const dataDoacao = ref("");
const dataValidade = ref("");
const localColeta = ref("");
const destino = ref("");
const responsavelColeta = ref("");

const doadorSelecionadoId = ref("");
const agendamentoSelecionadoId = ref("");
const doadores = ref<Doador[]>([]);
const agendamentos = ref<agendamentoService.Agendamento[]>([]);
const bolsas = ref<BolsaSangue[]>([]);
const salvando = ref(false);

const apenasDigitos = (valor: string) => valor.replace(/\D/g, '');
const mensagemErro = (e: unknown, padrao: string) => (e as { message?: string }).message || padrao;
const apenasData = (data: string) => agendamentoService.formatarDataParaInput(data).split('T')[0] as string;

const doadorOptions = computed(() => {
    const opcoes = doadores.value.map((doador) => ({
        value: doador.id,
        label: doador.nome,
        description: `${formatarCpf(doador.documento)} · ${doador.ehLead ? 'Lead' : 'Usuário'}`,
    }));

    // Na visualização, o doador da bolsa sempre aparece, mesmo que não esteja na lista do hemocentro
    const bolsa = bolsaAtual.value;
    if (bolsa && !opcoes.some((opcao) => opcao.value === bolsa.doadorId)) {
        opcoes.push({ value: bolsa.doadorId, label: bolsa.doador, description: '' });
    }
    return opcoes;
});

const doadorSelecionado = computed(() => doadores.value.find((doador) => doador.id === doadorSelecionadoId.value));

// Uma bolsa só pode ser cadastrada para um agendamento concluído (ou já realizado, que será concluído ao salvar)
// e cada agendamento comporta uma única bolsa
const agendamentosElegiveis = computed(() => {
    const doador = doadorSelecionado.value;
    if (!doador) return [];

    const comBolsa = new Set(bolsas.value.map((bolsa) => bolsa.agendamentoId));
    const agora = Date.now();

    return agendamentos.value
        .filter((agendamento) =>
            apenasDigitos(agendamento.doador.documento) === apenasDigitos(doador.documento) &&
            !comBolsa.has(agendamento.id) &&
            (agendamento.status === 'CONCLUIDO' ||
                (agendamento.status === 'AGENDADO' && new Date(agendamento.agendadoPara).getTime() <= agora)))
        .sort((a, b) => new Date(b.agendadoPara).getTime() - new Date(a.agendadoPara).getTime());
});

const agendamentoOptions = computed(() => {
    if (modoVisualizacao.value && bolsaAtual.value) {
        return [{ value: bolsaAtual.value.agendamentoId, label: agendamentoService.formatarDataBrasileira(bolsaAtual.value.agendadoPara) }];
    }

    return [
        { value: '', label: agendamentosElegiveis.value.length ? 'Selecione o agendamento' : 'Nenhum agendamento disponível' },
        ...agendamentosElegiveis.value.map((agendamento) => ({
            value: agendamento.id,
            label: `${agendamentoService.formatarDataBrasileira(agendamento.agendadoPara)} · ${agendamento.status === 'CONCLUIDO' ? 'Concluído' : 'Aguardando conclusão'}`,
        })),
    ];
});

const agendamentoSelecionado = computed(() =>
    agendamentosElegiveis.value.find((agendamento) => agendamento.id === agendamentoSelecionadoId.value)
);

// Ao escolher o doador, carrega o tipo sanguíneo e já seleciona o agendamento quando houver um só
const aoSelecionarDoador = () => {
    if (modoVisualizacao.value) return;

    agendamentoSelecionadoId.value = '';
    dataDoacao.value = '';

    const tipo = doadorSelecionado.value?.tipoSanguineo;
    if (tipo) {
        TipoSangue.value = tipo.replace(/[+-]$/, '');
        FatorRH.value = tipo.endsWith('+') ? 'Positivo' : 'Negativo';
    }

    if (agendamentosElegiveis.value.length === 1) {
        agendamentoSelecionadoId.value = agendamentosElegiveis.value[0]!.id;
    }
};

const aoSelecionarAgendamento = () => {
    if (modoVisualizacao.value) return;

    const agendamento = agendamentoSelecionado.value;
    dataDoacao.value = agendamento ? apenasData(agendamento.agendadoPara) : '';
    if (agendamento && !dataColeta.value) dataColeta.value = dataDoacao.value;
};

const variantePorStatus: Record<StatusBolsa, 'success' | 'warning' | 'danger'> = {
    DISPONIVEL: 'success',
    EM_ANALISE: 'warning',
    VENCIDA: 'danger',
    DESCARTADA: 'danger',
};

const preencherComBolsa = (bolsa: BolsaSangue) => {
    bolsaAtual.value = bolsa;
    doadorSelecionadoId.value = bolsa.doadorId;
    agendamentoSelecionadoId.value = bolsa.agendamentoId;
    codigo.value = bolsa.codigo;
    TipoSangue.value = bolsa.tipoSanguineo.trim().toUpperCase().replace(/[+-]$/, '');
    FatorRH.value = bolsa.fatorRh.toLowerCase().includes('neg') || bolsa.fatorRh.includes('-') ? 'Negativo' : 'Positivo';
    volume.value = String(bolsa.volume);
    dataColeta.value = bolsa.dataColeta ? bolsa.dataColeta.slice(0, 10) : '';
    dataValidade.value = bolsa.dataValidade ? bolsa.dataValidade.slice(0, 10) : '';
    dataDoacao.value = apenasData(bolsa.agendadoPara);
    localColeta.value = bolsa.localColeta ?? '';
    destino.value = bolsa.destino ?? '';
    responsavelColeta.value = bolsa.responsavelColeta ?? '';
    ResultadoSorologico.value = bolsa.testeSorologico;
    TipoComponente.value = bolsa.tipoComponente;
};

async function carregarBolsaAtual() {
    try {
        preencherComBolsa(await buscarBolsa(route.params.id as string, obterToken() ?? ''));
    } catch (e) {
        erro(mensagemErro(e, 'Não foi possível carregar a bolsa de sangue.'));
    }
}

async function alterarStatus(status: StatusBolsa) {
    if (!bolsaAtual.value) return;

    atualizandoStatus.value = true;
    try {
        await atualizarStatusBolsa(bolsaAtual.value.id, status, obterToken() ?? '');
        sucesso(status === 'DISPONIVEL' ? 'Bolsa aprovada e disponível no estoque.' : 'Bolsa reprovada e descartada.');
        await carregarBolsaAtual();
    } catch (e) {
        erro(mensagemErro(e, 'Não foi possível atualizar o status da bolsa.'));
    } finally {
        atualizandoStatus.value = false;
    }
}

async function carregarDados() {
    const token = obterToken() ?? '';
    const [listaDoadores, listaAgendamentos, listaBolsas] = await Promise.allSettled([
        buscarDoadores(token),
        agendamentoService.listarAgendamentosHemocentro({}, token),
        listarBolsasHemocentro(token),
    ]);

    if (listaDoadores.status === 'fulfilled') doadores.value = listaDoadores.value;
    if (listaAgendamentos.status === 'fulfilled') agendamentos.value = listaAgendamentos.value;
    if (listaBolsas.status === 'fulfilled') bolsas.value = listaBolsas.value;

    const falha = [listaDoadores, listaAgendamentos, listaBolsas].find((resultado) => resultado.status === 'rejected');
    if (falha && falha.status === 'rejected') {
        erro(mensagemErro(falha.reason, 'Não foi possível carregar os dados do formulário.'));
    }
}

async function salvar() {
    const agendamento = agendamentoSelecionado.value;
    const obrigatorios = [
        [doadorSelecionadoId.value, 'Selecione o doador.'],
        [agendamentoSelecionadoId.value, 'Selecione o agendamento.'],
        [codigo.value.trim(), 'Informe o código da bolsa.'],
        [TipoSangue.value, 'Escolha o tipo sanguíneo.'],
        [FatorRH.value, 'Escolha o fator RH.'],
        [volume.value.trim(), 'Informe o volume.'],
        [dataColeta.value, 'Informe a data de coleta.'],
        [dataValidade.value, 'Informe a data de validade.'],
        [ResultadoSorologico.value, 'Escolha o resultado sorológico.'],
        [TipoComponente.value, 'Escolha o tipo de componente.'],
    ] as const;

    const faltando = obrigatorios.find(([valor]) => !valor);
    if (faltando || !agendamento) {
        erro(faltando ? faltando[1] : 'Selecione o agendamento.');
        return;
    }

    const volumeNumerico = Number(volume.value.replace(',', '.').replace(/[^\d.]/g, ''));
    if (!volumeNumerico || volumeNumerico <= 0) {
        erro('Informe um volume válido.');
        return;
    }

    salvando.value = true;
    try {
        const token = obterToken() ?? '';
        if (agendamento.status === 'AGENDADO') {
            await agendamentoService.concluirAgendamento(agendamento.id, token);
        }

        await criarBolsa({
            agendamentoId: agendamento.id,
            codigo: codigo.value.trim(),
            testeSorologico: ResultadoSorologico.value,
            tipoComponente: TipoComponente.value,
            fatorRh: FatorRH.value,
            tipoSanguineo: TipoSangue.value,
            volume: volumeNumerico,
            dataColeta: `${dataColeta.value}T00:00:00`,
            dataValidade: `${dataValidade.value}T00:00:00`,
            localColeta: localColeta.value,
            destino: destino.value,
            responsavelColeta: responsavelColeta.value,
        }, token);

        sucesso('Bolsa de sangue cadastrada com sucesso!');
        router.push({ name: RouteNames.BOLSAS_SANGUE_HEMOCENTRO });
    } catch (e) {
        erro(mensagemErro(e, 'Não foi possível cadastrar a bolsa de sangue.'));
    } finally {
        salvando.value = false;
    }
}

watch(doadorSelecionadoId, aoSelecionarDoador);
watch(agendamentoSelecionadoId, aoSelecionarAgendamento);

onMounted(async () => {
    await carregarDados();
    if (modoVisualizacao.value) await carregarBolsaAtual();
});
</script>

<template>
    <div class="view-container">
        <header>
            <h1 v-if="route.name === RouteNames.CRIAR_BOLSA_SANGUE_HEMOCENTRO">Cadastrar Bolsa de Sangue</h1>
            <h1 v-if="modoVisualizacao">Detalhes da Bolsa de Sangue</h1>
            <Badge v-if="modoVisualizacao && bolsaAtual" :variant="variantePorStatus[bolsaAtual.status]">
                {{ formatarStatusBolsa(bolsaAtual.status) }}
            </Badge>
        </header>
        <main>
            <fieldset class="campos" :disabled="modoVisualizacao">
            <label class="poppins-medium">Doador</label>
            <hr class="solid-separator">
            <div id="SecaoDoador">
                <CustomSearchSelect style="width: 540px;" id="doador" label="Doador"
                    placeholder="Pesquisar por nome ou CPF" v-model="doadorSelecionadoId" :options="doadorOptions"
                    empty-text="Nenhum doador encontrado" />
                <CustomSelect style="width: 400px;" id="agendamento-bolsa" label="Agendamento"
                    v-model="agendamentoSelecionadoId" :options="agendamentoOptions"
                    :disabled="!doadorSelecionado" />
            </div>
            <div v-if="doadorSelecionado" class="info-doador">
                <div><span>CPF</span><p>{{ formatarCpf(doadorSelecionado.documento) }}</p></div>
                <div><span>Telefone</span><p>{{ doadorSelecionado.telefone }}</p></div>
                <div><span>Data de nascimento</span><p>{{ formatarDataNascimento(doadorSelecionado.dataNascimento) }}</p></div>
                <div><span>Sexo</span><p>{{ formatarSexo(doadorSelecionado.sexo) }}</p></div>
                <div><span>Tipo sanguíneo</span><p>{{ doadorSelecionado.tipoSanguineo || '-' }}</p></div>
            </div>

            <label class="poppins-medium">Identificação da Unidade</label>
            <hr class="solid-separator">
            <div id="IdentificaoUnidade">
                <CustomInput style="width: 300px;" label="Código da Bolsa de Sangue" id="codigo-bolsa-sangue"
                    v-model="codigo" placeholder="Escreva o código" />

                <CustomDropdown style="width: 300px;" title="Tipo Sanguíneo" label="Escolha o tipo sanguíneo"
                    id="condicao-bolsa" :options="[
                        'A',
                        'B',
                        'AB',
                        'O'
                    ]" v-model="TipoSangue" :disabled="modoVisualizacao" />
                <div id="fator-rh-geral">
                    <Label class="poppins-regular">Fator RH</Label>
                    <div style="display: flex; flex-direction: row; gap: 16px; margin-top: 12px;">
                        <RadioButtom label="Positivo (+)" value="Positivo" Group="FatorRH" v-model="FatorRH" />
                        <RadioButtom label="Negativo (-)" value="Negativo" Group="FatorRH" v-model="FatorRH" />
                    </div>
                </div>
            </div>
            <label class="poppins-medium">Dados Logísticos</label>
            <hr class="solid-separator">
            <div id="DadosLogisticos">
                <div id="DadosLogisticosLinha1">
                    <CustomInput style="width: 300px;" label="Volume(mL)" id="volume-bolsa-sangue" v-model="volume"
                        placeholder="450" />
                    
                    <CustomDatePicker title="Data de Coleta" id="data-coleta" v-model="dataColeta"
                        :disabled="modoVisualizacao" />
                    <CustomInput style="width: 400px;" label="Local de Coleta" id="local-coleta" v-model="localColeta"
                        placeholder="Ex: Hospital Central" />
                </div>
                <div id="DadosLogisticosLinha2">
                    <CustomInput style="width: 540px;" label="Destino / Hospital" id="destino-hospital"
                        v-model="destino" placeholder="Ex: Hospital Santa Catarina" />
                    <CustomInput style="width: 430px;" label="Responsável pela Coleta" id="responsavel-coleta"
                        v-model="responsavelColeta" placeholder="Ex: João Silva" />
                </div>
                <div id="DadosLogisticosLinha3">
                    <CustomDatePicker title="Data de Doação" id="data-doacao" v-model="dataDoacao" disabled />
                    <CustomDatePicker title="Data de Validade" id="data-validade" v-model="dataValidade"
                        :disabled="modoVisualizacao" />
                </div>
            </div>
            <label class="poppins-medium">Dados Clínicos</label>
            <hr class="solid-separator">
            <div id="dados-clinicos">
                <div id="resultado-sorologico">
                    <Label class="poppins-regular">Resultado Sorológico</Label>
                    <div style="display: flex; flex-direction: row; gap: 16px; margin-top: 12px;">
                        <RadioButtom label="Negativo Geral" Group="ResultadoSorologico" v-model="ResultadoSorologico" />
                        <RadioButtom label="Hepatite B e C" Group="ResultadoSorologico" v-model="ResultadoSorologico" />
                        <RadioButtom label="Sífilis" Group="ResultadoSorologico" v-model="ResultadoSorologico" />
                        <RadioButtom label="HIV" Group="ResultadoSorologico" v-model="ResultadoSorologico" />
                    </div>
                </div>

                <div id="tipo-componente">
                    <Label class="poppins-regular">Tipo de Componente</Label>
                    <div style="display: flex; flex-direction: row; gap: 16px; margin-top: 12px;">
                        <RadioButtom label="Sangue Total" Group="TipoComponente" v-model="TipoComponente" />
                        <RadioButtom label="Conc. Hemácias" Group="TipoComponente" v-model="TipoComponente" />
                        <RadioButtom label="Plasma" Group="TipoComponente" v-model="TipoComponente" />
                        <RadioButtom label="Plaquetas" Group="TipoComponente" v-model="TipoComponente" />
                        <RadioButtom label="Crioprecipitado" Group="TipoComponente" v-model="TipoComponente" />
                    </div>
                </div>
            </div>
            </fieldset>

            <div class="action-btn" v-if="route.name === RouteNames.CRIAR_BOLSA_SANGUE_HEMOCENTRO">
                <CustomButton :label="salvando ? 'Salvando...' : 'Salvar'" :disabled="salvando" @click="salvar" />
            </div>
            <div class="action-btn" v-if="modoVisualizacao && bolsaAtual?.status === 'EM_ANALISE'">
                <CustomButton label="Reprovada" secondary red-font-color :disabled="atualizandoStatus"
                    @click="alterarStatus('DESCARTADA')" />
                <CustomButton label="Aprovada" :disabled="atualizandoStatus" @click="alterarStatus('DISPONIVEL')" />
            </div>

        </main>
    </div>
</template>

<style scoped>
.view-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    height: 100%;
}


main {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.campos {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
}

header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
}

div#SecaoDoador {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 20px;
}

.info-doador {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 32px;
    padding: 16px 20px;
    border: 1px solid var(--input-border-color);
    border-radius: 12px;
}

.info-doador span {
    font-size: 12px;
    color: #6b7280;
}

.info-doador p {
    margin: 4px 0 0;
}

div#IdentificaoUnidade {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

div#DadosLogisticosLinha1 {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

div#DadosLogisticosLinha2 {
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin: 8px 0;
}

div#DadosLogisticosLinha3 {
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin: 16px 0;
}

div#dados-clinicos {
    display: flex;
    flex-direction: row;
    gap: 30px;
}

.template-inputs {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    gap: 20px
}

.template-inputs div {
    width: 100%;
}

.action-btn {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    gap: 20px;
    width: 100%;
}

.action-btn button {
    width: 200px;
}

.solid-separator {
    border: 0;
    height: 1px;
    background-color: #e0e0e0; 
}

</style>
