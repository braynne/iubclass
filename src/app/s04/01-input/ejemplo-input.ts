import { Component, signal } from '@angular/core';
import { TarjetaPrecio } from './tarjeta-precio';
import { Producto } from '../producto';

// =============================================================================
//  S04 · EJEMPLO 1b · El padre pasa datos al hijo con [producto]
//  Diapositivas 20 y 21
// -----------------------------------------------------------------------------
//  Qué muestra
//    - El padre importa al hijo en imports y lo usa por su selector.
//    - [producto]="p" es un binding de propiedad, el mismo de la S02, pero
//      dirigido al input de otro componente. Sin corchetes, Angular pasaría el
//      texto "p" y no el objeto.
//    - [destacado] recibe $first: solo la primera tarjeta va destacada. Si el
//      padre no pasara [destacado], el hijo usaría su valor por defecto, false.
//
//  Qué observar
//    - «Subir el ñame 1.000» cambia el dato en el padre. La tarjeta del ñame
//      muestra el precio nuevo y aparece la etiqueta «Precio alto»: el
//      computed del hijo depende del input y se recalcula solo.
// =============================================================================

@Component({
  selector: 'app-ejemplo-input',
  imports: [TarjetaPrecio],
  template: `
    <div class="flex flex-wrap gap-3">
      @for (p of productos(); track p.nombre; let primero = $first) {
        <app-tarjeta-precio [producto]="p" [destacado]="primero" />
      }
    </div>
    <div class="mt-3 flex gap-2">
      <button type="button" class="btn" (click)="subir('Ñame')">Subir el ñame 1.000</button>
      <button type="button" class="btn" (click)="restaurar()">Restaurar precios</button>
    </div>
  `,
  styles: `
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .35rem .8rem; font-size: .8rem; font-weight: 600; }
  `,
})
export class EjemploInput {
  private readonly iniciales: Producto[] = [
    { nombre: 'Mango', precio: 1800 },
    { nombre: 'Ñame', precio: 4200 },
    { nombre: 'Patilla', precio: 6500 },
  ];

  // El padre es dueño de la lista. Las tarjetas solo la muestran.
  productos = signal<Producto[]>(this.iniciales);

  subir(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) => (p.nombre === nombre ? { ...p, precio: p.precio + 1000 } : p)),
    );
  }

  restaurar() {
    this.productos.set(this.iniciales);
  }
}
