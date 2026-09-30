import { Component, input, model } from '@angular/core';

// =============================================================================
//  S04 · EJEMPLO 3a · Enlace en dos vías con model()
//  Diapositiva 27
// -----------------------------------------------------------------------------
//  Qué muestra
//    - cantidad = model(1): es un input que además se puede escribir. Cuando
//      el hijo hace cantidad.update(...), Angular emite el evento
//      cantidadChange y el padre recibe el valor nuevo.
//    - Equivale a declarar a mano input() + output() con el nombre
//      cantidadChange; model() lo hace en una línea.
//    - maximo es un input normal: el hijo lo lee, no lo cambia.
//
//  Cuándo usarlo
//    Para controles propios que editan un solo valor (selector de cantidad,
//    interruptor, calificación con estrellas). Para todo lo demás: input()
//    para bajar datos y output() para avisar.
// =============================================================================

@Component({
  selector: 'app-selector-cantidad',
  template: `
    <div class="sel">
      <button type="button" (click)="restar()" [disabled]="cantidad() <= 1">−</button>
      <span>{{ cantidad() }}</span>
      <button type="button" (click)="sumar()" [disabled]="cantidad() >= maximo()">+</button>
    </div>
  `,
  styles: `
    .sel { display: inline-flex; align-items: center; gap: .6rem; border: 1px solid #cbd5e1; border-radius: .5rem; padding: .2rem .4rem; background: #fff; }
    button { width: 1.8rem; border-radius: .35rem; background: #1e293b; color: #fff; font-weight: 700; }
    button:disabled { background: #cbd5e1; }
    span { min-width: 1.5rem; text-align: center; font-weight: 700; }
  `,
})
export class SelectorCantidad {
  cantidad = model(1);
  maximo = input(10);

  // El hijo sí escribe en un model(). En un input() esto no compila.
  sumar() {
    this.cantidad.update((n) => n + 1);
  }

  restar() {
    this.cantidad.update((n) => n - 1);
  }
}
