import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Question, GameResults } from '../models/question.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = environment.apiUrl;
  private questions: Question[] = [];
  private playerResults: GameResults[] = [];
  private currentPlayerName: string = '';
  private questionsSubject = new BehaviorSubject<Question[]>(this.questions);
  private resultsSubject = new BehaviorSubject<GameResults[]>(this.playerResults);

  constructor(private http: HttpClient) {
    this.loadQuestions();
  }

  private loadQuestions() {
    this.http.get<Question[]>(`${this.apiUrl}/questions`)
      .subscribe(questions => {
        this.questions = questions;
        this.questionsSubject.next(this.questions);
      });
  }

  getQuestions(): Observable<Question[]> {
    return this.questionsSubject.asObservable();
  }

  getResults(): Observable<GameResults[]> {
    this.http.get<GameResults[]>(`${this.apiUrl}/answers/results`)
      .subscribe(results => {
        this.playerResults = results;
        this.resultsSubject.next(this.playerResults);
        console.log('Player results:', this.playerResults);
        
      });
    return this.resultsSubject.asObservable();
  }

  setPlayerName(name: string) {
    this.currentPlayerName = name;
  }

  updateLocalAnswer(questionId: number, answer: 'Tomi' | 'Cami') {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      question.userAnswer = answer;
      this.questionsSubject.next([...this.questions]);
    }
  }

  submitAllAnswers() {
    const answers = this.questions
      .filter(q => q.userAnswer)
      .map(q => ({
        questionId: q.id,
        answer: q.userAnswer
      }));

    return this.http.post(`${this.apiUrl}/answers`, {
      playerName: this.currentPlayerName,
      answers
    });
  }

  submitCorrectAnswers(data: { answers: Array<{ questionId: number, answer: 'Tomi' | 'Cami' }> }) {
    return this.http.post(`${this.apiUrl}/questions/correct-answers`, data)
      .pipe(
        tap(response => {
          // Actualizar el estado local después de una respuesta exitosa
          this.questions = this.questions.map(q => {
            const correctAnswer = data.answers.find(a => a.questionId === q.id);
            return correctAnswer ? { ...q, correctAnswer: correctAnswer.answer } : q;
          });
          this.questionsSubject.next(this.questions);
        })
      );
  }

  calculateResults() {
    return this.http.get<GameResults[]>(`${this.apiUrl}/answers/results`)
      .subscribe(results => {
        this.playerResults = results;
        this.resultsSubject.next(this.playerResults);
      });
  }

  resetGame() {
    this.questions = this.questions.map(q => ({
      ...q,
      userAnswer: null,
      correctAnswer: null
    }));
    this.questionsSubject.next(this.questions);
  }

  private getNextQuestionId(): number {
    if (!this.questions || this.questions.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.questions.map(q => q.id));
    return maxId + 1;
  }

  createQuestion(questionText: string): Observable<Question> {
    const newQuestion = {
      id: this.getNextQuestionId(),
      text: questionText
    };
    return this.http.post<Question>(`${this.apiUrl}/questions`, newQuestion);
  }
}
