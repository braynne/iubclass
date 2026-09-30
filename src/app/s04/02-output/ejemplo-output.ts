import { Component, computed, signal } from '@angular/core';
import { BotonFavorito } from './boton-favorito';

// =============================================================================
//  S04 · EJEMPLO 2b · El padre escucha el evento del hijo con (alternar)
//  Diapositivas 22 y 23
// -----------------------------------------------------------------------------
//  Qué muestra
//    - (alternar)="alternarFavorito($event)": el mismo binding de eventos de
//      la S02, pero sobre un evento declarado por el hijo. $event es el dato
//      que el hijo pasó a emit(), aquí un string.
//    - El padre es dueño de la lista de favoritos: es el único que la cambia,
//      con update() y un arreglo nuevo.
//    - totalFavoritos es un computed del padre: el encabezado y los botones
//      leen el mismo estado, así que nunca pueden quedar en desacuerdo.
//
//  Qué observar
//    - Los datos bajan (marcado) y los eventos suben (alternar). El contador
//      del encabezado cambia aunque el botón no sabe que ese contador existe.
// =============================================================================

@Component({
  selector: 'app-ejemplo-output',
  imports: [BotonFavorito],
  template: `
    <p class="text-sm font-semibold text-slate-700">
      Favoritos: {{ totalFavoritos() }} · Último evento recibido: {{ ultimo() || 'ninguno' }}
    </p>
    <ul class="mt-2 space-y-1">
      @for (nombre of productos; track nombre) {
        <li class="flex items-center justify-between rounded border border-slate-200 bg-white px-3 py-1.5 text-sm">
          <span>{{ nombre }}</span>
          <app-boton-favorito
            [nombre]="nombre"
            [marcado]="favoritos().includes(nombre)"
            (alternar)="alternarFavorito($event)"
          />
        </li>
      }
    </ul>
  `,
})
export class EjemploOutput {
  productos = ['Mango', 'Guayaba', 'Patilla', 'Tomate'];
  favoritos = signal<string[]>([]);
  ultimo = signal('');
  totalFavoritos = computed(() => this.favoritos().length);

  // Recibe el nombre que emitió el hijo. Si ya es favorito, lo quita; si no,
  // lo agrega. En los dos casos se entrega un arreglo nuevo.
  alternarFavorito(nombre: string) {
    this.ultimo.set(nombre);
    this.favoritos.update((lista) =>
      lista.includes(nombre) ? lista.filter((n) => n !== nombre) : [...lista, nombre],
    );
  }
}
