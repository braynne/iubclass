import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { minimoFilas, rangoAnios } from '../validadores';

// =============================================================================
//  S07 · EJEMPLO 4 · Estudios previos con FormArray
//  Diapositivas 19 a 22
// -----------------------------------------------------------------------------
//  Qué muestra
//    - Un FormArray es una lista de controles de tamaño variable. Cuando cada
//      elemento es un FormGroup, cada fila tiene sus controles y sus
//      validadores. La tabla es el FormArray; cada fila es un FormGroup.
//    - nuevoEstudio() crea una fila y se usa para la fila inicial y para cada
//      fila nueva. La fila lleva su propio validador de grupo, rangoAnios.
//    - La plantilla necesita DOS enlaces anidados:
//        <div formArrayName="estudios">            el arreglo dentro del grupo
//          <div [formGroupName]="i">               la fila, con su índice
//    - agregar() y quitar() usan push y removeAt, métodos del FormArray, que
//      modifica su lista internamente. La regla de no mutar de la S05 aplica a
//      las signals del servicio, no al FormArray.
//    - minimoFilas(1) exige al menos una fila. Validators.minLength(1) no sirve:
//      una lista vacía es un valor vacío y minLength no evalúa los vacíos.
//    - Los botones de la fila llevan type="button": dentro de un form el botón
//      es submit por defecto y enviaría el formulario al agregar o quitar.
//
//  Qué observar
//    - Quite todas las filas: aparece «Registre al menos un estudio» y el
//      formulario es inválido. Agregue una: vuelve a ser válido.
//    - Año de inicio 2020 y fin 2019: error de grupo en esa fila. Fin 2020
//      (igualdad): válido. El error pertenece a la fila, no al campo.
//    - Pulse «Enviar» con filas vacías: los mensajes de todas las filas aparecen
//      a la vez (markAllAsTouched alcanza los controles de las filas).
//
//  Qué error previene
//    - Omitir formArrayName: «Cannot find control with name: '0'».
//    - Omitir [formGroupName]="i": «Cannot find control with path:
//      'estudios -> institucion'».
//    - Botones sin type="button" que envían el formulario.
//    - Aceptar una lista vacía por no tener validador sobre el arreglo.
// =============================================================================

@Component({
  selector: 'app-ejemplo-formarray',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
      <div formArrayName="estudios">
        @for (fila of estudios.controls; track fila; let i = $index) {
          <div class="fila" [formGroupName]="i">
            <label>Institución <input formControlName="institucion" /></label>
            <label>Título <input formControlName="titulo" /></label>
            <label>Año de inicio <input type="number" formControlName="anioInicio" /></label>
            <label>Año de fin <input type="number" formControlName="anioFin" /></label>
            <button type="button" (click)="quitar(i)">Quitar</button>
            @if (fila.hasError('rangoAnios')) {
              <p class="error">El año de fin no puede ser anterior al de inicio.</p>
            }
            @if (fila.controls.institucion.invalid && fila.controls.institucion.touched) {
              <p class="error">La institución es obligatoria.</p>
            }
          </div>
        }
      </div>

      @if (estudios.hasError('minimoFilas')) {
        <p class="error">Registre al menos un estudio.</p>
      }

      <button type="button" (click)="agregar()">Agregar estudio</button>
      <button type="submit">Enviar</button>
    </form>

    <p class="estado">filas: <b>{{ estudios.length }}</b> · form.status: <b>{{ form.status }}</b></p>
    @if (resultado(); as r) { <pre class="salida">{{ r | json }}</pre> }
  `,
  styles: `
    .fila { display: grid; grid-template-columns: repeat(4, 1fr) auto; gap: .5rem; align-items: end; margin-top: .6rem;
            padding: .6rem; border: 1px solid #e2e8f0; border-radius: .5rem; font-size: .8rem; font-weight: 600; }
    label { display: grid; gap: .2rem; }
    input { padding: .35rem .5rem; border: 1px solid #cbd5e1; border-radius: .4rem; }
    .error { grid-column: 1 / -1; font-size: .8rem; color: #b91c1c; font-weight: 400; }
    button { margin: .8rem .5rem 0 0; padding: .4rem .9rem; border-radius: .4rem; background: #1e293b; color: #fff; font-weight: 700; }
    .fila button { margin: 0; background: #e2e8f0; color: #1e293b; }
    .estado { margin-top: .9rem; font-size: .75rem; font-family: ui-monospace, Consolas, monospace; color: #64748b; }
    .salida { margin-top: .6rem; padding: .7rem; border-radius: .5rem; background: #f1f5f9; font-size: .75rem; }
  `,
})
export class EjemploFormArray {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly form = this.fb.group({
    estudios: this.fb.array([this.nuevoEstudio()], [minimoFilas(1)]),
  });

  protected readonly estudios = this.form.controls.estudios;
  protected readonly resultado = signal<unknown>(null);

  private nuevoEstudio() {
    return this.fb.group(
      {
        institucion: ['', Validators.required],
        titulo: ['', Validators.required],
        anioInicio: this.fb.control<number | null>(null, [Validators.required, Validators.min(1990)]),
        anioFin: this.fb.control<number | null>(null, [Validators.required, Validators.min(1990)]),
      },
      { validators: [rangoAnios] },
    );
  }

  protected agregar() {
    this.estudios.push(this.nuevoEstudio());
  }

  protected quitar(i: number) {
    this.estudios.removeAt(i);
  }

  protected guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.resultado.set(this.form.getRawValue());
  }
}
