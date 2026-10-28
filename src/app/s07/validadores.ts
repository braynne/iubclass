import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

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
export function sinSoloEspacios(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null =>
    typeof c.value === 'string' && c.value !== '' && c.value.trim() === ''
      ? { soloEspacios: true }
      : null;
}

/** Grupo: los dos correos deben ser iguales. Con un campo vacío no compara. */
export const correosCoinciden: ValidatorFn = (g: AbstractControl): ValidationErrors | null => {
  const a = g.get('correo')?.value;
  const b = g.get('confirmarCorreo')?.value;
  return a && b && a !== b ? { correosNoCoinciden: true } : null;
};

/** Grupo: el año de fin no puede ser anterior al de inicio. Igualdad es válida. */
export const rangoAnios: ValidatorFn = (g: AbstractControl): ValidationErrors | null => {
  const inicio = g.get('anioInicio')?.value;
  const fin = g.get('anioFin')?.value;
  return inicio != null && fin != null && fin < inicio ? { rangoAnios: true } : null;
};

/** Arreglo: exige al menos n filas. */
export function minimoFilas(n: number): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null =>
    (c as FormArray).length >= n ? null : { minimoFilas: { requerido: n } };
}
