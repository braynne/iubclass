/* =============================================================================
   COM30 · S07 · EJEMPLOS DE LA CLASE · VERSIÓN PARA STACKBLITZ (un solo archivo)
   -----------------------------------------------------------------------------
   Es el mismo código de src/app/s07/, reunido en un archivo. Cada bloque indica
   el archivo original; la explicación de cada ejemplo está en su comentario de
   encabezado y en CLASE_S07.md.

   En Angular CLI cada componente va en su propio archivo y se importa con
   import { ... } from './...'. Aquí todos comparten archivo, así que esas
   líneas de import no aparecen: cada clase ya es visible para las demás.

   Uso
     1. En StackBlitz, abra src/main.ts.
     2. Haga clic dentro del editor, seleccione todo (Ctrl+A) y pegue encima.
        Se reemplaza el contenido del archivo; el archivo no se elimina.
     3. Para los estilos de Tailwind, agregue en src/index.html, dentro de <head>:
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
   ========================================================================== */

import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule,
  ValidationErrors, ValidatorFn, Validators,
} from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s07/validadores.ts
// =============================================================================
// =============================================================================
//  S07 · Validadores propios reutilizados por los ejemplos 3 y 4
//  Diapositivas 12, 14 y 21
// -----------------------------------------------------------------------------
//  Un validador es una función: recibe un control y devuelve
//    - null                      si el valor es válido,
//    - { clave: ... }            si no lo es. La clave es el nombre con el que la
//                                plantilla pregunta: hasError('clave').
//  Las claves distinguen mayúsculas: soloEspacios y soloespacios son distintas.
//
//  Tres validadores, tres niveles
//    sinSoloEspacios()   de CONTROL. Validators.required acepta '   ' (solo
//                        rechaza '', null y listas vacías); esta regla sobre el
//                        contenido del texto es un validador propio. Es una
//                        función que devuelve la función: así recibe parámetros.
//    correosCoinciden    de GRUPO. Recibe el grupo, lee dos controles con get() y
//                        compara. Su error queda en el GRUPO, no en un control.
//    rangoAnios          de GRUPO, aplicado a cada fila de un FormArray.
//    minimoFilas(n)      de ARREGLO. Validators.minLength(1) no sirve: una lista
//                        vacía es un valor vacío y minLength no evalúa los vacíos.
//
//  Qué error previene cada condición `a && b`
//    Un validador de grupo se ejecuta con el formulario recién creado, con los
//    campos vacíos. Sin comprobar que existan los dos valores, el error aparece
//    al abrir el formulario.
// =============================================================================

/** Control: rechaza una cadena formada solo por espacios (required la acepta). */
function sinSoloEspacios(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null =>
    typeof c.value === 'string' && c.value !== '' && c.value.trim() === ''
      ? { soloEspacios: true }
      : null;
}

/** Grupo: los dos correos deben ser iguales. Con un campo vacío no compara. */
const correosCoinciden: ValidatorFn = (g: AbstractControl): ValidationErrors | null => {
  const a = g.get('correo')?.value;
  const b = g.get('confirmarCorreo')?.value;
  return a && b && a !== b ? { correosNoCoinciden: true } : null;
};

/** Grupo: el año de fin no puede ser anterior al de inicio. Igualdad es válida. */
const rangoAnios: ValidatorFn = (g: AbstractControl): ValidationErrors | null => {
  const inicio = g.get('anioInicio')?.value;
  const fin = g.get('anioFin')?.value;
  return inicio != null && fin != null && fin < inicio ? { rangoAnios: true } : null;
};

/** Arreglo: exige al menos n filas. */
function minimoFilas(n: number): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null =>
    (c as FormArray).length >= n ? null : { minimoFilas: { requerido: n } };
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s07/01-estados/estados-control.ts
// =============================================================================
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
class EjemploEstados {
  protected readonly nombres = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  protected readonly soloInvalid = signal(false);

  /** Con la casilla marcada se aplica la condición incorrecta, para compararla. */
  protected mostrarError(): boolean {
    return this.soloInvalid()
      ? this.nombres.invalid
      : this.nombres.invalid && (this.nombres.touched || this.nombres.dirty);
  }
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s07/02-validadores/ejemplo-integrados.ts
// =============================================================================
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
class EjemploIntegrados {
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

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s07/03-propio-grupo/ejemplo-propio-grupo.ts
// =============================================================================
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
class EjemploPropioGrupo {
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

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s07/04-formarray/ejemplo-formarray.ts
// =============================================================================
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
class EjemploFormArray {
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

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s07/s07.ts
// =============================================================================
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
class S07 {}

// =============================================================================
// ARRANQUE (en Angular CLI esto está en main.ts, app.ts y app.config.ts)
// =============================================================================
@Component({ selector: 'app-root', imports: [S07], template: `<main style="max-width:64rem;margin:auto;padding:1.5rem"><app-s07 /></main>` })
class App {}

bootstrapApplication(App);
