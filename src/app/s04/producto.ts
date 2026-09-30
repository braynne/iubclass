// =============================================================================
//  S04 · Tipo compartido por los ejemplos de la sesión
// -----------------------------------------------------------------------------
//  Cuando dos componentes intercambian datos, los dos necesitan conocer la
//  forma de ese dato. Por eso la interfaz vive en un archivo propio y cada
//  componente la importa: el padre para declarar la lista y el hijo para
//  declarar su input.
// =============================================================================

export interface Producto {
  nombre: string;
  precio: number;
}
