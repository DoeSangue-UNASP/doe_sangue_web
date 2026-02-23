<script setup lang="ts">
import { computed, ref } from 'vue';
import { PhCheckCircle, PhXCircle } from '@phosphor-icons/vue';
import CustomButton from '../../components/CustomButton.vue';
import NavbarLanding from '../../components/NavbarLanding.vue';
import { router } from '../../router';
import { RouteNames } from '../../router/route-names';

type QuizOption = {
  id: number;
  answer: string;
  isCorrect: boolean;
};

type QuizQuestion = {
  id: number;
  question: string;
  helperText: string;
  options: QuizOption[];
};

const quiz = [
  {
    id: 1,
    question: "Qual a sua idade?",
    helperText: "Este é um dos requisitos básicos para doação",
    options: [
      {
        id: 1,
        answer: "Menor que 16",
        isCorrect: false
      },
      {
        id: 2,
        answer: "Entre 16 e 69 anos",
        isCorrect: true
      },
      {
        id: 3,
        answer: "Mais que 69 anos",
        isCorrect: false
      },
    ],
  },
  {
    id: 2,
    question: "Qual é o seu peso?",
    helperText: "O peso mínimo é necessário para a segurança da doação",
    options: [
      {
        id: 1,
        answer: "Menos que 50kg",
        isCorrect: false
      },
      {
        id: 2,
        answer: "50kg ou mais",
        isCorrect: true
      },
    ],
  },
  {
    id: 3,
    question: "Teve gripe nos últimos 7 dias?",
    helperText: "Esse critério ajuda a proteger você e quem vai receber o sangue",
    options: [
      {
        id: 1,
        answer: "Sim",
        isCorrect: false
      },
      {
        id: 2,
        answer: "Não",
        isCorrect: true
      },
    ],
  },
] satisfies QuizQuestion[];

const currentStep = ref(0);
const selectedAnswers = ref<Record<number, number | undefined>>({});
const finished = ref(false);
const hasStarted = ref(false);

const totalSteps = quiz.length;
const firstQuestion = quiz[0]!;

const currentQuestion = computed(() => quiz[currentStep.value] ?? firstQuestion);
const progress = computed(() => ((currentStep.value + 1) / totalSteps) * 100);
const currentQuestionSelection = computed(() => selectedAnswers.value[currentQuestion.value.id]);
const canContinue = computed(() => currentQuestionSelection.value !== undefined);
const canGoBack = computed(() => currentStep.value > 0);

const isApto = computed(() => {
  return quiz.every((question) => {
    const selectedOptionId = selectedAnswers.value[question.id];
    if (selectedOptionId === undefined) {
      return false;
    }

    const selectedOption = question.options.find((option) => option.id === selectedOptionId);
    return selectedOption?.isCorrect === true;
  });
});

const selectOption = (optionId: number) => {
  selectedAnswers.value[currentQuestion.value.id] = optionId;
};

const nextStep = () => {
  if (!canContinue.value) {
    return;
  }

  if (currentStep.value === totalSteps - 1) {
    finished.value = true;
    return;
  }

  currentStep.value += 1;
};

const previousStep = () => {
  if (!canGoBack.value) {
    return;
  }

  currentStep.value -= 1;
};

const restartQuiz = () => {
  currentStep.value = 0;
  selectedAnswers.value = {};
  finished.value = false;
};

const startQuiz = () => {
  currentStep.value = 0;
  selectedAnswers.value = {};
  finished.value = false;
  hasStarted.value = true;
};
</script>

<template>
  <div class="background">
    <NavbarLanding />

    <main class="quiz-wrapper poppins-regular">
      <section v-if="!hasStarted && !finished" class="quiz-card intro-card">
        <h1 class="intro-title poppins-bold">Quiz de Aptidão para Doação</h1>
        <p class="intro-text poppins">
          Quer saber se você pode ser um doador de sangue?<br>
          Responda a algumas perguntas rápidas e descubra se você atende aos requisitos básicos para salvar vidas. <br>
          É rápido, fácil e o primeiro passo para fazer a diferença!
          <br><br>
          Este quiz não substitui a triagem médica completa, mas ajuda a verificar os critérios iniciais de doação.
        </p>
        <CustomButton class="intro-button" label="Iniciar Quiz" @click="startQuiz" />
      </section>

      <section v-else-if="!finished" class="quiz-card">
        <header class="quiz-header">
          <h1 class="quiz-title poppins-bold">Quiz Rápido</h1>
          <span class="quiz-step poppins-semibold">Pergunta {{ currentStep + 1 }} de {{ totalSteps }}</span>
        </header>

        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progress}%` }" />
        </div>

        <div class="question-content">
          <h2 class="question-title poppins-bold">{{ currentQuestion.question }}</h2>
          <p class="question-helper">{{ currentQuestion.helperText }}</p>

          <div class="options-list">
            <CustomButton secondary v-for="option in currentQuestion.options" :key="option.id"
              :keepSelected="currentQuestionSelection === option.id" :label="option.answer"
              @click="selectOption(option.id)" />
          </div>

          <div class="actions">
            <CustomButton v-if="canGoBack" class="back-button" label="Anterior" secondary @click="previousStep" />
            <CustomButton class="next-button" :class="{ disabled: !canContinue }"
              :label="currentStep === totalSteps - 1 ? 'Finalizar' : 'Próximo'" @click="nextStep" />
          </div>
        </div>
      </section>

      <section v-else class="quiz-card result-card">
        <span>
          <PhCheckCircle v-if="isApto" size="80" color="var(--success-color)" />
          <PhXCircle v-else size="80" color="var(--primary-color)" />
        </span>
        <h2 class="result-title poppins-bold">
          {{ isApto ? 'Parabéns!' : 'Que pena...' }}
        </h2>
        <p class="result-text">
          {{ isApto
            ? `Você está apto(a) para doar sangue e fazer a diferença na vida de alguém. `
            : `Desta vez você não está apto(a) para doar sangue`
          }}
        </p>
        <CustomButton v-if="isApto === false" class="result-button" label="Refazer quiz" secondary
          @click="restartQuiz" />

        <div class="search-hemocentro" v-if="isApto">
          <p class="search-hemocentro-text">Clique abaixo e encontre o hemocentro mais próximo para agendar sua doação:
          </p>
          <CustomButton class="result-button" label="Buscar ponto de coleta"
            @click="router.push(RouteNames.PONTOS_COLETA)" />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.background {
  background-color: var(--background-color);
  min-height: 100vh;
}

.quiz-wrapper {
  padding: 170px 20px 60px;
  display: flex;
  justify-content: center;
}

.quiz-card {
  width: 100%;
  max-width: 760px;
  background-color: var(--form-color);
  border: 1px solid var(--input-border-color);
  border-radius: 12px;
  padding: 40px 48px;
}

.intro-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 30px;
}

.intro-title {
  width: 100%;
  color: var(--font-color);
  font-size: x-large;
}

.intro-text {
  width: 100%;
  color: var(--font-light-color);
}

.intro-button {
  width: 100%;
  max-width: 180px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quiz-title {
  color: var(--primary-color);
  font-size: x-large;
}

.quiz-step {
  color: var(--font-color);
}

.progress-track {
  margin-top: 10px;
  width: 100%;
  height: 5px;
  background-color: #d9d9d9;
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 12px;
  transition: width 0.3s ease;
}

.question-content {
  margin-top: 54px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-title {
  color: var(--font-color);
  font-size: larger;
  text-align: center;
}

.question-helper {
  margin-top: 10px;
  color: var(--font-light-color);
  font-size: medium;
  text-align: center;
}

.options-list {
  margin-top: 34px;
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.actions {
  margin-top: 34px;
  width: 100%;
  max-width: 560px;
  display: flex;
  justify-content: flex-start;
}

.back-button {
  max-width: 160px;
}

.next-button {
  max-width: 160px;
  margin-left: auto;
}

.next-button.disabled {
  opacity: 0.45;
  pointer-events: none;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.result-title {
  font-size: 38px;
  color: var(--font-color);
}

.result-text {
  color: var(--font-light-color);
  max-width: 620px;
}

.result-button {
  max-width: 180px;
}

.search-hemocentro {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
}

.search-hemocentro-text {
  color: var(--font-light-color);
}

@media (max-width: 1024px) {
  .quiz-card {
    padding: 32px 28px;
  }

  .intro-card {
    min-height: auto;
    gap: 22px;
    text-align: center;
  }

  .intro-title {
    max-width: 100%;
  }

  .intro-text {
    max-width: 100%;
  }

  .progress-track {
    height: 16px;
  }

  .option-item {
    min-height: 54px;
  }
}
</style>