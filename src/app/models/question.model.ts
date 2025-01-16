export interface Question {
    id: number;
    text: string;
    userAnswer?: 'Tomi' | 'Cami' | null;
    correctAnswer?: 'Tomi' | 'Cami' | null;
}

export interface GameResults {
    totalQuestions: number;
    playerName: string;
    score: number;
}
