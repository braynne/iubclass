import { Component, OnDestroy, OnInit, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

// =============================================================================
//  S04 · EJEMPLO 5a · ngOnInit y ngOnDestroy
//  Diapositiva 31
// -----------------------------------------------------------------------------
//  Qué muestra
//    - ngOnInit se ejecuta una vez, cuando Angular ya asignó los inputs. Es el
//      lugar para arrancar un temporizador. En el constructor, los inputs
//      todavía no tienen valor.
//    - ngOnDestroy se ejecuta una vez, justo antes de que el componente salga
//      del DOM. Es el lugar para detener lo que ngOnInit arrancó.
//    - limpiar es un input que existe solo para la demostración: con
//      limpiar = false, el componente omite clearInterval.
//
//  Qué observar (con F12 > Consola abierta)
//    - Mostrar el reloj: aparece «ngOnInit» y un «tic» por segundo.
//    - Ocultarlo: aparece «ngOnDestroy» y los tics se detienen.
//    - Con el reloj sin limpieza, los tics siguen después de ocultarlo: el
//      componente ya no existe, pero el temporizador sí. Es una fuga. Se
//      detiene recargando la página.
//
//  Forma equivalente, sin implementar OnDestroy:
//      private destroyRef = inject(DestroyRef);
//      ...
//      this.destroyRef.onDestroy(() => clearInterval(this.id));
// =============================================================================

@Component({
  selector: 'app-reloj-plaza',
  imports: [DatePipe],
  template: `
    <p class="reloj">Hora en la plaza: {{ hora() | date: 'HH:mm:ss' }}</p>
  `,
  styles: `
    .reloj { display: inline-block; border-radius: .5rem; background: #0f172a; color: #fbbf24; padding: .3rem .8rem; font-family: ui-monospace, Consolas, monospace; font-weight: 700; }
  `,
})
export class RelojPlaza implements OnInit, OnDestroy {
  etiqueta = input('reloj');
  limpiar = input(true);

  hora = signal(new Date());
  private id?: ReturnType<typeof setInterval>;
  private tics = 0;

  ngOnInit() {
    console.log(`[${this.etiqueta()}] ngOnInit: arranca el temporizador`);
    this.id = setInterval(() => {
      this.tics++;
      this.hora.set(new Date());
      console.log(`[${this.etiqueta()}] tic ${this.tics}`);
    }, 1000);
  }

  ngOnDestroy() {
    console.log(`[${this.etiqueta()}] ngOnDestroy`);
    if (this.limpiar()) {
      clearInterval(this.id);
    }
  }
}
