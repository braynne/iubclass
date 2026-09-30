import { Component, computed, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../producto';

// =============================================================================
//  S04 · EJEMPLO 4 · Quién es el dueño del estado: una copia frente a un aviso
//  Diapositiva 29
// -----------------------------------------------------------------------------
//  Dos versiones del mismo hijo, un editor de precio con el botón «+100».
//
//  EditorMal · PROVOCA UN ERROR DE DISEÑO (compila y no muestra mensaje)
//    El hijo modifica el objeto que recibió por input:
//        this.producto().precio += 100
//    El hijo ve el precio nuevo, pero la signal del padre no se enteró del
//    cambio: la suma del padre no se recalcula. Hay dos versiones del dato en
//    pantalla y ninguna avisa que están en desacuerdo.
//
//  EditorBien
//    El hijo solo emite subir(nombre). El padre, que es el dueño de la lista,
//    la actualiza con update() y un arreglo nuevo. La tarjeta y la suma leen
//    el mismo estado, así que siempre coinciden.
//
//  Qué observar
//    - Pulsar «+100» tres veces en el panel de la izquierda: el precio de la
//      fila sube y la suma se queda igual.
//    - Hacer lo mismo en el panel de la derecha: suben los dos.
// =============================================================================

const PRODUCTOS: Producto[] = [
  { nombre: 'Mango', precio: 1800 },
  { nombre: 'Yuca', precio: 2800 },
];

const ESTILOS = `
  .fila { display: flex; align-items: center; justify-content: space-between; gap: .8rem; border-top: 1px solid #e2e8f0; padding: .35rem 0; font-size: .85rem; }
  .btn { border-radius: .4rem; background: #1e293b; color: #fff; padding: .15rem .6rem; font-size: .75rem; font-weight: 700; }
`;

// ----------------------------------------------------------------- versión mal
@Component({
  selector: 'app-editor-mal',
  imports: [CurrencyPipe],
  template: `
    <div class="fila">
      <span>{{ producto().nombre }} · {{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
      <button type="button" class="btn" (click)="subir()">+100</button>
    </div>
  `,
  styles: ESTILOS,
})
export class EditorMal {
  producto = input.required<Producto>();

  subir() {
    // ERROR: modifica el objeto del padre sin pasar por su signal.
    this.producto().precio += 100;
  }
}

// ---------------------------------------------------------------- versión bien
@Component({
  selector: 'app-editor-bien',
  imports: [CurrencyPipe],
  template: `
    <div class="fila">
      <span>{{ producto().nombre }} · {{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
      <button type="button" class="btn" (click)="subir.emit(producto().nombre)">+100</button>
    </div>
  `,
  styles: ESTILOS,
})
export class EditorBien {
  producto = input.required<Producto>();
  subir = output<string>();
}

// ---------------------------------------------------------------------- padre
@Component({
  selector: 'app-ejemplo-dueno-estado',
  imports: [EditorMal, EditorBien, CurrencyPipe],
  template: `
    <div class="grid gap-4 md:grid-cols-2">
      <div class="panel mal">
        <p class="tit">El hijo modifica su copia</p>
        @for (p of listaMal(); track p.nombre) {
          <app-editor-mal [producto]="p" />
        }
        <p class="suma">Suma en el padre: {{ sumaMal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
      </div>
      <div class="panel bien">
        <p class="tit">El hijo avisa y el padre actualiza</p>
        @for (p of listaBien(); track p.nombre) {
          <app-editor-bien [producto]="p" (subir)="subirPrecio($event)" />
        }
        <p class="suma">Suma en el padre: {{ sumaBien() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
      </div>
    </div>
  `,
  styles: `
    .panel { border-radius: .6rem; padding: .6rem .9rem; background: #fff; }
    .mal { border: 2px solid #fca5a5; }
    .bien { border: 2px solid #86efac; }
    .tit { font-size: .75rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #475569; }
    .suma { margin-top: .4rem; font-weight: 800; color: #0f172a; }
  `,
})
export class EjemploDuenoEstado {
  // Copias independientes para que un panel no afecte al otro.
  listaMal = signal<Producto[]>(PRODUCTOS.map((p) => ({ ...p })));
  listaBien = signal<Producto[]>(PRODUCTOS.map((p) => ({ ...p })));

  sumaMal = computed(() => this.listaMal().reduce((s, p) => s + p.precio, 0));
  sumaBien = computed(() => this.listaBien().reduce((s, p) => s + p.precio, 0));

  // El único lugar donde cambia la lista de la derecha.
  subirPrecio(nombre: string) {
    this.listaBien.update((lista) =>
      lista.map((p) => (p.nombre === nombre ? { ...p, precio: p.precio + 100 } : p)),
    );
  }
}
