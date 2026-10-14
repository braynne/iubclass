import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FichaProducto, Producto } from './ficha-producto';

// =============================================================================
//  PARCIAL 1 · Padre Inventario, único dueño del estado
// -----------------------------------------------------------------------------
//  - productos = signal<Producto[]>: EL estado. Solo este componente lo
//    modifica, con update() y objetos nuevos (map / spread), sin mutar.
//  - valorTotal, unidadesTotales y agotados son computed derivados de la lista.
//    Las signals se leen con paréntesis: productos(), valorTotal().
//  - retirar(nombre): busca el producto y lo reemplaza por una copia con una
//    unidad menos. Nunca hace p.existencias-- ni push.
//  - vaciar(): deja la lista vacía; el @empty del template muestra el mensaje.
// =============================================================================

const PRODUCTOS: Producto[] = [
  { nombre: 'Teclado', precio: 38000, existencias: 6 },
  { nombre: 'Ratón', precio: 22000, existencias: 0 },
  { nombre: 'Cable HDMI', precio: 15000, existencias: 2 },
  { nombre: 'Cable de red', precio: 6500, existencias: 12 },
];

@Component({
  selector: 'app-inventario',
  imports: [FichaProducto, CurrencyPipe],
  template: `
    <h2 class="titulo">Inventario de periféricos</h2>

    <div class="totales">
      <span>Valor total: {{ valorTotal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
      <span>Unidades: {{ unidadesTotales() }}</span>
      <span>Agotados: {{ agotados() }}</span>
    </div>

    <button type="button" class="btn-vaciar" (click)="vaciar()">Vaciar lista</button>

    <div class="fichas">
      @for (p of productos(); track p.nombre) {
        <app-ficha [producto]="p" (retirar)="retirar($event)" />
      } @empty {
        <p class="vacio">No hay productos para mostrar</p>
      }
    </div>
  `,
  styles: `
    .titulo { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
    .totales { display: flex; flex-wrap: wrap; gap: 1.2rem; margin-top: .6rem; font-size: .9rem; font-weight: 600; color: #334155; }
    .btn-vaciar { margin-top: .8rem; border-radius: .5rem; background: #991b1b; color: #fff; padding: .35rem .9rem; font-size: .8rem; font-weight: 700; }
    .fichas { display: flex; flex-wrap: wrap; gap: .8rem; margin-top: 1rem; }
    .vacio { padding: 1.2rem 0; width: 100%; text-align: center; color: #94a3b8; font-size: .9rem; }
  `,
})
export class Inventario {
  // El padre guarda la lista. Ningún hijo la modifica.
  productos = signal<Producto[]>(PRODUCTOS);

  // Los tres totales se derivan de la lista en computeds.
  valorTotal = computed(() =>
    this.productos().reduce((suma, p) => suma + p.precio * p.existencias, 0),
  );

  unidadesTotales = computed(() =>
    this.productos().reduce((suma, p) => suma + p.existencias, 0),
  );

  agotados = computed(() =>
    this.productos().filter((p) => p.existencias === 0).length,
  );

  // update() con un arreglo nuevo: reemplaza solo el producto tocado.
  retirar(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) =>
        p.nombre === nombre && p.existencias > 0
          ? { ...p, existencias: p.existencias - 1 }
          : p,
      ),
    );
  }

  vaciar() {
    this.productos.set([]);
  }
}
