import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Question } from '../../models/question.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  questions: Question[] = [];
  answers: { [key: number]: 'Tomi' | 'Cami' } = {};

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gameService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }

  onAnswerSelected(questionId: number, answer: 'Tomi' | 'Cami') {
    this.answers[questionId] = answer;
  }

  onSubmit() {
    if (Object.keys(this.answers).length !== this.questions.length) {
      alert('Por favor, responde todas las preguntas');
      return;
    }

    this.gameService.submitCorrectAnswers(this.answers);
    this.router.navigate(['/results']);
  }
}
