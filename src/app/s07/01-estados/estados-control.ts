import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// =============================================================================
//  S07 · EJEMPLO 1 · Estados del control y cuándo mostrar el error
//  Diapositivas 6, 7 y 8
// -----------------------------------------------------------------------------
//  Qué muestra
//    - Un FormControl expone banderas booleanas que se leen sin código extra:
//        valid / invalid   los validadores aprueban / rechazan el valor
//        touched           el usuario entró al campo y salió de él (evento blur)
//        dirty             el usuario cambió el valor, aunque lo haya devuelto
//        pristine / untouched   lo opuesto: nada ha ocurrido todavía
//    - Un campo obligatorio vacío ya es INVALID al abrir el formulario. Si el
//      mensaje dependiera solo de invalid, el usuario vería todo en rojo antes
//      de escribir. La condición correcta es
//        invalid && (touched || dirty)
//      y espera la primera interacción.
//    - La casilla cambia entre las dos condiciones para ver la diferencia.
//
//  Qué observar
//    - Al abrir: valid=false, touched=false, dirty=false. Con la casilla marcada
//      (solo invalid) el mensaje ya aparece; sin marcar, no.
//    - Escriba una letra: dirty pasa a true. Bórrela: dirty sigue en true
//      (cambió, aunque haya vuelto a quedar vacío) y el mensaje aparece.
//    - Pulse Tab desde un campo intacto: touched pasa a true.
//
//  Qué error previene
//    - Mensajes de error visibles al abrir el formulario (diapositiva 8).
//    - Confundir dirty (cambió el valor) con touched (salió del campo).
// =============================================================================

@Component({
  selector: 'app-ejemplo-estados',
  imports: [ReactiveFormsModule, FormsModule],
  template: `
    <label class="campo">
      Nombres
      <input [formControl]="nombres" />
    </label>

    @if (mostrarError()) {
      <p class="error">Los nombres son obligatorios.</p>
    }

    <label class="opcion">
      <input type="checkbox" [(ngModel)]="soloInvalid" />
      Condición incorrecta: mostrar el error solo con <code>invalid</code>
    </label>

    <table class="estados">
      <tr><th>valid</th><td>{{ nombres.valid }}</td><th>touched</th><td>{{ nombres.touched }}</td></tr>
      <tr><th>invalid</th><td>{{ nombres.invalid }}</td><th>dirty</th><td>{{ nombres.dirty }}</td></tr>
      <tr><th>pristine</th><td>{{ nombres.pristine }}</td><th>untouched</th><td>{{ nombres.untouched }}</td></tr>
    </table>
  `,
  styles: `
    .campo { display: grid; gap: .25rem; font-size: .85rem; font-weight: 600; max-width: 22rem; }
    input:not([type]) { padding: .4rem .6rem; border: 1px solid #cbd5e1; border-radius: .4rem; }
    .error { margin-top: .4rem; font-size: .8rem; color: #b91c1c; }
    .opcion { display: block; margin-top: .8rem; font-size: .8rem; color: #475569; }
    .estados { margin-top: .8rem; font-size: .8rem; border-collapse: collapse; }
    .estados th { text-align: left; padding: .15rem .8rem .15rem 0; font-family: ui-monospace, Consolas, monospace; }
    .estados td { padding-right: 1.5rem; font-family: ui-monospace, Consolas, monospace; font-weight: 700; }
  `,
})
export class EjemploEstados {
  protected readonly nombres = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  protected readonly soloInvalid = signal(false);

  /** Con la casilla marcada se aplica la condición incorrecta, para compararla. */
  protected mostrarError(): boolean {
    return this.soloInvalid()
      ? this.nombres.invalid
      : this.nombres.invalid && (this.nombres.touched || this.nombres.dirty);
  }
}
