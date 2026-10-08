import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services/language.service';

/**
 * Componente raíz de la aplicación. Inicializa el idioma activo. La
 * transición de fundido cruzado entre páginas (boot → login → escritorio)
 * se gestiona de forma nativa mediante la View Transitions API del Router
 * (ver `withViewTransitions()` en app.config.ts y los estilos globales
 * `::view-transition-*` en styles.scss).
 *
 * @author adrianpmdev
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly languageService = inject(LanguageService);

  ngOnInit(): void {
    this.languageService.initLang();
  }
}
