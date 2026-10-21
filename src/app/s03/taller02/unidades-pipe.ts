import { Pipe, PipeTransform } from '@angular/core';

// =============================================================================
//  COM30 · Taller 02 · R5 · Pipe propio: unidades
// -----------------------------------------------------------------------------
//  transform recibe la cantidad de existencias del producto y devuelve el texto
//  que se muestra en la columna «Existencias». El estado sigue guardando un
//  número; el pipe solo decide cómo se lee:
//
//      0   ->  sin existencias
//      1   ->  1 unidad
//      n   ->  n unidades
//
//  Se agrega a imports del componente que lo usa (Angular 19+).
// =============================================================================

@Pipe({ name: 'unidades' })
export class UnidadesPipe implements PipeTransform {
  transform(cantidad: number): string {
    if (cantidad === 0) return 'sin existencias';
    if (cantidad === 1) return '1 unidad';
    return `${cantidad} unidades`;
  }
}
