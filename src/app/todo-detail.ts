import { Component, effect, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-detail',
  imports: [RouterLink],
  template: `
    <a routerLink="/todos">← Elenco</a>

    @if (service.loading()) { <p>Caricamento...</p> }
    @if (service.error()) { <p class="errore">{{ service.error() }}</p> }

    @if (service.todo(); as t) {
      <h1>Todo n. {{ t.id }}</h1>
      <p>{{ t.title }}</p>
      <p>Stato: {{ t.completed ? 'completato' : 'da fare' }}</p>
    }

    <button [disabled]="id() <= 1" [routerLink]="['/todos', id() - 1]">« Precedente</button>
    <button [disabled]="id() >= 200" [routerLink]="['/todos', id() + 1]">Successivo »</button>
  `
})
export class TodoDetail {
  service = inject(TodoService);
  id = input.required({ transform: numberAttribute });

  constructor() {
    effect(() => this.service.caricaUno(this.id()));
  }
}