import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggerComponent } from './logger/logger.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: LoggerComponent
  },
  { path: '**', 
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
