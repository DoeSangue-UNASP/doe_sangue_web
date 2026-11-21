<template>
  <div class="container-cadastro-lead">
    <div class="card">
      <div class="card-header">
        <h1>Cadastrar Doador Lead</h1>
        <p class="descricao">
          Registre doadores que entraram em contato externamente ou que ainda não se cadastraram na plataforma.
        </p>
      </div>

      <form @submit.prevent="submeterFormulario" class="formulario">
        <div class="form-group">
          <label for="nome">Nome Completo</label>
          <input
            id="nome"
            v-model="formulario.nome"
            type="text"
            placeholder="João Silva"
            required
          />
        </div>

        <div class="form-group">
          <label for="documento">CPF</label>
          <input
            id="documento"
            v-model="formulario.documento"
            type="text"
            placeholder="000.000.000-00"
            @input="formatarCpf"
            required
          />
        </div>

        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input
            id="telefone"
            v-model="formulario.telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            @input="formatarTelefone"
            required
          />
        </div>

        <div class="form-group">
          <label for="dataNascimento">Data de Nascimento</label>
          <input
            id="dataNascimento"
            v-model="formulario.dataNascimento"
            type="date"
            required
          />
        </div>

        <CustomSelect id="sexo" label="Sexo (opcional)" v-model="formulario.sexo" :options="SEXO_OPTIONS" />

        <CustomSelect id="tipoSanguineo" label="Tipo sanguíneo (opcional)" v-model="formulario.tipoSanguineo"
          :options="TIPO_SANGUINEO_OPTIONS" />

        <div v-if="erroFormulario" class="alerta alerta-erro">
          {{ erroFormulario }}
        </div>

        <div v-if="sucessoCadastro" class="alerta alerta-sucesso">
          Lead cadastrado com sucesso!
        </div>

        <button
          type="submit"
          class="botao botao-primario"
          :disabled="carregando"
        >
          {{ carregando ? 'Cadastrando...' : 'Cadastrar Lead' }}
        </button>
      </form>

      <div class="secao-info">
        <h2>Informações sobre Leads</h2>
        <ul>
          <li>Um lead é um doador cadastrado pelo hemocentro que ainda não é usuário da plataforma</li>
          <li>O lead pode se cadastrar como usuário da plataforma posteriormente</li>
          <li>Quando um lead se cadastra como usuário, seus dados são automaticamente atualizados</li>
          <li>Você pode ter múltiplos leads com o mesmo CPF (cada um é específico do seu hemocentro)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { obterToken } from '@/services/auth';
import { cadastrarLead, SEXO_OPTIONS, TIPO_SANGUINEO_OPTIONS, type CadastrarLeadRequest } from '@/services/doador';
import { ApiError } from '@/services/api';
import { useToast } from '@/composables/useToast';
import CustomSelect from '@/components/CustomSelect.vue';

const router = useRouter();
const { sucesso, erro } = useToast();
const token = obterToken();

if (!token) {
  router.push('/login');
}

const formulario = ref({
  nome: '',
  documento: '',
  telefone: '',
  dataNascimento: '',
  sexo: '',
  tipoSanguineo: '',
});

const carregando = ref(false);
const erroFormulario = ref('');
const sucessoCadastro = ref(false);

function formatarCpf(event: Event): void {
  const input = event.target as HTMLInputElement;
  let valor = input.value.replace(/\D/g, '');

  if (valor.length > 11) {
    valor = valor.slice(0, 11);
  }

  if (valor.length > 7) {
    valor = valor.slice(0, 3) + '.' + valor.slice(3, 6) + '.' + valor.slice(6, 9) + '-' + valor.slice(9, 11);
  } else if (valor.length > 6) {
    valor = valor.slice(0, 3) + '.' + valor.slice(3, 6) + '.' + valor.slice(6);
  } else if (valor.length > 3) {
    valor = valor.slice(0, 3) + '.' + valor.slice(3);
  }

  formulario.value.documento = valor;
}

function formatarTelefone(event: Event): void {
  const input = event.target as HTMLInputElement;
  let valor = input.value.replace(/\D/g, '');

  if (valor.length > 11) {
    valor = valor.slice(0, 11);
  }

  if (valor.length > 7) {
    valor = '(' + valor.slice(0, 2) + ') ' + valor.slice(2, 7) + '-' + valor.slice(7);
  } else if (valor.length > 2) {
    valor = '(' + valor.slice(0, 2) + ') ' + valor.slice(2);
  }

  formulario.value.telefone = valor;
}

async function submeterFormulario(): Promise<void> {
  erroFormulario.value = '';
  sucessoCadastro.value = false;

  if (!formulario.value.nome || !formulario.value.documento || !formulario.value.telefone || !formulario.value.dataNascimento) {
    const mensagem = 'Todos os campos são obrigatórios.';
    erroFormulario.value = mensagem;
    erro(mensagem);
    return;
  }

  carregando.value = true;

  try {
    const leadData: CadastrarLeadRequest = {
      nome: formulario.value.nome,
      documento: formulario.value.documento.replace(/\D/g, ''),
      telefone: formulario.value.telefone.replace(/\D/g, ''),
      dataNascimento: formulario.value.dataNascimento,
      sexo: formulario.value.sexo,
      tipoSanguineo: formulario.value.tipoSanguineo,
    };

    if (!token) {
      throw new Error('Token não disponível');
    }

    await cadastrarLead(leadData, token);

    sucessoCadastro.value = true;
    sucesso('Lead cadastrado com sucesso!');
    
    formulario.value = {
      nome: '',
      documento: '',
      telefone: '',
      dataNascimento: '',
      sexo: '',
      tipoSanguineo: '',
    };

    setTimeout(() => {
      sucessoCadastro.value = false;
    }, 3000);
  } catch (err: unknown) {
    let mensagem = 'Erro ao cadastrar lead. Tente novamente.';
    
    if (err instanceof ApiError) {
      if (err.status === 401) {
        mensagem = 'Sua sessão expirou. Faça login novamente.';
        router.push('/login');
      } else if (err.status === 403) {
        mensagem = 'Apenas hemocentros podem cadastrar leads.';
      } else if (err.status === 422) {
        mensagem = err.message || 'Dados inválidos. Verifique e tente novamente.';
      } else {
        mensagem = err.message || mensagem;
      }
    } else if (err instanceof Error) {
      mensagem = err.message;
    }
    
    erroFormulario.value = mensagem;
    erro(mensagem);
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
.container-cadastro-lead {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  padding: 2.5rem;
}

.card-header {
  margin-bottom: 2rem;
  text-align: center;
}

.card-header h1 {
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.descricao {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

.formulario {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input::placeholder {
  color: #999;
}

.alerta {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.alerta-erro {
  background-color: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.alerta-sucesso {
  background-color: #efe;
  color: #3c3;
  border: 1px solid #cfc;
}

.botao {
  width: 100%;
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
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

.secao-info {
  border-top: 2px solid #e0e0e0;
  padding-top: 1.5rem;
}

.secao-info h2 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.secao-info ul {
  list-style: none;
  padding: 0;
}

.secao-info li {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.secao-info li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

@media (max-width: 600px) {
  .card {
    padding: 1.5rem;
  }

  .card-header h1 {
    font-size: 1.5rem;
  }
}
</style>
