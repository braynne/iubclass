import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { correosCoinciden, sinSoloEspacios } from '../validadores';

// =============================================================================
//  S07 · EJEMPLO 3 · Validador propio, validador de grupo y envío del formulario
//  Diapositivas 12 a 16
// -----------------------------------------------------------------------------
//  Qué muestra
//    - sinSoloEspacios() en «nombres»: Validators.required acepta '   ' (tres
//      espacios); el validador propio la rechaza con la clave soloEspacios.
//    - correosCoinciden en el GRUPO «contacto»: se asigna en el segundo argumento
//      de group(), dentro de { validators: [...] }. Su error queda en
//      contacto.errors, NO en un control; por eso la plantilla pregunta
//      contacto.hasError('correosNoCoinciden').
//    - El mensaje de grupo espera a que el segundo campo esté tocado: mientras se
//      escribe el primer correo, el segundo está vacío y no hay nada que comparar.
//    - guardar() usa markAllAsTouched(): el botón queda habilitado y, al pulsarlo
//      con errores, todos los mensajes aparecen a la vez. La alternativa es
//      [disabled]="form.invalid", donde el usuario no ve qué falta.
//    - getRawValue() entrega los datos y reset() devuelve el formulario a sus
//      valores iniciales.
//
//  Qué observar
//    - Escriba tres espacios en «nombres»: el formulario sigue sin ser válido y
//      el mensaje es «No puede estar formado solo por espacios».
//    - Correo «ana@iub.edu.co» y confirmación «Ana@iub.edu.co»: no coinciden
//      (distingue mayúsculas); iguales: el error desaparece.
//    - Con todo vacío pulse «Enviar»: aparecen todos los mensajes a la vez.
//
//  Qué error previene
//    - Confiar en required para detectar espacios.
//    - Consultar el error de grupo en un control en lugar del grupo.
//    - Un validador de grupo sin comprobar que existan los dos valores: el
//      error aparecería al abrir el formulario.
// =============================================================================

@Component({
  selector: 'app-ejemplo-propio-grupo',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
      @let n = form.controls.nombres;
      <label class="campo">Nombres <input formControlName="nombres" /></label>
      @if (mostrar(n)) {
        @if (n.hasError('required')) { <p class="error">Los nombres son obligatorios.</p> }
        @else if (n.hasError('soloEspacios')) { <p class="error">No puede estar formado solo por espacios.</p> }
      }

      <fieldset formGroupName="contacto">
        <legend>Contacto</legend>
        @let correo = contacto.controls.correo;
        <label class="campo">Correo <input type="email" formControlName="correo" /></label>
        @if (mostrar(correo)) {
          @if (correo.hasError('required')) { <p class="error">El correo es obligatorio.</p> }
          @else if (correo.hasError('email')) { <p class="error">Formato de correo no válido.</p> }
        }

        @let confirmar = contacto.controls.confirmarCorreo;
        <label class="campo">Confirmar correo <input type="email" formControlName="confirmarCorreo" /></label>
        @if (mostrar(confirmar) && confirmar.hasError('required')) { <p class="error">Confirme el correo.</p> }
        @if (contacto.hasError('correosNoCoinciden') && confirmar.touched) {
          <p class="error">Los dos correos deben coincidir.</p>
        }
      </fieldset>

      <button type="submit">Enviar</button>
      <button type="button" (click)="limpiar()">Limpiar</button>
    </form>

    <p class="estado">form.status: <b>{{ form.status }}</b> · contacto.errors: {{ contacto.errors | json }}</p>
    @if (resultado(); as r) { <pre class="salida">{{ r | json }}</pre> }
  `,
  styles: `
    .campo { display: grid; gap: .25rem; margin-top: .7rem; font-size: .85rem; font-weight: 600; max-width: 22rem; }
    input { padding: .4rem .6rem; border: 1px solid #cbd5e1; border-radius: .4rem; }
    fieldset { margin-top: .9rem; border: 1px solid #e2e8f0; border-radius: .5rem; padding: .3rem .9rem .8rem; }
    legend { padding: 0 .4rem; font-size: .75rem; font-weight: 800; text-transform: uppercase; color: #64748b; }
    .error { margin-top: .25rem; font-size: .8rem; color: #b91c1c; }
    button { margin: 1rem .5rem 0 0; padding: .45rem 1rem; border-radius: .4rem; background: #1e293b; color: #fff; font-weight: 700; }
    button[type=button] { background: #e2e8f0; color: #1e293b; }
    .estado { margin-top: .9rem; font-size: .75rem; font-family: ui-monospace, Consolas, monospace; color: #64748b; }
    .salida { margin-top: .6rem; padding: .7rem; border-radius: .5rem; background: #f1f5f9; font-size: .75rem; }
  `,
})
export class EjemploPropioGrupo {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly form = this.fb.group({
    nombres: ['', [Validators.required, sinSoloEspacios()]],
    contacto: this.fb.group(
      {
        correo: ['', [Validators.required, Validators.email]],
        confirmarCorreo: ['', Validators.required],
      },
      { validators: [correosCoinciden] },
    ),
  });

  protected readonly contacto = this.form.controls.contacto;
  protected readonly resultado = signal<unknown>(null);

  protected mostrar(c: AbstractControl): boolean {
    return c.invalid && (c.touched || c.dirty);
  }

  protected guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.resultado.set(this.form.getRawValue());
    this.form.reset();
  }

  protected limpiar() {
    this.form.reset();
    this.resultado.set(null);
  }
}
