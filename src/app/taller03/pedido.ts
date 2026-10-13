import { Component, computed, signal } from '@angular/core';
import { TarjetaProducto } from './tarjeta-producto';
import { ResumenPedido } from './resumen-pedido';
import { Linea, Producto } from './producto';

// =============================================================================
//  TALLER 03 · R1 y R4 · Padre Pedido, único dueño del estado
// -----------------------------------------------------------------------------
//  - productos: el catálogo fijo de la tabla 1 del enunciado.
//  - pedido = signal<Linea[]>([]): EL estado. Solo este componente lo modifica.
//  - lineas = computed(() => this.pedido()): lo que recibe el resumen.
//  - unidades = computed(...): cuántas unidades de cada producto hay en el
//    pedido; el padre lo pasa a cada tarjeta con [enPedido].
//  - agregar(nombre): suma una unidad a la línea existente o crea una nueva.
//  - quitar(nombre): elimina la línea completa.
//    Los dos usan update() y devuelven un arreglo NUEVO (map / filter / spread),
//    sin mutar el arreglo de la signal.
// =============================================================================

const PRODUCTOS: Producto[] = [
  { nombre: 'Mango', precio: 1800, existencias: 3 },
  { nombre: 'Aguacate', precio: 4500, existencias: 2 },
  { nombre: 'Limón', precio: 650, existencias: 10 },
  { nombre: 'Queso costeño', precio: 12000, existencias: 1 },
];

@Component({
  selector: 'app-pedido',
  imports: [TarjetaProducto, ResumenPedido],
  template: `
    <h2 class="text-2xl font-bold text-slate-900">Pedido</h2>
    <p class="mt-1 text-sm text-slate-500">Arme su pedido y revise el resumen.</p>

    <div class="mt-6 grid gap-6 md:grid-cols-2">
      <div class="flex flex-wrap gap-3">
        @for (p of productos; track p.nombre) {
          <app-tarjeta-producto
            [producto]="p"
            [enPedido]="unidades().get(p.nombre) ?? 0"
            (agregar)="agregar($event)"
          />
        }
      </div>

      <app-resumen-pedido [lineas]="lineas()" (quitar)="quitar($event)" />
    </div>
  `,
})
export class Pedido {
  readonly productos = PRODUCTOS;

  // El padre guarda el pedido. Ningún hijo lo modifica.
  pedido = signal<Linea[]>([]);

  lineas = computed(() => this.pedido());

  // Unidades por producto, para que cada tarjeta calcule sus disponibles.
  unidades = computed(() => {
    const mapa = new Map<string, number>();
    for (const linea of this.pedido()) {
      mapa.set(linea.nombre, linea.cantidad);
    }
    return mapa;
  });

  agregar(nombre: string) {
    const producto = this.productos.find((p) => p.nombre === nombre);
    if (!producto) return;

    this.pedido.update((lineas) => {
      const existe = lineas.some((linea) => linea.nombre === nombre);
      if (existe) {
        // Arreglo nuevo: mapa que reemplaza la línea por una copia con +1.
        return lineas.map((linea) =>
          linea.nombre === nombre ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
        );
      }
      // Arreglo nuevo: se añade una línea nueva.
      return [...lineas, { nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    });
  }

  quitar(nombre: string) {
    // Arreglo nuevo: filter elimina la línea completa.
    this.pedido.update((lineas) => lineas.filter((linea) => linea.nombre !== nombre));
  }
}
