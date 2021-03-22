import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'app/core/services/auth.service';
import { Logout } from 'app/core/state/auth-state/auth.actions';

import { IQuestion, IQuestionStructure } from './../../../../../../lib/interfaces/question.interface';

import { Store } from '@ngxs/store';

import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  public questions: IQuestionStructure;
  public currentQuestions: IQuestion[] = [];

  public currentQuestions$ = new BehaviorSubject<IQuestion[]>([]);

  constructor(private store: Store, private router: Router, private authService: AuthService) {}

  public ngOnInit() {
    this.authService
      .getQuestions()
      .pipe(untilDestroyed(this), take(1))
      .subscribe(value => {
        this.questions = value;

        this.currentQuestions$.next([this.questions['main']]);
      });

    this.currentQuestions$.pipe(untilDestroyed(this)).subscribe(value => (this.currentQuestions = value));
  }

  public ngOnDestroy() {}

  public onLogout() {
    this.store.dispatch(new Logout()).subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  public onChange({ value }, questionId: number) {
    const currentQuestionIndex = this.currentQuestions.findIndex(item => item.id === questionId);
    const questions = [...this.currentQuestions];

    questions[currentQuestionIndex].answer = value;

    for (let i = currentQuestionIndex + 1; i < questions.length; i++) {
      if (questions[i]) {
        questions[i].answer = null;
      }
    }

    const slicedQuestions = questions.slice(0, currentQuestionIndex + 1);

    this.currentQuestions$.next([...slicedQuestions, this.questions[value]]);
  }

  public getSelectedValue(questionId: number, value: string): boolean {
    return this.currentQuestions?.find(item => item.id === questionId)?.answer === value;
  }

  public resetQuestions() {
    this.onChange({ value: null }, 1);
  }
}
