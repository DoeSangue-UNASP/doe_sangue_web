<template>
  <div class="container-detalhes">
    <div class="header">
      <router-link to="/hemocentro/gerenciar-doadores" class="volta">← Voltar</router-link>
      <h1>Detalhes do Doador</h1>
    </div>

    <div v-if="carregando" class="carregando">
      <div class="spinner"></div>
      <p>Carregando informações...</p>
    </div>

    <div v-else-if="erroCarregamento" class="alerta alerta-erro">
      {{ erroCarregamento }}
      <button @click="carregar" class="botao-link">Tentar novamente</button>
    </div>

    <div v-else class="conteudo">
      <!-- Cartão do Doador -->
      <div class="card-principal">
        <div class="header-card">
          <div class="info-doador">
            <h2>{{ doador?.nome }}</h2>
            <div class="badges">
              <span v-if="doador?.ehLead" class="badge badge-lead">Lead</span>
              <span v-if="doador?.ehUsuario" class="badge badge-usuario">Usuário</span>
            </div>
          </div>
          <div class="acoes">
            <router-link
              :to="`/hemocentro/agendar/${doador?.id}`"
              class="botao botao-primario"
            >
              📅 Agendar Doação
            </router-link>
          </div>
        </div>

        <div class="info-detalhes">
          <div class="info-item">
            <span class="label">CPF/Documento:</span>
            <span class="valor">{{ formatarCpf(doador?.documento || '') }}</span>
          </div>
          <div class="info-item">
            <span class="label">Telefone:</span>
            <span class="valor">{{ formatarTelefone(doador?.telefone || '') }}</span>
          </div>
          <div class="info-item">
            <span class="label">Data de Nascimento:</span>
            <span class="valor">{{ formatarDataBrasileira(doador?.dataNascimento || '') }}</span>
          </div>
          <div class="info-item">
            <span class="label">Sexo:</span>
            <span class="valor">{{ formatarSexo(doador?.sexo) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Tipo Sanguíneo:</span>
            <span class="valor">{{ doador?.tipoSanguineo || '-' }}</span>
          </div>
        </div>

        <div v-if="doador?.ehLead" class="alerta-info">
          <p>Este é um doador lead - foi cadastrado por este hemocentro mas ainda não se registrou na plataforma.</p>
        </div>
      </div>

      <!-- Abas de Conteúdo -->
      <div class="tabs">
        <button
          @click="abaAtiva = 'agendamentos'"
          :class="['tab', { ativo: abaAtiva === 'agendamentos' }]"
        >
          📅 Agendamentos
        </button>
        <button
          v-if="doador?.ehUsuario"
          @click="abaAtiva = 'doacoes'"
          :class="['tab', { ativo: abaAtiva === 'doacoes' }]"
        >
          🩸 Doações
        </button>
      </div>

      <!-- Aba: Agendamentos -->
      <div v-if="abaAtiva === 'agendamentos'" class="aba-conteudo">
        <div v-if="carregandoAgendamentos" class="carregando">
          <div class="spinner"></div>
          <p>Carregando agendamentos...</p>
        </div>

        <div v-else-if="erroAgendamentos" class="alerta alerta-erro">
          {{ erroAgendamentos }}
        </div>

        <div v-else-if="agendamentos.length === 0" class="vazio">
          <p>Nenhum agendamento registrado.</p>
        </div>

        <div v-else class="tabela-container">
          <table class="tabela">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Hemocentro</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="agendamento in agendamentos" :key="agendamento.id">
                <td>{{ formatarDataBrasileira(agendamento.agendadoPara) }}</td>
                <td>{{ agendamento.hemocentro.nomeFantasia }}</td>
                <td>
                  <span :class="['status', `status-${agendamento.status.toLowerCase()}`]">
                    {{ traduzirStatus(agendamento.status) }}
                  </span>
                </td>
                <td class="acoes">
                  <button
                    v-if="agendamento.status === 'AGENDADO'"
                    @click="cancelarAgendamento(agendamento.id)"
                    class="botao-acao botao-cancelar"
                    title="Cancelar agendamento"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Aba: Doações (apenas para usuários) -->
      <div v-if="abaAtiva === 'doacoes' && doador?.ehUsuario" class="aba-conteudo">
        <div v-if="carregandoDoacoes" class="carregando">
          <div class="spinner"></div>
          <p>Carregando histórico de doações...</p>
        </div>

        <div v-else-if="erroDoacoes" class="alerta alerta-erro">
          {{ erroDoacoes }}
        </div>

        <div v-else-if="doacoes.length === 0" class="vazio">
          <p>Nenhuma doação registrada ainda.</p>
        </div>

        <div v-else class="tabela-container">
          <table class="tabela">
            <thead>
              <tr>
                <th>Data</th>
                <th>Hemocentro</th>
                <th>Bolsas Coletadas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doacao in doacoes" :key="doacao.id">
                <td>{{ formatarDataBrasileira(doacao.agendadoPara) }}</td>
                <td>{{ doacao.hemocentro.nomeFantasia }}</td>
                <td>--</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mensagens de Feedback -->
      <div v-if="erroOperacao" class="alerta alerta-erro" style="margin-top: 1rem">
        {{ erroOperacao }}
      </div>

      <div v-if="sucessoOperacao" class="alerta alerta-sucesso" style="margin-top: 1rem">
        {{ sucessoOperacao }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { obterToken } from '@/services/auth';
import { buscarDoadorPorId, formatarSexo, type Doador } from '@/services/doador';
import {
  listarAgendamentosHemocentro,
  cancelarAgendamento as cancelarAgendamentoPorId,
  type Agendamento,
} from '@/services/agendamento';
import { ApiError } from '@/services/api';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const route = useRoute();
const token = obterToken();
const { sucesso, erro } = useToast();

if (!token) {
  router.push('/login');
}

const doadorId = route.params.doadorId as string;

const doador = ref<Doador | null>(null);
const agendamentos = ref<Agendamento[]>([]);
const doacoes = ref<Agendamento[]>([]);
const abaAtiva = ref<'agendamentos' | 'doacoes'>('agendamentos');

const carregando = ref(false);
const carregandoAgendamentos = ref(false);
const carregandoDoacoes = ref(false);
const erroCarregamento = ref('');
const erroAgendamentos = ref('');
const erroDoacoes = ref('');
const erroOperacao = ref('');
const sucessoOperacao = ref('');

function formatarCpf(cpf: string): string {
  const valor = cpf.replace(/\D/g, '');
  if (valor.length !== 11) return cpf;
  return valor.slice(0, 3) + '.' + valor.slice(3, 6) + '.' + valor.slice(6, 9) + '-' + valor.slice(9);
}

function formatarTelefone(telefone: string): string {
  const valor = telefone.replace(/\D/g, '');
  if (valor.length !== 11) return telefone;
  return '(' + valor.slice(0, 2) + ') ' + valor.slice(2, 7) + '-' + valor.slice(7);
}

function formatarDataBrasileira(data: string): string {
  if (!data) return '--/--/----';
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function traduzirStatus(status: string): string {
  const mapa: Record<string, string> = {
    AGENDADO: 'Agendado',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
  };
  return mapa[status] || status;
}

async function carregar(): Promise<void> {
  carregando.value = true;
  erroCarregamento.value = '';

  try {
    if (!token) {
      throw new Error('Token não disponível');
    }

    doador.value = await buscarDoadorPorId(doadorId, token);

    if (doador.value?.ehUsuario) {
      await carregarAgendamentos();
      await carregarDoacoes();
    } else {
      await carregarAgendamentos();
    }
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        erroCarregamento.value = 'Sua sessão expirou. Faça login novamente.';
        router.push('/login');
      } else {
        erroCarregamento.value = err.message || 'Erro ao carregar doador.';
      }
    } else if (err instanceof Error) {
      erroCarregamento.value = err.message;
    } else {
      erroCarregamento.value = 'Erro desconhecido.';
    }
  } finally {
    carregando.value = false;
  }
}

async function carregarAgendamentos(): Promise<void> {
  carregandoAgendamentos.value = true;
  erroAgendamentos.value = '';

  try {
    if (!token) {
      throw new Error('Token não disponível');
    }

    if (!doador.value?.documento) {
      throw new Error('Documento do doador não disponível');
    }

    const result = await listarAgendamentosHemocentro(
      { documento: doador.value.documento },
      token
    );

    agendamentos.value = result;
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status !== 401) {
      erroAgendamentos.value = err.message || 'Erro ao carregar agendamentos.';
    } else if (err instanceof Error) {
      erroAgendamentos.value = err.message;
    }
  } finally {
    carregandoAgendamentos.value = false;
  }
}

async function carregarDoacoes(): Promise<void> {
  carregandoDoacoes.value = true;
  erroDoacoes.value = '';

  try {
    if (!token) {
      throw new Error('Token não disponível');
    }

    if (!doador.value?.documento) {
      throw new Error('Documento do doador não disponível');
    }

    const result = await listarAgendamentosHemocentro(
      { documento: doador.value.documento },
      token
    );

    doacoes.value = result.filter((a) => a.status === 'CONCLUIDO');
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status !== 401) {
      erroDoacoes.value = err.message || 'Erro ao carregar histórico de doações.';
    } else if (err instanceof Error) {
      erroDoacoes.value = err.message;
    }
  } finally {
    carregandoDoacoes.value = false;
  }
}

async function cancelarAgendamento(agendamentoId: string): Promise<void> {
  if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

  erroOperacao.value = '';
  sucessoOperacao.value = '';

  try {
    if (!token) {
      throw new Error('Token não disponível');
    }

    await cancelarAgendamentoPorId(agendamentoId, token);
    const mensagem = 'Agendamento cancelado com sucesso!';
    sucessoOperacao.value = mensagem;
    sucesso(mensagem);

    setTimeout(() => {
      carregarAgendamentos();
      sucessoOperacao.value = '';
    }, 1500);
  } catch (err: unknown) {
    let mensagem = 'Erro desconhecido.';
    
    if (err instanceof ApiError) {
      mensagem = err.message || 'Erro ao cancelar agendamento.';
    } else if (err instanceof Error) {
      mensagem = err.message;
    }
    
    erroOperacao.value = mensagem;
    erro(mensagem);
  }
}

onMounted(() => {
  carregar();
});
</script>

<style scoped>
.container-detalhes {
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.volta {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.volta:hover {
  transform: translateX(-4px);
  color: #764ba2;
}

.header h1 {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.carregando {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.conteudo {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.card-principal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.info-doador h2 {
  margin: 0 0 0.75rem 0;
  color: #333;
  font-size: 1.75rem;
}

.badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-lead {
  background: #fff3cd;
  color: #856404;
}

.badge-usuario {
  background: #d4edda;
  color: #155724;
}

.acoes {
  display: flex;
  gap: 0.5rem;
}

.botao {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.botao-primario {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.botao-primario:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.info-detalhes {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item .label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}

.info-item .valor {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.alerta-info {
  padding: 1rem;
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  border-radius: 6px;
  margin-top: 1rem;
}

.alerta-info p {
  margin: 0;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
  background: white;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab {
  flex: 1;
  padding: 1rem;
  border: none;
  background: white;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab:hover {
  background: #f9f9f9;
  color: #333;
}

.tab.ativo {
  color: #667eea;
  border-bottom-color: #667eea;
}

.aba-conteudo {
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.vazio {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.tabela-container {
  overflow-x: auto;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.tabela thead {
  background: #f9f9f9;
  border-bottom: 2px solid #e0e0e0;
}

.tabela th {
  padding: 1rem;
  text-align: left;
  color: #333;
  font-weight: 600;
}

.tabela td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  color: #666;
}

.tabela tbody tr:hover {
  background: #fafafa;
}

.status {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-agendado {
  background: #cfe2ff;
  color: #084298;
}

.status-concluido {
  background: #d4edda;
  color: #155724;
}

.status-cancelado {
  background: #f8d7da;
  color: #842029;
}

.acoes {
  display: flex;
  gap: 0.5rem;
}

.botao-acao {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  padding: 0.4rem;
}

.botao-acao:hover {
  opacity: 1;
}

.botao-cancelar:hover {
  color: #c33;
}

.alerta {
  padding: 1.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.alerta-erro {
  background-color: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.alerta-sucesso {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #28a745;
}

.botao-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
}

@media (max-width: 768px) {
  .container-detalhes {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .header-card {
    flex-direction: column;
  }

  .info-detalhes {
    grid-template-columns: 1fr;
  }

  .tabs {
    flex-wrap: wrap;
  }

  .tab {
    flex: 1 1 calc(50% - 0.25rem);
  }

  .tabela {
    font-size: 0.85rem;
  }

  .tabela th,
  .tabela td {
    padding: 0.75rem;
  }
}
</style>
