import { Component } from '@angular/core';
import { EjemploInput } from './01-input/ejemplo-input';
import { EjemploOutput } from './02-output/ejemplo-output';
import { EjemploModel } from './03-model/ejemplo-model';
import { EjemploDuenoEstado } from './04-dueno-estado/ejemplo-dueno-estado';
import { EjemploCicloVida } from './05-ciclo-vida/ejemplo-ciclo-vida';
import { EjemploEffect } from './05-ciclo-vida/ejemplo-effect';

// =============================================================================
//  S04 · Página de ejemplos · ruta /s04
// -----------------------------------------------------------------------------
//  Reúne los seis ejemplos de la sesión, en el orden de la presentación. Cada
//  tarjeta indica la diapositiva que la acompaña y el archivo donde está el
//  código. La explicación completa de cada ejemplo está en el comentario de
//  encabezado de su archivo y en CLASE_S04.md.
//
//  Esta misma página es un ejemplo del tema de la sesión: S04 es el padre y
//  cada ejemplo es un componente hijo que se usa por su selector.
// =============================================================================

@Component({
  selector: 'app-s04',
  imports: [EjemploInput, EjemploOutput, EjemploModel, EjemploDuenoEstado, EjemploCicloVida, EjemploEffect],
  template: `
    <h2 class="text-2xl font-bold text-slate-900">Sesión S04 · Interacción de componentes y ciclo de vida</h2>
    <p class="mt-1 text-sm text-slate-500">
      Ejemplos de la clase. Cada uno indica la diapositiva que lo acompaña y su archivo en src/app/s04/.
      Los ejemplos 5 y 6 se observan en la consola del navegador (F12).
    </p>

    <h3 class="bloque">Bloque 1 · Datos que bajan, eventos que suben</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 1 · Diapositivas 20 y 21 · 01-input/tarjeta-precio.ts y ejemplo-input.ts</p>
      <h4>input.required() e input() con valor por defecto</h4>
      <app-ejemplo-input />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 2 · Diapositivas 22 y 23 · 02-output/boton-favorito.ts y ejemplo-output.ts</p>
      <h4>output() y el padre que escucha el evento</h4>
      <app-ejemplo-output />
    </section>

    <h3 class="bloque">Bloque 2 · Dueño del estado y ciclo de vida</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 3 · Diapositiva 27 · 03-model/selector-cantidad.ts y ejemplo-model.ts</p>
      <h4>model() y el enlace en dos vías [( )]</h4>
      <app-ejemplo-model />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 4 · Diapositiva 29 · 04-dueno-estado/ejemplo-dueno-estado.ts</p>
      <h4>Una copia modificada frente a un aviso al dueño</h4>
      <app-ejemplo-dueno-estado />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 5 · Diapositiva 31 · 05-ciclo-vida/reloj-plaza.ts y ejemplo-ciclo-vida.ts</p>
      <h4>ngOnInit y ngOnDestroy: el temporizador que se detiene y el que no</h4>
      <app-ejemplo-ciclo-vida />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 6 · Diapositiva 32 · 05-ciclo-vida/ejemplo-effect.ts</p>
      <h4>effect() frente a computed()</h4>
      <app-ejemplo-effect />
    </section>
  `,
  styles: `
    .bloque { margin-top: 2rem; font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .15em; color: #b45309; }
    .tarjeta { margin-top: .9rem; border: 1px solid #e2e8f0; border-left: 4px solid #1e293b; border-radius: .75rem; background: #fff; padding: 1rem 1.2rem; }
    .meta { font-size: .7rem; font-family: ui-monospace, Consolas, monospace; color: #64748b; }
    h4 { margin: .15rem 0 .7rem; font-size: 1.05rem; font-weight: 700; color: #0f172a; }
  `,
})
export class S04 {}
