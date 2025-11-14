export interface LessonData {
  module: number;
  lesson: number;
  title: string;
  videoId: string;
  description: string;
  isBonus?: boolean; // Adicionado para identificar aulas bónus
}

export const lessonsData: LessonData[] = [
  // ═══════════════════════════════════════════════════════════
  // MÓDULO 1 - RESET EMOCIONAL
  // ═══════════════════════════════════════════════════════════
  { 
    module: 1, 
    lesson: 1, 
    title: "Suma que ELE VEM ATRÁS!", 
    videoId: "c1CQZVK5lhc", 
    description: "Descubra por que a ausência estratégica é a chave para fazê-lo voltar." 
  },
  { 
    module: 1, 
    lesson: 2, 
    title: "NÃO TENHA MEDO de sumir e ELE TE ESQUECER!", 
    videoId: "S7_4EebCUcM", 
    description: "Aprenda a aplicar o distanciamento sem medo de perdê-lo." 
  },
  { 
    module: 1, 
    lesson: 3, 
    title: "Os HOMENS SEMPRE VOLTAM Como assim!!", 
    videoId: "fsCvIC_FYRM", 
    description: "Entenda a psicologia por trás do retorno masculino." 
  },
  { 
    module: 1, 
    lesson: 4, 
    title: "HOMEM precisa de AUSÊNCIA e TEMPO para CORRER ATRÁS", 
    videoId: "wPFir0N4HoU", 
    description: "O timing perfeito para aplicar a ausência estratégica." 
  },
  { 
    module: 1, 
    lesson: 5, 
    title: "Por que quando a MULHER SOME O HOMEM VAI ATRÁS?", 
    videoId: "w3gApW6MI3M", 
    description: "Entenda a psicologia por trás do movimento de ausência.",
    isBonus: true
  },
  { 
    module: 1, 
    lesson: 6, 
    title: "Por que NÃO IR ATRÁS é a melhor escolha?", 
    videoId: "ODhg0ND4DYc", 
    description: "Descubra porque resistir é a estratégia vencedora.",
    isBonus: true
  },
  { 
    module: 1, 
    lesson: 7, 
    title: "Não entre em DESESPERO! Senão você PERDE!", 
    videoId: "jGjdF7U14EY", 
    description: "Como manter o controle emocional em momentos críticos.",
    isBonus: true
  },
  { 
    module: 1, 
    lesson: 8, 
    title: "MULHER NÃO CORRE ATRÁS DE HOMEM!! APRENDA!", 
    videoId: "G37FOnMkW2A", 
    description: "A regra de ouro da reconquista: por que você deve parar de correr atrás agora mesmo.",
    isBonus: true
  },

  // ═══════════════════════════════════════════════════════════
  // MÓDULO 2 - MAPA DA MENTE MASCULINA
  // ═══════════════════════════════════════════════════════════
  { 
    module: 2, 
    lesson: 1, 
    title: "OS 5 PRINCÍPIOS DA MENTE MASCULINA!", 
    videoId: "Kvmh9RUIfFc", 
    description: "Domine os 5 pilares da psicologia masculina." 
  },
  { 
    module: 2, 
    lesson: 2, 
    title: "COMO CONTROLAR A MENTE DE UM HOMEM?", 
    videoId: "pfXXwkNWTk", // ⚠️ REMOVIDO O HÍFEN INICIAL (era -pfXXwkNWTk)
    description: "Aprenda os mecanismos psicológicos que regem decisões masculinas." 
  },
  { 
    module: 2, 
    lesson: 3, 
    title: "O que o SILÊNCIO faz na CABEÇA de um HOMEM?", 
    videoId: "v_d7mmtVh0c", 
    description: "O poder do silêncio estratégico na reconquista." 
  },
  { 
    module: 2, 
    lesson: 4, 
    title: "CABEÇA DO HOMEM no PÓS TÉRMINO", 
    videoId: "knKjXRx0iag", 
    description: "Como ele pensa e sente após o término." 
  },
  { 
    module: 2, 
    lesson: 5, 
    title: "OS HOMENS SÃO PREVISÍVEIS!! ATENÇÃO MULHERES!!", 
    videoId: "eDMlDbXrBUA", 
    description: "Descubra os padrões comportamentais masculinos.",
    isBonus: true
  },
  { 
    module: 2, 
    lesson: 6, 
    title: "HOMEM GOSTA DE SER PISADO E DESPREZADO?", 
    videoId: "DbMmYHv1xkk", 
    description: "A verdade sobre valorização e desprezo.",
    isBonus: true
  },
  { 
    module: 2, 
    lesson: 7, 
    title: "LINHA MASCULINA do tempo no PÓS TÉRMINO?", 
    videoId: "nz3IEPR7euo", 
    description: "A cronologia emocional masculina após o fim.",
    isBonus: true
  },
  { 
    module: 2, 
    lesson: 8, 
    title: "Por que o HOMEM SOME?", 
    videoId: "qnw_Olu0rnM", 
    description: "Os 7 motivos principais pelos quais homens desaparecem e o que fazer em cada caso.",
    isBonus: true
  },

  // ═══════════════════════════════════════════════════════════
  // MÓDULO 3 - GATILHOS DA MEMÓRIA EMOCIONAL
  // ═══════════════════════════════════════════════════════════
  { 
    module: 3, 
    lesson: 1, 
    title: "Como deixar um HOMEM COM MEDO DE PERDER!", 
    videoId: "Itat8QDkhhQ", 
    description: "Ative o gatilho do medo da perda." 
  },
  { 
    module: 3, 
    lesson: 2, 
    title: "APRENDA A REJEITAR PRA ELE VIR ATRAS!", 
    videoId: "5LMJop82nBk", 
    description: "A arte de rejeitar estrategicamente." 
  },
  { 
    module: 3, 
    lesson: 3, 
    title: "Postura que faz HOMEM QUERER FEITO DOIDO", 
    videoId: "8KD93jjgbBg", 
    description: "A postura que desperta desejo irresistível." 
  },
  { 
    module: 3, 
    lesson: 4, 
    title: "EU QUERO QUE ELE VOLTE RASTEJANDO!", 
    videoId: "TAgC5VAg2_o", 
    description: "Como fazê-lo implorar pela sua atenção.",
    isBonus: true
  },

  // ═══════════════════════════════════════════════════════════
  // MÓDULO 4 - A FRASE DE 5 PALAVRAS
  // ═══════════════════════════════════════════════════════════
  { 
    module: 4, 
    lesson: 1, 
    title: "3 Frases Pra Mexer PROFUNDAMENTE com o Psicológico de um Homem!", 
    videoId: "hjVBIwEWO7o", 
    description: "As 3 frases secretas que ativam memória emocional." 
  },
  { 
    module: 4, 
    lesson: 2, 
    title: "A Mensagem que Reconquista ELE Sumiu Diga isso!", 
    videoId: "tu2NxuqrbK4", 
    description: "A mensagem exata para quando ele desaparece." 
  },
  { 
    module: 4, 
    lesson: 3, 
    title: "ELE SUMIU! Devo MANDAR um 'Oi'?", 
    videoId: "hRYhIoNhJqs", 
    description: "Como reagir quando ele some." 
  },
  { 
    module: 4, 
    lesson: 4, 
    title: "Ele enviou 'SAUDADES'!!! O QUE RESPONDER?", 
    videoId: "h5gUHiS-q7k", 
    description: "Scripts prontos para diferentes cenários de reaproximação." 
  },

  // ═══════════════════════════════════════════════════════════
  // MÓDULO 5 - PRIMEIRO CONTATO ESTRATÉGICO
  // ═══════════════════════════════════════════════════════════
  { 
    module: 5, 
    lesson: 1, 
    title: "O EX APARECEU FAÇA CERTO DESSA VEZ!", 
    videoId: "6YSO7AYrZI", // ⚠️ REMOVIDO O HÍFEN INICIAL (era -6YSO7AYrZI)
    description: "O que dizer e fazer quando ele te procura." 
  },
  { 
    module: 5, 
    lesson: 2, 
    title: "Como se comportar ao se ENCONTRAR com EX?", 
    videoId: "sklhMr24Fg4", 
    description: "Guia completo de postura e linguagem corporal." 
  },
  { 
    module: 5, 
    lesson: 3, 
    title: "Ele enviou 'SAUDADES'!!! O QUE RESPONDER?", 
    videoId: "h5gUHiS-q7k", 
    description: "A resposta perfeita para reconquistar." 
  },

  // ═══════════════════════════════════════════════════════════
  // MÓDULO 6 - DOMÍNIO DA CONVERSA
  // ═══════════════════════════════════════════════════════════
  { 
    module: 6, 
    lesson: 1, 
    title: "WHATSAPP SEJA DIRETA AO FALAR COM HOMEM!", 
    videoId: "jkBEYleb4ZM", 
    description: "Domine a comunicação por mensagem." 
  },
  { 
    module: 6, 
    lesson: 2, 
    title: "WhatsApp; Mensagem MEDÍOCRE NÃO se RESPONDE!!", 
    videoId: "MYPGCmLJFKw", 
    description: "Como identificar e lidar com mensagens rasas." 
  },
  { 
    module: 6, 
    lesson: 3, 
    title: "VOCÊ sabe se COMUNICAR com um HOMEM?", 
    videoId: "eSgYJD9OVSU", 
    description: "A arte da comunicação eficaz." 
  },
  { 
    module: 6, 
    lesson: 4, 
    title: "O que falar no WHATS após um Gelo? Parte 1", 
    videoId: "QDFILn1Z-n0", 
    description: "Estratégias para quebrar o gelo - Parte 1.",
    isBonus: true
  },
  { 
    module: 6, 
    lesson: 5, 
    title: "O que falar no SAPP após Gelo? Parte 2", 
    videoId: "UL6eqQ3yGFA", 
    description: "Estratégias para quebrar o gelo - Parte 2.",
    isBonus: true
  },
  { 
    module: 6, 
    lesson: 6, 
    title: "NÃO ACEITE qualquer coisa de um HOMEM!!", 
    videoId: "s4SzR3LStMc", 
    description: "Estabeleça padrões elevados e mantenha-os.",
    isBonus: true
  },

  // ═══════════════════════════════════════════════════════════
  // MÓDULO 7 - CONQUISTA DURADOURA
  // ═══════════════════════════════════════════════════════════
  { 
    module: 7, 
    lesson: 1, 
    title: "POR QUE NENHUM RELACIONAMENTO MEU VAI PRA FRENTE", 
    videoId: "kSf3mrsW5XA", 
    description: "Identifique padrões sabotadores." 
  },
  { 
    module: 7, 
    lesson: 2, 
    title: "Como VIRAR O JOGO no seu RELACIONAMENTO?", 
    videoId: "4p3u7AaOsDg", 
    description: "Estratégias para transformar sua relação." 
  },
  { 
    module: 7, 
    lesson: 3, 
    title: "Como prender um homem? TÉCNICA INFALÍVEL!", 
    videoId: "NXDmCor9bUY", 
    description: "A técnica definitiva para mantê-lo apaixonado." 
  },
  { 
    module: 7, 
    lesson: 4, 
    title: "COMO MANTER O HOMEM INTERESSADO?", 
    videoId: "zbwv5QuANd8", 
    description: "Mantenha a chama acesa para sempre." 
  },
  { 
    module: 7, 
    lesson: 5, 
    title: "NÃO ACEITE qualquer coisa de um HOMEM!!", 
    videoId: "s4SzR3LStMc", 
    description: "Estabeleça padrões elevados e mantenha-os.",
    isBonus: true
  },
  { 
    module: 7, 
    lesson: 6, 
    title: "NÃO DÊ O SEU PODER A UM HOMEM!", 
    videoId: "koNd0YLIYkQ", 
    description: "Mantenha o seu poder pessoal sempre.",
    isBonus: true
  },
];

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS COM VALIDAÇÃO
// ═══════════════════════════════════════════════════════════

export const getLessonData = (moduleNumber: number, lessonNumber: number): LessonData | undefined => {
  const lesson = lessonsData.find(l => l.module === moduleNumber && l.lesson === lessonNumber);
  
  if (!lesson) {
    console.error(`❌ Aula não encontrada: Módulo ${moduleNumber}, Aula ${lessonNumber}`);
  }
  
  return lesson;
};

export const getModuleLessons = (moduleNumber: number): LessonData[] => {
  const lessons = lessonsData.filter(l => l.module === moduleNumber);
  
  if (lessons.length === 0) {
    console.warn(`⚠️ Nenhuma aula encontrada para o módulo ${moduleNumber}`);
  }
  
  return lessons;
};

// ═══════════════════════════════════════════════════════════
// NOVAS FUNÇÕES ÚTEIS
// ═══════════════════════════════════════════════════════════

export const getNextLesson = (moduleNumber: number, lessonNumber: number): LessonData | null => {
  const currentIndex = lessonsData.findIndex(
    l => l.module === moduleNumber && l.lesson === lessonNumber
  );
  
  if (currentIndex === -1 || currentIndex === lessonsData.length - 1) {
    return null;
  }
  
  return lessonsData[currentIndex + 1];
};

export const getPreviousLesson = (moduleNumber: number, lessonNumber: number): LessonData | null => {
  const currentIndex = lessonsData.findIndex(
    l => l.module === moduleNumber && l.lesson === lessonNumber
  );
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return lessonsData[currentIndex - 1];
};

export const getTotalLessons = (moduleNumber?: number): number => {
  if (moduleNumber) {
    return lessonsData.filter(l => l.module === moduleNumber).length;
  }
  return lessonsData.length;
};

export const getModuleProgress = (moduleNumber: number, completedLessons: number[]): number => {
  const moduleLessons = getModuleLessons(moduleNumber);
  const completed = moduleLessons.filter(l => 
    completedLessons.includes(l.lesson)
  ).length;
  
  return Math.round((completed / moduleLessons.length) * 100);
};
