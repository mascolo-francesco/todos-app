import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-list',
  imports: [RouterLink],
  template: `
    <h1>Todos</h1>

    <input #nuovo placeholder="Nuovo todo">
    <button (click)="service.crea(nuovo.value); nuovo.value = ''">Aggiungi</button>

    <p><input #f placeholder="Filtra per titolo" (input)="filtro.set(f.value)"></p>

    @if (service.loading()) { <p>Caricamento...</p> }
    @if (service.error()) { <p class="errore">{{ service.error() }}</p> }

    <p>Completati: {{ completati() }} su {{ service.todos().length }}</p>

    <ul>
      @for (t of filtrati(); track $index) {
        <li>
          <a [routerLink]="['/todos', t.id]">{{ t.title }}</a>
          @if (t.completed) { ✔ }
        </li>
      }
    </ul>
  `
})
export class TodoList {
  service = inject(TodoService);
  filtro = signal('');

  filtrati = computed(() =>
    this.service.todos().filter(t => t.title.toLowerCase().includes(this.filtro().toLowerCase()))
  );

  completati = computed(() =>
    this.service.todos().filter(t => t.completed).length
  );

  constructor() {
    this.service.caricaTutti();
  }
}