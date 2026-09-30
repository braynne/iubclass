import { Component, input, output } from '@angular/core';

// =============================================================================
//  S04 · EJEMPLO 2a · Componente hijo con output()
//  Diapositiva 22
// -----------------------------------------------------------------------------
//  Qué muestra
//    - alternar = output<string>(): el hijo declara un evento propio y el tipo
//      del dato que viaja con él (aquí, el nombre del producto).
//    - alternar.emit(nombre()): el hijo avisa. No decide qué pasa después.
//    - marcado es un input: el hijo no guarda si es favorito o no; se lo
//      dice el padre en cada momento.
//
//  Qué observar
//    - El botón no modifica ninguna lista. Solo emite. Si el padre no escucha
//      el evento, el clic no tiene ningún efecto.
// =============================================================================

@Component({
  selector: 'app-boton-favorito',
  template: `
    <button type="button" class="fav" [class.activo]="marcado()" (click)="alternar.emit(nombre())">
      {{ marcado() ? '★ Favorito' : '☆ Marcar' }}
    </button>
  `,
  styles: `
    .fav { border: 1px solid #cbd5e1; border-radius: .5rem; padding: .2rem .7rem; font-size: .8rem; font-weight: 600; color: #475569; background: #fff; }
    .activo { border-color: #f59e0b; background: #fef3c7; color: #92400e; }
  `,
})
export class BotonFavorito {
  nombre = input.required<string>();
  marcado = input(false);

  // El nombre del evento es el que usa el padre entre paréntesis: (alternar).
  alternar = output<string>();
}
