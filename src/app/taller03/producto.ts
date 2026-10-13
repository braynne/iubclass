// =============================================================================
//  TALLER 03 · Tipos compartidos por el padre y los dos hijos
// -----------------------------------------------------------------------------
//  Producto: lo que ofrece el catálogo y que TarjetaProducto muestra.
//  Linea: una fila del pedido (producto + cantidad). El padre la crea y el
//  resumen la muestra. Los dos necesitan conocer su forma.
// =============================================================================

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

export interface Linea {
  nombre: string;
  precio: number;
  cantidad: number;
}
