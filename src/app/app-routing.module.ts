import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnswersComponent } from './components/answers/answers.component';
import { ResultsComponent } from './components/results/results.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path: '', component: AnswersComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'waiting', redirectTo: 'results' }, // Redirigimos waiting a results por ahora
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
