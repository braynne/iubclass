import { Component, computed, effect, signal } from '@angular/core';

// =============================================================================
//  S04 · EJEMPLO 6 · effect() frente a computed()
//  Diapositiva 32
// -----------------------------------------------------------------------------
//  Qué muestra
//    - computed() produce un valor: visibles y cantidad se leen en la
//      plantilla.
//    - effect() no produce ningún valor: ejecuta una acción hacia fuera del
//      componente cada vez que cambia una signal que lee. Aquí escribe en la
//      consola; en una aplicación real guardaría una preferencia o enviaría
//      una métrica.
//    - El effect se declara en un inicializador de campo (o en el
//      constructor), porque necesita el contexto de inyección del componente.
//      Se destruye solo cuando se destruye el componente.
//
//  Qué observar (F12 > Consola)
//    - Al cargar, el effect se ejecuta una vez con el valor inicial.
//    - Cada botón de rango escribe una línea nueva. Pulsar dos veces el mismo
//      botón no escribe nada: la signal no cambió.
//
//  Regla: si el resultado se muestra en pantalla, es un computed.
// =============================================================================

type Rango = 'todos' | 'economico' | 'alto';

@Component({
  selector: 'app-ejemplo-effect',
  template: `
    <div class="flex flex-wrap gap-2">
      @for (r of rangos; track r.id) {
        <button type="button" class="btn" [class.activo]="rango() === r.id" (click)="rango.set(r.id)">{{ r.texto }}</button>
      }
    </div>
    <p class="mt-2 text-sm">
      {{ cantidad() }} productos:
      @for (p of visibles(); track p.nombre; let ultimo = $last) {
        {{ p.nombre }}{{ ultimo ? '' : ', ' }}
      }
    </p>
  `,
  styles: `
    .btn { border: 1px solid #cbd5e1; border-radius: .5rem; background: #fff; padding: .25rem .8rem; font-size: .8rem; font-weight: 600; }
    .activo { background: #1e293b; color: #fff; }
  `,
})
export class EjemploEffect {
  rangos: { id: Rango; texto: string }[] = [
    { id: 'todos', texto: 'Todos' },
    { id: 'economico', texto: 'Económicos' },
    { id: 'alto', texto: 'Precio alto' },
  ];
  rango = signal<Rango>('todos');

  private productos = [
    { nombre: 'Plátano', precio: 1500 },
    { nombre: 'Mango', precio: 1800 },
    { nombre: 'Patilla', precio: 6500 },
    { nombre: 'Queso costeño', precio: 14000 },
  ];

  // Valores: computed.
  visibles = computed(() => {
    const r = this.rango();
    if (r === 'todos') return this.productos;
    return this.productos.filter((p) => (r === 'economico' ? p.precio < 5000 : p.precio >= 5000));
  });
  cantidad = computed(() => this.visibles().length);

  // Acción hacia fuera: effect. Lee rango(), así que se repite cuando cambia.
  private registro = effect(() => {
    console.log(`[effect] rango = ${this.rango()} · ${this.cantidad()} productos`);
  });
}
