import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient);
  private url = 'https://jsonplaceholder.typicode.com/todos';

  // signal privati (modificabili solo qui) esposti in sola lettura
  private _todos = signal<Todo[]>([]);
  todos = this._todos.asReadonly();

  private _todo = signal<Todo | null>(null);
  todo = this._todo.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _error = signal('');
  error = this._error.asReadonly();

  caricaTutti() {
    this._error.set('');
    if (this._todos().length > 0) return; // già caricati: così non perdo quelli creati
    this._loading.set(true);
    this.http.get<Todo[]>(this.url).subscribe({
      next: dati => { this._todos.set(dati); this._loading.set(false); },
      error: err => this.gestisciErrore(err)
    });
  }

  caricaUno(id: number) {
    this._error.set('');
    this._todo.set(null);
    this._loading.set(true);
    this.http.get<Todo>(`${this.url}/${id}`).subscribe({
      next: dato => { this._todo.set(dato); this._loading.set(false); },
      error: err => this.gestisciErrore(err)
    });
  }

  crea(title: string) {
    const nuovo = { userId: 1, title, completed: false };
    this.http.post<Todo>(this.url, nuovo).subscribe({
      next: creato => this._todos.update(lista => [creato, ...lista]),
      error: err => this.gestisciErrore(err)
    });
  }

  private gestisciErrore(err: HttpErrorResponse) {
    this._loading.set(false);
    if (err.status === 404) this._error.set('Todo non trovato (404)');
    else if (err.status === 0) this._error.set('Rete assente: controlla la connessione');
    else this._error.set('Errore ' + err.status);
  }
}