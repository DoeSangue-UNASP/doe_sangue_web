<template>
  <div class="container-doadores">
    <div class="header">
      <div class="titulo">
        <h1>Gerenciar Doadores</h1>
        <p>Visualize e gerencie todos os seus leads e doadores usuários</p>
      </div>
      <router-link to="/hemocentro/cadastrar-lead" class="botao botao-primario">
        + Cadastrar Lead
      </router-link>
    </div>

    <div v-if="carregando" class="carregando">
      <div class="spinner"></div>
      <p>Carregando doadores...</p>
    </div>

    <div v-else-if="erro" class="alerta alerta-erro">
      {{ erro }}
      <button @click="carregar" class="botao-link">Tentar novamente</button>
    </div>

    <div v-else-if="doadores.length === 0" class="vazio">
      <p>Nenhum doador cadastrado ainda.</p>
      <router-link to="/hemocentro/cadastrar-lead" class="botao botao-secundario">
        Cadastrar primeiro lead
      </router-link>
    </div>

    <div v-else class="tabela-container">
      <table class="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF/Documento</th>
            <th>Telefone</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doador in doadorsFiltrados" :key="doador.id" :class="{ 'lead': doador.ehLead }">
            <td>{{ doador.nome }}</td>
            <td>{{ formatarCpf(doador.documento) }}</td>
            <td>{{ formatarTelefone(doador.telefone) }}</td>
            <td>
              <span v-if="doador.ehLead" class="badge badge-lead">Lead</span>
              <span v-else class="badge badge-usuario">Usuário</span>
            </td>
            <td class="acoes">
              <button @click="visualizar(doador)" class="botao-acao" title="Visualizar">
                👁️
              </button>
              <button
                @click="agendar(doador)"
                class="botao-acao"
                title="Agendar doação"
              >
                📅
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!carregando && doadores.length > 0" class="filtro">
      <input
        v-model="filtro"
        type="text"
        placeholder="Filtrar por nome ou CPF..."
        class="input-filtro"
      />
    </div>

    <div v-if="!carregando && doadores.length > 0" class="resumo">
      <span>Total de leads: {{ contarLeads() }}</span>
      <span>Total de usuários: {{ contarUsuarios() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { obterToken } from '@/services/auth';
import { buscarDoadores, type Doador } from '@/services/doador';
import { ApiError } from '@/services/api';

const router = useRouter();
const token = obterToken();

if (!token) {
  router.push('/login');
}

const doadores = ref<Doador[]>([]);
const carregando = ref(false);
const erro = ref('');
const filtro = ref('');

const doadorsFiltrados = computed(() => {
  if (!filtro.value) return doadores.value;

  const termo = filtro.value.toLowerCase();
  return doadores.value.filter(
    (d) =>
      d.nome.toLowerCase().includes(termo) ||
      d.documento.includes(termo.replace(/\D/g, ''))
  );
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

function contarLeads(): number {
  return doadores.value.filter((d) => d.ehLead).length;
}

function contarUsuarios(): number {
  return doadores.value.filter((d) => d.ehUsuario).length;
}

function visualizar(doador: Doador): void {
  router.push(`/hemocentro/doador/${doador.id}`);
}

function agendar(doador: Doador): void {
  router.push(`/hemocentro/agendar/${doador.id}`);
}

async function carregar(): Promise<void> {
  carregando.value = true;
  erro.value = '';

  try {
    if (!token) {
      throw new Error('Token não disponível');
    }

    doadores.value = await buscarDoadores(token);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        erro.value = 'Sua sessão expirou. Faça login novamente.';
        router.push('/login');
      } else {
        erro.value = err.message || 'Erro ao carregar doadores.';
      }
    } else if (err instanceof Error) {
      erro.value = err.message;
    } else {
      erro.value = 'Erro desconhecido ao carregar doadores.';
    }
  } finally {
    carregando.value = false;
  }
}

onMounted(() => {
  carregar();
});
</script>

<style scoped>
.container-doadores {
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.titulo h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.titulo p {
  color: #666;
  font-size: 0.95rem;
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
  display: inline-block;
}

.botao-primario {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.botao-primario:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
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

.botao-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
}

.vazio {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.vazio p {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}

.tabela-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
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

.tabela tbody tr.lead {
  background: #f0f4ff;
}

.tabela tbody tr.lead:hover {
  background: #e8ecff;
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

.filtro {
  margin-bottom: 1.5rem;
}

.input-filtro {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  background: white;
}

.input-filtro:focus {
  outline: none;
  border-color: #667eea;
}

.resumo {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  color: #333;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .titulo h1 {
    font-size: 1.5rem;
  }

  .tabela {
    font-size: 0.85rem;
  }

  .tabela th,
  .tabela td {
    padding: 0.75rem;
  }

  .acoes {
    flex-direction: column;
  }

  .resumo {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
