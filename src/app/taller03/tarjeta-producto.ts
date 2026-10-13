import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from './producto';

// =============================================================================
//  TALLER 03 · R2 y R3 · Hijo TarjetaProducto
// -----------------------------------------------------------------------------
//  - producto = input.required<Producto>(): el padre está obligado a pasarlo.
//  - enPedido = input(0): unidades que ya están en el pedido; si el padre no
//    la pasa, vale 0.
//  - disponibles es un computed derivado de los dos inputs: existencias menos
//    lo que ya está en el pedido.
//  - agregar = output<string>(): avisa el nombre del producto. La tarjeta NO
//    modifica el pedido ni el producto; solo emite.
//  - El botón queda deshabilitado cuando no quedan unidades disponibles.
// =============================================================================

@Component({
  selector: 'app-tarjeta-producto',
  imports: [CurrencyPipe],
  template: `
    <article class="tarjeta" [class.agotado]="disponibles() === 0">
      <h5>{{ producto().nombre }}</h5>
      <p class="precio">{{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
      <p class="disponibles">Disponibles: {{ disponibles() }}</p>
      <button
        type="button"
        class="btn"
        [disabled]="disponibles() === 0"
        (click)="agregar.emit(producto().nombre)"
      >
        Agregar
      </button>
    </article>
  `,
  styles: `
    .tarjeta { border: 1px solid #cbd5e1; border-radius: .6rem; padding: .7rem .9rem; min-width: 9rem; background: #fff; display: flex; flex-direction: column; gap: .2rem; }
    .agotado { border-color: #fca5a5; background: #fff7f7; }
    h5 { font-weight: 700; color: #0f172a; }
    .precio { font-size: 1.05rem; font-weight: 800; color: #1d4ed8; }
    .disponibles { font-size: .75rem; color: #64748b; }
    .btn { margin-top: .35rem; border-radius: .5rem; background: #1e293b; color: #fff; padding: .3rem .8rem; font-size: .8rem; font-weight: 600; }
    .btn:disabled { cursor: not-allowed; opacity: .35; }
  `,
})
export class TarjetaProducto {
  producto = input.required<Producto>();
  enPedido = input(0);

  disponibles = computed(() => this.producto().existencias - this.enPedido());

  agregar = output<string>();
}
