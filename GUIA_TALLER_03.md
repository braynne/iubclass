# COM30 · Guía de trabajo del Taller 03

**Pedido con componentes que se comunican · cierre: miércoles 7 de octubre de 2026, 16:59**

Esta guía ordena el trabajo e indica, para cada requisito, qué ejemplo de la clase contiene la
técnica y **qué cambia en el taller**. Los ejemplos de `src/app/s04/` usan otros datos y otros
criterios a propósito: muestran cómo se hace, no el resultado del taller. El enunciado oficial,
con los datos de prueba y la rúbrica, es `COM30_S04_taller03.docx`, en el aula.

---

## Antes de empezar

1. **Actualice su fork.** En la página de su fork en GitHub: **Sync fork → Update branch**. Si
   ya lo clonó, ejecute `git pull` dentro de la carpeta del proyecto.
2. **Con Angular CLI:** cree la carpeta `src/app/taller03/` con un archivo por componente
   (`pedido.ts`, `tarjeta-producto.ts`, `resumen-pedido.ts`) y agregue la ruta `/taller03` en
   `app.routes.ts`, igual que la ruta `/s04`. Puede generar cada componente con
   `npx ng generate component taller03/tarjeta-producto --flat --skip-tests`.
   **En StackBlitz:** los tres componentes van en `src/main.ts` y `Pedido` usa el selector
   `app-root`.
3. No modifique los ejemplos de `src/app/s04/`: son la referencia de consulta.
4. Tenga a mano la **tabla 2 del enunciado** (secuencia de prueba). Cada paso termina con una
   comprobación contra ella.

---

## Orden de trabajo

Haga `commit` al terminar cada paso que funcione.

### Paso 1 · El contrato, en papel · R1

| | |
|---|---|
| **Redacte** | En la tabla del contrato del enunciado: qué recibe cada hijo (input), qué avisa (output) y qué estado guarda el padre. |
| **Consulte** | Diapositivas 18, 19 y 28. |
| **Qué cambia en el taller** | Son dos hijos distintos, y uno de ellos (el resumen) recibe una lista completa, no un solo producto. |
| **Compruebe** | Ningún hijo aparece como dueño del pedido. |

### Paso 2 · La tarjeta · R2

| | |
|---|---|
| **Construya** | `TarjetaProducto` con el input obligatorio del producto y el input opcional de unidades en el pedido. |
| **Consulte** | Ejemplo 1 (`tarjeta-precio.ts`). |
| **Qué cambia en el taller** | Las unidades disponibles se derivan de dos inputs, no de uno. |
| **Compruebe** | Con el pedido vacío, cada tarjeta muestra todas sus existencias como disponibles. |
| **Error típico** | `NG8008` si el padre no pasa el input obligatorio. |

### Paso 3 · El aviso de la tarjeta · R3

| | |
|---|---|
| **Construya** | El output que avisa al padre qué producto se agregó, y el botón deshabilitado cuando no quedan unidades. |
| **Consulte** | Ejemplo 2 (`boton-favorito.ts`) y ejemplo 4, panel derecho. |
| **Qué cambia en el taller** | El botón se deshabilita según un valor derivado. |
| **Compruebe** | Paso P2 de la tabla 2: tras tres clics, el botón del mango queda deshabilitado. |
| **Error típico** | Modificar el producto dentro de la tarjeta (ejemplo 4, panel izquierdo). Es descuento. |

### Paso 4 · El padre, dueño del pedido · R4

| | |
|---|---|
| **Construya** | La signal del pedido y los métodos que responden a los dos outputs, con `update()` y un arreglo nuevo. |
| **Consulte** | Ejemplo 2 (`alternarFavorito`) y ejemplo 4 (`subirPrecio`). |
| **Qué cambia en el taller** | Agregar suma una unidad a una línea existente o crea una línea nueva; quitar elimina la línea completa. |
| **Compruebe** | Pasos P2 a P6 de la tabla 2. |
| **Error típico** | `push`, `splice` o `++` sobre el arreglo de la signal. Es descuento. |

### Paso 5 · El resumen · R5

| | |
|---|---|
| **Construya** | `ResumenPedido` con el input de las líneas, el output para quitar, el `@for` con `@empty` y los tres valores calculados. |
| **Consulte** | Ejemplo 1 (`esCaro`, un `computed` sobre un input) y los ejemplos de `@for` y `@empty` de la S03. |
| **Qué cambia en el taller** | El domicilio tiene tres casos. El caso de exactamente $ 20.000 es el que suele fallar. |
| **Compruebe** | Pasos P1, P4, P5 y P7 de la tabla 2. En P5 el domicilio debe decir «Gratis». |

---

## Antes de entregar

- Recorra la tabla 2 completa, desde el paso P1, sin recargar la página entre pasos.
- `npx ng build` debe terminar sin errores.
- `git push` y verifique en una ventana privada que el enlace del fork abre.
