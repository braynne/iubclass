import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// =============================================================================
//  S07 · EJEMPLO 2 · Validadores integrados y un mensaje por tipo de error
//  Diapositivas 10 y 11
// -----------------------------------------------------------------------------
//  Qué muestra
//    - Los validadores integrados de la clase, en el segundo elemento de cada
//      control y combinados en un arreglo:
//        required            falla con '', null o lista vacía        clave required
//        minLength(n)        menos de n caracteres                   clave minlength
//        min(n) / max(n)     número menor / mayor                    claves min / max
//        email               sin forma de correo                     clave email
//        pattern(regex)      no cumple la expresión                  clave pattern
//    - El validador se escribe minLength (camelCase); su CLAVE de error es
//      minlength, todo en minúscula.
//    - hasError('clave') responde si esa clave está presente; getError('clave')
//      devuelve el objeto del error, con datos como requiredLength.
//    - Un campo vacío solo tiene la clave required: minLength, min, max y
//      pattern no evalúan valores vacíos. Por eso required se combina con ellos.
//    - El panel «errors» muestra el objeto real de cada control.
//
//  Qué observar
//    - Nombres vacío: errors = { required: true }. Escriba «A»: errors =
//      { minlength: { requiredLength: 2, actualLength: 1 } }.
//    - Nombres «Ana1»: errors = { pattern: ... }. Documento «123»: pattern.
//    - Semestre 0 o 11: claves min y max.
//
//  Qué error previene
//    - Escribir hasError('minLength') (mayúscula): nunca es verdadero.
//    - Esperar la clave minlength en un campo vacío: solo existe required.
// =============================================================================

@Component({
  selector: 'app-ejemplo-integrados',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" novalidate>
      @let n = form.controls.nombres;
      <label class="campo">Nombres <input formControlName="nombres" /></label>
      @if (mostrar(n)) {
        @if (n.hasError('required')) { <p class="error">Los nombres son obligatorios.</p> }
        @else if (n.hasError('minlength')) {
          <p class="error">Mínimo {{ n.getError('minlength').requiredLength }} caracteres.</p>
        }
        @else if (n.hasError('pattern')) { <p class="error">Solo letras y espacios.</p> }
      }
      <p class="errors">errors: {{ n.errors | json }}</p>

      @let d = form.controls.documento;
      <label class="campo">Documento <input formControlName="documento" inputmode="numeric" /></label>
      @if (mostrar(d)) {
        @if (d.hasError('required')) { <p class="error">El documento es obligatorio.</p> }
        @else if (d.hasError('pattern')) { <p class="error">Entre 6 y 10 dígitos, sin puntos.</p> }
      }
      <p class="errors">errors: {{ d.errors | json }}</p>

      @let s = form.controls.semestre;
      <label class="campo">Semestre <input type="number" formControlName="semestre" /></label>
      @if (mostrar(s)) {
        @if (s.hasError('required')) { <p class="error">El semestre es obligatorio.</p> }
        @else if (s.hasError('min') || s.hasError('max')) { <p class="error">Entre 1 y 10.</p> }
      }
      <p class="errors">errors: {{ s.errors | json }}</p>

      @let c = form.controls.correo;
      <label class="campo">Correo <input type="email" formControlName="correo" /></label>
      @if (mostrar(c)) {
        @if (c.hasError('required')) { <p class="error">El correo es obligatorio.</p> }
        @else if (c.hasError('email')) { <p class="error">Formato de correo no válido.</p> }
      }
      <p class="errors">errors: {{ c.errors | json }}</p>
    </form>
  `,
  styles: `
    .campo { display: grid; gap: .25rem; margin-top: .7rem; font-size: .85rem; font-weight: 600; max-width: 22rem; }
    input { padding: .4rem .6rem; border: 1px solid #cbd5e1; border-radius: .4rem; }
    .error { margin-top: .25rem; font-size: .8rem; color: #b91c1c; }
    .errors { margin-top: .2rem; font-size: .72rem; font-family: ui-monospace, Consolas, monospace; color: #64748b; }
  `,
})
export class EjemploIntegrados {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly form = this.fb.group({
    nombres: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/)]],
    documento: ['', [Validators.required, Validators.pattern(/^\d{6,10}$/)]],
    semestre: this.fb.control<number | null>(null, [Validators.required, Validators.min(1), Validators.max(10)]),
    correo: ['', [Validators.required, Validators.email]],
  });

  /** El mensaje espera la primera interacción: invalid junto con touched o dirty. */
  protected mostrar(c: AbstractControl): boolean {
    return c.invalid && (c.touched || c.dirty);
  }
}
