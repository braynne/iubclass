import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

// =============================================================================
//  PARCIAL 1 · Hijo FichaProducto
// -----------------------------------------------------------------------------
//  - producto = input.required<Producto>(): el padre está obligado a pasarlo.
//    Si lo omite, la aplicación no compila (NG8008).
//  - estado es un computed derivado del input; no es un método invocado desde
//    la plantilla. Regla: Agotado con 0; Inventario bajo con menos de 3;
//    Disponible con 3 o más.
//  - retirar = output<string>(): avisa el nombre del producto. La ficha NO
//    modifica el producto ni la lista; solo emite.
//  - El botón «Retirar 1» queda deshabilitado cuando no quedan existencias.
// =============================================================================

export interface Producto { nombre: string; precio: number; existencias: number; }

type Estado = 'agotado' | 'bajo' | 'disponible';

@Component({
  selector: 'app-ficha',
  imports: [CurrencyPipe],
  template: `
    <article class="ficha" [class.agotado]="estado() === 'agotado'">
      <h5>{{ producto().nombre }}</h5>
      <p class="precio">{{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
      <p class="existencias">Existencias: {{ producto().existencias }}</p>

      @switch (estado()) {
        @case ('agotado')    { <span class="etq rojo">Agotado</span> }
        @case ('bajo')       { <span class="etq ambar">Inventario bajo</span> }
        @default             { <span class="etq verde">Disponible</span> }
      }

      <button
        type="button"
        class="btn"
        [disabled]="producto().existencias === 0"
        (click)="retirar.emit(producto().nombre)"
      >
        Retirar 1
      </button>
    </article>
  `,
  styles: `
    .ficha { border: 1px solid #cbd5e1; border-radius: .6rem; padding: .7rem .9rem; min-width: 10rem; background: #fff; display: flex; flex-direction: column; gap: .25rem; }
    .agotado { border-color: #fca5a5; background: #fff7f7; }
    h5 { font-weight: 700; color: #0f172a; }
    .precio { font-size: 1.05rem; font-weight: 800; color: #1d4ed8; }
    .existencias { font-size: .75rem; color: #64748b; }
    .etq { align-self: flex-start; border-radius: 999px; padding: .1rem .6rem; font-size: .72rem; font-weight: 700; }
    .verde { background: #d1fae5; color: #065f46; }
    .ambar { background: #fef3c7; color: #92400e; }
    .rojo  { background: #fee2e2; color: #991b1b; }
    .btn { margin-top: .35rem; border-radius: .5rem; background: #1e293b; color: #fff; padding: .3rem .8rem; font-size: .8rem; font-weight: 600; }
    .btn:disabled { cursor: not-allowed; opacity: .35; }
  `,
})
export class FichaProducto {
  producto = input.required<Producto>();

  // El estado se deriva del input. Nunca se llama a un método desde la plantilla.
  estado = computed<Estado>(() => {
    const existencias = this.producto().existencias;
    if (existencias === 0) return 'agotado';
    return existencias < 3 ? 'bajo' : 'disponible';
  });

  // El nombre del evento es el que usa el padre entre paréntesis: (retirar).
  retirar = output<string>();
}
