export type QuizOption = {
  id: number;
  answer: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  id: number;
  question: string;
  helperText: string;
  options: QuizOption[];
};

export type QuizResponse = {
  questionId: number;
  selectedOptionId: number;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
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
  {
    id: 4,
    question: "Você teve hepatite?",
    helperText: "Histórico de doenças infecciosas é importante para a segurança",
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
  {
    id: 5,
    question: "Você tomou alguma vacina nos últimos 7 dias?",
    helperText: "Algumas vacinas requerem período de espera antes de doar",
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
];

/**
 * Avalia as respostas do quiz
 * @param responses - Respostas do usuário ao quiz
 * @returns true se o usuário está apto, false caso contrário
 */
export function avaliarQuiz(responses: Map<number, number>): boolean {
  return QUIZ_QUESTIONS.every((question) => {
    const selectedOptionId = responses.get(question.id);
    if (selectedOptionId === undefined) {
      return false;
    }

    const selectedOption = question.options.find((option) => option.id === selectedOptionId);
    return selectedOption?.isCorrect === true;
  });
}

/**
 * Calcula a porcentagem de acertos
 * @param responses - Respostas do usuário ao quiz
 * @returns Porcentagem de acertos
 */
export function calcularTaxaAcerto(responses: Map<number, number>): number {
  let acertos = 0;
  QUIZ_QUESTIONS.forEach((question) => {
    const selectedOptionId = responses.get(question.id);
    if (selectedOptionId !== undefined) {
      const selectedOption = question.options.find((option) => option.id === selectedOptionId);
      if (selectedOption?.isCorrect) {
        acertos++;
      }
    }
  });
  return (acertos / QUIZ_QUESTIONS.length) * 100;
}

/**
 * Retorna uma pergunta específica do quiz
 * @param questionId - ID da pergunta
 * @returns A pergunta ou undefined se não encontrada
 */
export function obterPergunta(questionId: number): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find((q) => q.id === questionId);
}

/**
 * Retorna todas as perguntas do quiz
 * @returns Array de perguntas
 */
export function obterTodasPerguntas(): QuizQuestion[] {
  return QUIZ_QUESTIONS;
}

/**
 * Retorna o total de perguntas no quiz
 * @returns Total de perguntas
 */
export function obterTotalPerguntas(): number {
  return QUIZ_QUESTIONS.length;
}
