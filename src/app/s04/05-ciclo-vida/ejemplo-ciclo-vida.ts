import { Component, signal } from '@angular/core';
import { RelojPlaza } from './reloj-plaza';

// =============================================================================
//  S04 · EJEMPLO 5b · Crear y destruir un componente con @if
//  Diapositiva 31
// -----------------------------------------------------------------------------
//  Qué muestra
//    - @if no oculta: crea el componente cuando la condición se cumple y lo
//      destruye cuando deja de cumplirse (S03). Por eso sirve para ver el
//      ciclo de vida completo sin cambiar de ruta.
//    - Los relojes empiezan ocultos: se crean solo en el navegador, cuando el
//      usuario pulsa el botón.
//
//  Qué observar
//    Ver el comentario de reloj-plaza.ts. La consola del navegador (F12) es la
//    evidencia: la pantalla no muestra la fuga.
// =============================================================================

@Component({
  selector: 'app-ejemplo-ciclo-vida',
  imports: [RelojPlaza],
  template: `
    <div class="flex flex-wrap gap-2">
      <button type="button" class="btn" (click)="correcto.update(alternar)">
        {{ correcto() ? 'Ocultar' : 'Mostrar' }} el reloj con limpieza
      </button>
      <button type="button" class="btn rojo" (click)="sinLimpieza.update(alternar)">
        {{ sinLimpieza() ? 'Ocultar' : 'Mostrar' }} el reloj sin limpieza
      </button>
    </div>
    <div class="mt-3 flex flex-wrap gap-3">
      @if (correcto()) {
        <app-reloj-plaza etiqueta="con limpieza" />
      }
      @if (sinLimpieza()) {
        <app-reloj-plaza etiqueta="sin limpieza" [limpiar]="false" />
      }
    </div>
  `,
  styles: `
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .35rem .8rem; font-size: .8rem; font-weight: 600; }
    .rojo { background: #991b1b; }
  `,
})
export class EjemploCicloVida {
  correcto = signal(false);
  sinLimpieza = signal(false);
  protected alternar = (v: boolean) => !v;
}
