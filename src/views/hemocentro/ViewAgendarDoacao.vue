<template>
  <div class="container-agendar">
    <div class="header">
      <router-link to="/hemocentro/gerenciar-doadores" class="volta">← Voltar</router-link>
      <h1>Agendar Doação</h1>
    </div>

    <div v-if="carregando" class="carregando">
      <div class="spinner"></div>
      <p>Carregando informações do doador...</p>
    </div>

    <div v-else-if="erroCarregamento" class="alerta alerta-erro">
      {{ erroCarregamento }}
      <button @click="carregarDoador" class="botao-link">Tentar novamente</button>
    </div>

    <div v-else class="conteudo">
      <!-- Informações do Doador -->
      <div class="card-doador">
        <h2>Doador: {{ doador?.nome }}</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">CPF:</span>
            <span class="valor">{{ formatarCpf(doador?.documento || '') }}</span>
          </div>
          <div class="info-item">
            <span class="label">Telefone:</span>
            <span class="valor">{{ formatarTelefone(doador?.telefone || '') }}</span>
          </div>
          <div class="info-item" v-if="doador?.ehLead" style="grid-column: 1 / -1">
            <span class="badge badge-aviso">⚠️ Este é um lead - não pode ser agendado</span>
          </div>
        </div>
      </div>

      <!-- Formulário de Agendamento -->
      <form @submit.prevent="agendar" class="formulario-agendamento" v-if="doador?.ehUsuario">
        <div class="form-group">
          <label for="hemocentro">Hemocentro:</label>
          <select v-model="formData.hemocentroId" id="hemocentro" required>
            <option value="">Selecione um hemocentro</option>
            <option v-for="hemocen in hemocentros" :key="hemocen.id" :value="hemocen.id">
              {{ hemocen.nomeFantasia }}
            </option>
          </select>
          <small v-if="hemocentroSelecionado">
            Funcionamento: {{ formatarHorario(hemocentroSelecionado.abreEm) }} -
            {{ formatarHorario(hemocentroSelecionado.fechaEm) }}
          </small>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="data">Data:</label>
            <input v-model="formData.data" id="data" type="date" required />
          </div>
          <div class="form-group">
            <label for="hora">Hora:</label>
            <input v-model="formData.hora" id="hora" type="time" required />
          </div>
        </div>

        <div class="aviso-data" v-if="formData.data || formData.hora">
          <span v-if="validarDataFutura()">✓ Data e hora válidas</span>
          <span v-else class="erro">✗ A data deve ser no futuro</span>
        </div>

        <div class="botoes">
          <button type="submit" class="botao botao-primario" :disabled="carregandoSubmit || !validarFormulario()">
            <span v-if="carregandoSubmit">Agendando...</span>
            <span v-else>Confirmar Agendamento</span>
          </button>
          <router-link to="/hemocentro/gerenciar-doadores" class="botao botao-secundario">
            Cancelar
          </router-link>
        </div>
      </form>

      <div v-else-if="doador?.ehLead" class="alerta alerta-aviso">
        <p>
          Não é possível agendar uma doação com um lead. O doador deve se cadastrar na plataforma
          primeiro.
        </p>
      </div>

      <!-- Mensagem de Sucesso -->
      <div v-if="sucessoFormulario" class="alerta alerta-sucesso">
        ✓ Agendamento criado com sucesso!
      </div>

      <!-- Mensagem de Erro -->
      <div v-if="erroFormulario" class="alerta alerta-erro">
        {{ erroFormulario }}
        <button @click="erroFormulario = ''" class="botao-link">Descartar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { obterToken } from '@/services/auth';
import { buscarDoadorPorId, type Doador } from '@/services/doador';
import { criarAgendamentoHemocentro } from '@/services/agendamento';
import { ApiError } from '@/services/api';
import { useToast } from '@/composables/useToast';

interface Hemocentro {
  id: string;
  nomeFantasia: string;
  abreEm: string;
  fechaEm: string;
}

const router = useRouter();
const route = useRoute();
const token = obterToken();
const { sucesso, erro } = useToast();

if (!token) {
  router.push('/login');
}

const doadorId = route.params.doadorId as string;

const doador = ref<Doador | null>(null);
const hemocentros = ref<Hemocentro[]>([]);
const carregando = ref(false);
const carregandoSubmit = ref(false);
const erroCarregamento = ref('');
const erroFormulario = ref('');
const sucessoFormulario = ref(false);

const formData = ref({
  hemocentroId: '',
  data: '',
  hora: '',
});

const hemocentroSelecionado = computed(() => {
  return hemocentros.value.find((h) => h.id === formData.value.hemocentroId);
});

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

function formatarHorario(hora: string): string {
  if (!hora) return '--:--';
  const [h, m] = hora.split(':');
  return `${h}:${m}`;
}

function validarDataFutura(): boolean {
  if (!formData.value.data || !formData.value.hora) return false;
  const datetime = `${formData.value.data}T${formData.value.hora}`;
  const data = new Date(datetime);
  return data > new Date();
}

function validarFormulario(): boolean {
  return (
    formData.value.hemocentroId !== '' &&
    formData.value.data !== '' &&
    formData.value.hora !== '' &&
    validarDataFutura()
  );
}

async function carregarDoador(): Promise<void> {
  carregando.value = true;
  erroCarregamento.value = '';

  try {
    if (!token) {
      throw new Error('Token não disponível');
    }

    doador.value = await buscarDoadorPorId(doadorId, token);

    // TODO: Buscar lista de hemocentros da API
    // Por enquanto, usando dados mock
    hemocentros.value = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        nomeFantasia: 'Hemocentro Central',
        abreEm: '08:00',
        fechaEm: '17:00',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        nomeFantasia: 'Hemocentro Zona Leste',
        abreEm: '09:00',
        fechaEm: '18:00',
      },
    ];
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
      erroCarregamento.value = 'Erro desconhecido ao carregar doador.';
    }
  } finally {
    carregando.value = false;
  }
}

async function agendar(): Promise<void> {
  if (!doador || !validarFormulario()) return;

  carregandoSubmit.value = true;
  erroFormulario.value = '';
  sucessoFormulario.value = false;

  try {
    if (!token) {
      throw new Error('Token não disponível');
    }

    const agendadoPara = `${formData.value.data}T${formData.value.hora}:00`;

    await criarAgendamentoHemocentro(
      {
        doadorId: doador.value!.id,
        hemocentroId: formData.value.hemocentroId,
        agendadoPara,
      },
      token
    );

    const mensagem = 'Agendamento criado com sucesso!';
    sucessoFormulario.value = true;
    sucesso(mensagem);
    
    setTimeout(() => {
      router.push('/hemocentro/gerenciar-doadores');
    }, 2000);
  } catch (err: unknown) {
    let mensagem = 'Erro ao agendar doação.';
    
    if (err instanceof ApiError) {
      if (err.status === 401) {
        mensagem = 'Sua sessão expirou. Faça login novamente.';
        router.push('/login');
      } else {
        mensagem = err.message || mensagem;
      }
    } else if (err instanceof Error) {
      mensagem = err.message;
    }
    
    erroFormulario.value = mensagem;
    erro(mensagem);
  } finally {
    carregandoSubmit.value = false;
  }
}

onMounted(() => {
  carregarDoador();
});
</script>

<style scoped>
.container-agendar {
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
  max-width: 600px;
  margin: 0 auto;
}

.card-doador {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-doador h2 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}

.info-item .valor {
  font-size: 1rem;
  color: #333;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.badge-aviso {
  background: #fff3cd;
  color: #856404;
}

.formulario-agendamento {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  background: white;
}

.form-group select:focus,
.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group small {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.85rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.aviso-data {
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  background: #d4edda;
  color: #155724;
  font-size: 0.9rem;
}

.aviso-data .erro {
  color: #c33;
  background: #fee;
}

.botoes {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.botao {
  flex: 1;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.botao-primario {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.botao-primario:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.botao-primario:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.botao-secundario {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.botao-secundario:hover {
  background: #667eea;
  color: white;
}

.alerta {
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
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

.alerta-aviso {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
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
  .container-agendar {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .botoes {
    flex-direction: column;
  }
}
</style>
