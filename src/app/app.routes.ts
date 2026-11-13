import { Routes } from '@angular/router';
import { TodoList } from './todo-list';
import { TodoDetail } from './todo-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'todos', component: TodoList },
  { path: 'todos/:id', component: TodoDetail }
];