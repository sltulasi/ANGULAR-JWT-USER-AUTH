import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Errors } from '../../../models/errors.model';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { ListErrorsComponent } from '../../shared/list-errors/list-errors.component';

interface AuthForm {
  email: FormControl<string>;
  password: FormControl<string>;
  username?: FormControl<string>;
}
@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.css'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    NgFor,
    ListErrorsComponent,
    JsonPipe,
  ],
  standalone: true,
})
export class AuthUserComponent implements OnInit {
  constructor(
    private activateRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}
  authType = '';
  title = '';
  isSubmitting = false;
  destroy$ = new Subject<void>();
  errors: Errors = { errors: {} };

  authUserForm = new FormGroup<AuthForm>({
    email: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    //import activateRoute from @angular/router
    //snapshot will give the current URL
    //at(-1) will give the last element
    //This is to access the last part of the current URL
    this.authType = this.activateRoute.snapshot.url.at(-1)!.path;

    //adding the title to the form based on authType
    this.title = this.authType == 'login' ? 'Login' : 'Sign Up';
    if (this.authType === 'register') {
      this.authUserForm.addControl(
        'username',
        new FormControl('', {
          validators: [Validators.required],
          nonNullable: true,
        })
      );
    }
  }

  submitAuthForm() {
    this.isSubmitting = true;
    this.errors = { errors: {} };

    let submitUserAuth =
      this.authType === 'login'
        ? this.authService.login(
            this.authUserForm.value as { email: string; password: string }
          )
        : this.authService.register(
            this.authUserForm.value as {
              email: string;
              password: string;
              username: string;
            }
          );

    submitUserAuth.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.router.navigate(['/article']),
      error: (err) => {
        this.errors = err;
        this.isSubmitting = false;
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
