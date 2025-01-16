import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Question } from '../../models/question.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {
  questions: Question[] = [];
  playerName: string = '';
  submitted: boolean = false;

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gameService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }

  isSubmitDisabled(): boolean {
    return this.submitted || 
           !this.playerName || 
           this.questions.some(q => !q.userAnswer);
  }

  onAnswerSelected(questionId: number, answer: 'Tomi' | 'Cami') {
    this.gameService.updateLocalAnswer(questionId, answer);
  }

  onSubmit() {
    if (!this.playerName.trim()) {
      alert('Por favor, ingresa tu nombre antes de enviar las respuestas');
      return;
    }

    this.gameService.setPlayerName(this.playerName);
    this.gameService.submitAllAnswers().subscribe(() => {
      this.submitted = true;
      this.router.navigate(['/waiting']);
    });
  }
}
