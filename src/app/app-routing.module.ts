import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthUserComponent } from './components/core/auth-user/auth-user.component';
import { HomeComponent } from './components/layouts/home/home.component';
import { ArticlesComponent } from './components/articles/articles.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: AuthUserComponent },
  { path: 'register', component: AuthUserComponent },
  { path: 'article', component: ArticlesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
