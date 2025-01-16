import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { GameResults } from '../../models/question.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: GameResults[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.getResults().subscribe(results => {
      if (results.length > 1) {
        this.results = results.sort((a, b) => b.score - a.score);
      }
      else {
        this.results = results;
      }
    });
  }

  getPercentage(result: GameResults): number {
    return (result.score / result.totalQuestions) * 100;
  }
}
