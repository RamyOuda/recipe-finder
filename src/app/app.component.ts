import { Component, inject, OnInit } from '@angular/core';
import { AppStore } from './store/app.store';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly #store = inject(AppStore);

  ngOnInit(): void {
    this.#store.fetchData();
  }
}
