import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Question, GameResults } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private questions: Question[] = [
    { id: 1, text: '¿Quién dijo primero "Te Amo"?' },
    { id: 2, text: '¿Quién dio el primer beso?' },
    { id: 3, text: '¿Quién es más organizado/a?' },
    { id: 4, text: '¿Quién cocina mejor?' },
    { id: 5, text: '¿Quién es más dormilón/a?' },
    // Agrega más preguntas aquí
  ];

  private playerResults: GameResults[] = [];
  private currentPlayerName: string = '';
  private questionsSubject = new BehaviorSubject<Question[]>(this.questions);
  private resultsSubject = new BehaviorSubject<GameResults[]>(this.playerResults);

  getQuestions(): Observable<Question[]> {
    return this.questionsSubject.asObservable();
  }

  getResults(): Observable<GameResults[]> {
    return this.resultsSubject.asObservable();
  }

  setPlayerName(name: string) {
    this.currentPlayerName = name;
  }

  submitUserAnswer(questionId: number, answer: 'Tomi' | 'Cami') {
    const questionIndex = this.questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      this.questions[questionIndex].userAnswer = answer;
      this.questionsSubject.next(this.questions);
    }
  }

  submitCorrectAnswers(answers: { [key: number]: 'Tomi' | 'Cami' }) {
    this.questions = this.questions.map(q => ({
      ...q,
      correctAnswer: answers[q.id]
    }));
    this.questionsSubject.next(this.questions);
  }

  calculateResults() {
    const correctAnswers = this.questions.filter(
      q => q.userAnswer && q.correctAnswer && q.userAnswer === q.correctAnswer
    ).length;

    const result: GameResults = {
      playerName: this.currentPlayerName,
      totalQuestions: this.questions.length,
      correctAnswers
    };

    this.playerResults.push(result);
    this.resultsSubject.next(this.playerResults);
    return result;
  }

  resetGame() {
    this.questions = this.questions.map(q => ({
      ...q,
      userAnswer: null,
      correctAnswer: null
    }));
    this.questionsSubject.next(this.questions);
  }
}
