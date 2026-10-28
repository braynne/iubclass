import { Component } from '@angular/core';
import { EjemploEstados } from './01-estados/estados-control';
import { EjemploIntegrados } from './02-validadores/ejemplo-integrados';
import { EjemploPropioGrupo } from './03-propio-grupo/ejemplo-propio-grupo';
import { EjemploFormArray } from './04-formarray/ejemplo-formarray';

// =============================================================================
//  S07 · Página de ejemplos · ruta /s07
// -----------------------------------------------------------------------------
//  Reúne los cuatro ejemplos de la sesión, en el orden de la presentación.
//  Cada tarjeta indica la diapositiva que la acompaña y el archivo del código.
//  La explicación completa está en el encabezado de cada archivo y en
//  CLASE_S07.md. Los ejemplos son una ficha académica personal; el Taller 06 usa
//  otros escenarios a propósito.
// =============================================================================

@Component({
  selector: 'app-s07',
  imports: [EjemploEstados, EjemploIntegrados, EjemploPropioGrupo, EjemploFormArray],
  template: `
    <h2 class="text-2xl font-bold text-slate-900">Sesión S07 · Validación de formularios y formularios dinámicos</h2>
    <p class="mt-1 text-sm text-slate-500">
      Ejemplos de la sesión. Cada uno indica la diapositiva que lo acompaña y su archivo en src/app/s07/.
    </p>

    <h3 class="bloque">Bloque 1 · Estados del control</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 1 · Diapositivas 6 a 8 · 01-estados/estados-control.ts</p>
      <h4>valid, touched y dirty: cuándo mostrar el mensaje de error</h4>
      <app-ejemplo-estados />
    </section>

    <h3 class="bloque">Bloque 2 · Validadores</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 2 · Diapositivas 10 y 11 · 02-validadores/ejemplo-integrados.ts</p>
      <h4>Validadores integrados y un mensaje por tipo de error</h4>
      <app-ejemplo-integrados />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 3 · Diapositivas 12 a 16 · 03-propio-grupo/ejemplo-propio-grupo.ts y validadores.ts</p>
      <h4>Validador propio, validador de grupo y envío con markAllAsTouched</h4>
      <app-ejemplo-propio-grupo />
    </section>

    <h3 class="bloque">Bloque 3 · Listas dinámicas</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 4 · Diapositivas 19 a 22 · 04-formarray/ejemplo-formarray.ts</p>
      <h4>FormArray: estudios previos que se agregan y se quitan</h4>
      <app-ejemplo-formarray />
    </section>
  `,
  styles: `
    .bloque { margin-top: 2rem; font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .15em; color: #b45309; }
    .tarjeta { margin-top: .9rem; border: 1px solid #e2e8f0; border-left: 4px solid #1e293b; border-radius: .75rem; background: #fff; padding: 1rem 1.2rem; }
    .meta { font-size: .7rem; font-family: ui-monospace, Consolas, monospace; color: #64748b; }
    h4 { margin: .15rem 0 .7rem; font-size: 1.05rem; font-weight: 700; color: #0f172a; }
  `,
})
export class S07 {}
