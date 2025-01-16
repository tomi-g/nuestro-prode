import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  questions: Question[] = [];
  answers: { [key: number]: 'Tomi' | 'Cami' } = {};
  newQuestionText: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.gameService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }

  onAnswerSelected(questionId: number, answer: 'Tomi' | 'Cami') {
    this.answers[questionId] = answer;
  }

  submitCorrectAnswers() {
    // Convertir el objeto de respuestas a un array con el formato esperado por el backend
    const formattedAnswers = Object.entries(this.answers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answer
    }));

    this.gameService.submitCorrectAnswers({ answers: formattedAnswers }).subscribe(
      () => {
        console.log('Respuestas correctas enviadas exitosamente');
        // Opcional: limpiar las respuestas después de enviar
        this.answers = {};
        this.router.navigate(['/results']);
      },
      error => {
        console.error('Error al enviar las respuestas correctas:', error);
      }
    );
  }

  onSubmit() {
    if (Object.keys(this.answers).length !== this.questions.length) {
      alert('Por favor, responde todas las preguntas');
      return;
    }

    this.submitCorrectAnswers();
  }

  addNewQuestion() {
    if (!this.newQuestionText.trim()) {
      this.errorMessage = 'Por favor, ingresa el texto de la pregunta';
      return;
    }

    this.gameService.createQuestion(this.newQuestionText).subscribe(
      (newQuestion) => {
        this.questions.push(newQuestion);
        this.newQuestionText = '';
        this.successMessage = '¡Pregunta agregada exitosamente!';
        this.errorMessage = '';
        setTimeout(() => this.successMessage = '', 3000);
        this.loadQuestions(); // Recargar todas las preguntas
      },
      (error) => {
        this.errorMessage = 'Error al crear la pregunta: ' + error.message;
        this.successMessage = '';
      }
    );
  }
}
