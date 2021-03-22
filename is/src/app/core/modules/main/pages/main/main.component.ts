import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { Logout } from 'app/core/state/auth-state/auth.actions';
import { Router } from '@angular/router';
import { IQuestion, IQuestionStructure } from './../../../../../../lib/interfaces/question.interface';
import { AuthService } from 'app/core/services/auth.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  public questions: IQuestionStructure;
  public currentQuestions$ = new BehaviorSubject<IQuestion[]>([]);
  public answers: { questionId: number; answer: string }[] = [];

  constructor(private store: Store, private router: Router, private authService: AuthService) {}

  public ngOnInit() {
    this.authService
      .getQuestions()
      .pipe(untilDestroyed(this), take(1))
      .subscribe(value => {
        this.questions = value;

        this.currentQuestions$.next([this.questions['main']]);
      });
  }

  public ngOnDestroy() {}

  public onLogout() {
    this.store.dispatch(new Logout()).subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  public lol({ value }, questionId: number) {
    const currentQuestionIndex = this.currentQuestions$.value.findIndex(item => item.id === questionId);

    let questions = [...this.currentQuestions$.value];
    let nextQuestions = [];
    questions[currentQuestionIndex].answer = value;
    questions = questions.slice(0, currentQuestionIndex + 1);

    questions.forEach(item => {
      if (item.answer) {
        nextQuestions.push(this.questions[item.answer]);
      }
    });

    console.log('nextQuestions', nextQuestions);

    questions.push(this.questions[value]);

    this.currentQuestions$.next(questions);
  }

  public getSelectedValue(questionId: number, value: string): boolean {
    return this.currentQuestions$.value?.find(item => item.id === questionId)?.answer === value;
  }
}
