import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../producto';

// =============================================================================
//  S04 · EJEMPLO 1a · Componente hijo con input.required() e input()
//  Diapositivas 20 y 21
// -----------------------------------------------------------------------------
//  Qué muestra
//    - producto = input.required<Producto>(): el padre está obligado a pasarlo.
//      Si lo omite, la aplicación no compila (NG8008).
//    - destacado = input(false): entrada opcional con valor por defecto. Si el
//      padre no la pasa, vale false.
//    - Un input es una signal de solo lectura: se lee con paréntesis,
//      producto().nombre, y no tiene set() ni update().
//    - esCaro es un computed que depende de un input: cuando el padre cambia
//      el producto, esCaro se recalcula sin código adicional.
//
//  Qué observar
//    - La tarjeta no sabe de dónde viene el producto ni cuántas tarjetas hay.
//      Solo sabe mostrar el que recibe. Por eso se puede reutilizar.
// =============================================================================

@Component({
  selector: 'app-tarjeta-precio',
  imports: [CurrencyPipe],
  template: `
    <article class="tarjeta" [class.destacada]="destacado()">
      <h5>{{ producto().nombre }}</h5>
      <p class="precio">{{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
      @if (esCaro()) {
        <span class="etq">Precio alto</span>
      }
    </article>
  `,
  styles: `
    .tarjeta { border: 1px solid #cbd5e1; border-radius: .6rem; padding: .6rem .8rem; min-width: 8.5rem; background: #fff; }
    .destacada { border: 2px solid #f59e0b; background: #fffbeb; }
    h5 { font-weight: 700; color: #0f172a; }
    .precio { font-size: 1.1rem; font-weight: 800; color: #1d4ed8; }
    .etq { display: inline-block; margin-top: .3rem; border-radius: 999px; background: #fee2e2; color: #991b1b; padding: .05rem .5rem; font-size: .7rem; font-weight: 700; }
  `,
})
export class TarjetaPrecio {
  // Obligatorio: sin producto, la tarjeta no tiene nada que mostrar.
  producto = input.required<Producto>();

  // Opcional: la mayoría de las tarjetas no van destacadas.
  destacado = input(false);

  // Valor derivado de un input. Se declara igual que en la S02.
  esCaro = computed(() => this.producto().precio >= 5000);
}
