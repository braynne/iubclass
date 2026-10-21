import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { UnidadesPipe } from './unidades-pipe';

// =============================================================================
//  COM30 · Taller 02 · Listado con filtros, estados y pipe propio
//  Sesión S03 · RA1 · Criterios CE2, CE3 y CE4
// -----------------------------------------------------------------------------
//  Qué muestra
//    - R1: tabla de productos con @for y track por una identidad estable
//          (p.nombre) y bloque @empty con el mensaje del enunciado.
//    - R2: cuatro botones de filtro (Todas, Frutas, Verduras, Granos). La
//          categoría seleccionada vive en una signal y la lista visible se
//          deriva en un computed.
//    - R3: la columna Estado se calcula en un computed y se muestra con @switch.
//    - R4: precio con currency en es-CO sin decimales; fecha del día en el
//          título con date:'fullDate' (es-CO se registra en app.config.ts).
//    - R5: pipe propio unidades para la columna Existencias.
//    - R6: [class.agotado] resalta la fila de un producto sin existencias.
//
//  Reglas respetadas
//    - Toda signal se lee con paréntesis en la plantilla.
//    - El @for usa track sobre un campo propio del producto, no $index.
//    - La lista visible y el estado son computed; ningún método los calcula
//      desde la plantilla.
//    - El estado no se modifica: update() con arreglos nuevos.
// =============================================================================

type Estado = 'agotado' | 'bajo' | 'disponible';

interface Producto {
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
}

interface Fila extends Producto {
  estado: Estado;
}

@Component({
  selector: 'app-taller02',
  imports: [CurrencyPipe, DatePipe, UnidadesPipe],
  template: `
    <h1 class="text-2xl font-bold text-slate-900">
      Inventario · {{ hoy | date: 'fullDate' }}
    </h1>

    <!-- R2 · Un botón por categoría. set() porque el valor no depende del anterior. -->
    <div class="mt-3 flex flex-wrap gap-2">
      @for (c of categorias; track c) {
        <button
          type="button"
          class="btn"
          [class.activo]="filtro() === c"
          (click)="filtro.set(c)"
        >
          {{ c }}
        </button>
      }
    </div>

    <!-- R1 · Encabezado fijo; el cuerpo se llena con @for y su @empty. -->
    <table class="mt-3 w-full text-left text-sm">
      <thead class="bg-slate-900 text-xs uppercase text-white">
        <tr>
          <th class="px-3 py-2">Producto</th>
          <th class="px-3 py-2">Precio</th>
          <th class="px-3 py-2">Existencias</th>
          <th class="px-3 py-2">Estado</th>
        </tr>
      </thead>
      <tbody>
        @for (p of filas(); track p.nombre) {
          <tr class="border-t border-slate-100" [class.agotado]="p.estado === 'agotado'">
            <td class="px-3 py-2 font-semibold">{{ p.nombre }}</td>
            <!-- R4 · currency es-CO, sin decimales -->
            <td class="px-3 py-2">{{ p.precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
            <!-- R5 · pipe propio unidades -->
            <td class="px-3 py-2">{{ p.cantidad | unidades }}</td>
            <!-- R3 · @switch sobre el estado calculado en el computed -->
            <td class="px-3 py-2">
              @switch (p.estado) {
                @case ('agotado') { <span class="etq rojo">Agotado</span> }
                @case ('bajo') { <span class="etq ambar">Bajo</span> }
                @default { <span class="etq verde">Disponible</span> }
              }
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="4" class="px-3 py-4 text-center text-slate-500">
              No hay productos en esta categoría
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    .btn { border-radius: .5rem; background: #e2e8f0; color: #1e293b; padding: .35rem .8rem; font-size: .8rem; font-weight: 600; }
    .btn.activo { background: #1e293b; color: #fff; }
    .etq { border-radius: 999px; padding: .1rem .6rem; font-size: .72rem; font-weight: 700; }
    .verde { background: #d1fae5; color: #065f46; }
    .ambar { background: #fef3c7; color: #92400e; }
    .rojo  { background: #fee2e2; color: #991b1b; }
    /* R6 · fila de un producto agotado */
    .agotado { background: #fee2e2; }
  `,
})
export class Taller02 {
  // R4 · Fecha del día para el título.
  hoy = new Date();

  // R2 · Categoría seleccionada.
  filtro = signal('Todas');

  // Opciones del filtro (una sola fuente de verdad para los botones).
  categorias = ['Todas', 'Frutas', 'Verduras', 'Granos'];

  // Tabla 1 · Datos de prueba del enunciado.
  productos = signal<Producto[]>([
    { nombre: 'Mango', categoria: 'Frutas', precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', categoria: 'Frutas', precio: 1200, cantidad: 0 },
    { nombre: 'Patilla', categoria: 'Frutas', precio: 6500, cantidad: 2 },
    { nombre: 'Tomate', categoria: 'Verduras', precio: 3200, cantidad: 9 },
    { nombre: 'Cebolla', categoria: 'Verduras', precio: 2800, cantidad: 1 },
    { nombre: 'Ahuyama', categoria: 'Verduras', precio: 4500, cantidad: 0 },
  ]);

  // R2 · Lista visible: «Todas» no filtra; el resto, por igualdad de categoría.
  visibles = computed(() => {
    const categoria = this.filtro();
    if (categoria === 'Todas') return this.productos();
    return this.productos().filter((p) => p.categoria === categoria);
  });

  // R3 · Cada fila visible más su estado, calculado aquí y no en la plantilla.
  filas = computed<Fila[]>(() =>
    this.visibles().map((p) => ({ ...p, estado: this.estadoDe(p.cantidad) })),
  );

  private estadoDe(cantidad: number): Estado {
    if (cantidad === 0) return 'agotado';
    if (cantidad <= 2) return 'bajo';
    return 'disponible';
  }
}
