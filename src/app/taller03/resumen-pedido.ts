import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Linea } from './producto';

// =============================================================================
//  TALLER 03 · R5 · Hijo ResumenPedido
// -----------------------------------------------------------------------------
//  - lineas = input.required<Linea[]>(): el padre es dueño del pedido; el
//    resumen solo lo muestra.
//  - quitar = output<string>(): emite el nombre de la línea a eliminar. El
//    hijo no toca la lista; solo avisa.
//  - @for recorre las líneas con track y @empty muestra el mensaje cuando no
//    hay ninguna.
//  - subtotal, domicilio y total se calculan en computed.
//    Regla del domicilio: vacío => no se cobra; subtotal >= $ 20.000 => gratis;
//    subtotal < $ 20.000 => $ 3.000. El caso de exactamente $ 20.000 es gratis.
// =============================================================================

@Component({
  selector: 'app-resumen-pedido',
  imports: [CurrencyPipe],
  template: `
    <section class="resumen">
      <h4>Resumen del pedido</h4>

      @for (linea of lineas(); track linea.nombre) {
        <div class="fila">
          <span class="nom">{{ linea.nombre }} · {{ linea.cantidad }}</span>
          <span class="sub">{{ linea.precio * linea.cantidad | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
          <button type="button" class="quitar" (click)="quitar.emit(linea.nombre)">Quitar</button>
        </div>
      } @empty {
        <p class="vacio">El pedido está vacío</p>
      }

      <div class="totales">
        <div class="linea-total">
          <span>Subtotal</span>
          <span>{{ subtotal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
        </div>
        <div class="linea-total">
          <span>Domicilio</span>
          @if (lineas().length === 0) {
            <span>—</span>
          } @else if (domicilio() === 0) {
            <span class="gratis">Gratis</span>
          } @else {
            <span>{{ domicilio() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
          }
        </div>
        <div class="linea-total total">
          <span>Total</span>
          <span>{{ total() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
        </div>
      </div>
    </section>
  `,
  styles: `
    .resumen { border: 1px solid #e2e8f0; border-radius: .75rem; background: #fff; padding: .9rem 1.1rem; }
    h4 { font-weight: 800; color: #0f172a; margin-bottom: .5rem; }
    .fila { display: flex; align-items: center; gap: .6rem; border-top: 1px solid #e2e8f0; padding: .3rem 0; font-size: .85rem; }
    .nom { flex: 1; color: #0f172a; font-weight: 600; }
    .sub { color: #475569; }
    .quitar { border-radius: .4rem; background: #fee2e2; color: #991b1b; padding: .15rem .55rem; font-size: .7rem; font-weight: 700; }
    .vacio { padding: .8rem 0; text-align: center; color: #94a3b8; font-size: .85rem; }
    .totales { margin-top: .6rem; border-top: 2px solid #0f172a; padding-top: .5rem; }
    .linea-total { display: flex; justify-content: space-between; font-size: .85rem; color: #334155; padding: .15rem 0; }
    .total { font-size: 1.05rem; font-weight: 800; color: #0f172a; }
    .gratis { color: #15803d; font-weight: 700; }
  `,
})
export class ResumenPedido {
  lineas = input.required<Linea[]>();

  quitar = output<string>();

  subtotal = computed(() =>
    this.lineas().reduce((suma, linea) => suma + linea.precio * linea.cantidad, 0),
  );

  // El pedido vacío no cobra domicilio; desde $ 20.000 (inclusive) es gratis.
  domicilio = computed(() => {
    if (this.lineas().length === 0) return 0;
    return this.subtotal() >= 20000 ? 0 : 3000;
  });

  total = computed(() => this.subtotal() + this.domicilio());
}
