import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SelectorCantidad } from './selector-cantidad';

// =============================================================================
//  S04 · EJEMPLO 3b · El padre usa [(cantidad)]
//  Diapositiva 27
// -----------------------------------------------------------------------------
//  Qué muestra
//    - [(cantidad)]="libras": corchetes por fuera y paréntesis por dentro.
//      Los corchetes bajan el valor; los paréntesis reciben el cambio.
//    - libras es una signal del padre. Dentro de [( )] se escribe sin
//      paréntesis de lectura: Angular necesita la signal, no su valor.
//
//  Qué observar
//    - Con + y −, cambian el total y el texto del padre: el valor subió.
//    - Con «Reiniciar», el padre cambia la signal y el selector muestra 1:
//      el valor bajó. Es un solo dato, visible en los dos componentes.
// =============================================================================

@Component({
  selector: 'app-ejemplo-model',
  imports: [SelectorCantidad, CurrencyPipe],
  template: `
    <div class="flex flex-wrap items-center gap-4 text-sm">
      <span class="font-semibold">Mango · {{ precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }} la libra</span>
      <app-selector-cantidad [(cantidad)]="libras" [maximo]="6" />
      <span>{{ libras() }} lb · total {{ total() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
      <button type="button" class="btn" (click)="libras.set(1)">Reiniciar</button>
    </div>
  `,
  styles: `
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .3rem .8rem; font-size: .8rem; font-weight: 600; }
  `,
})
export class EjemploModel {
  precio = 1800;
  libras = signal(2);
  total = computed(() => this.libras() * this.precio);
}
