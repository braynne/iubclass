# COM30 · S07 · Ejemplos de la sesión

**Sesión S07 · miércoles 28 de octubre de 2026 · Validación de formularios y formularios dinámicos**

El código de la sesión está en `src/app/s07/` y se ve en la ruta **`/s07`** de la aplicación
(pestaña «S07 · Ejemplos»). Cada ejemplo corresponde a diapositivas de `COM30_S07_sesion.pdf`, en el
aula. La explicación completa está en el comentario de encabezado de cada archivo.

Quien trabaja en StackBlitz tiene los ejemplos en un solo archivo: `_para-stackblitz/s07-main.ts`.

Los ejemplos usan una **ficha académica personal** (nombres, correo, estudios previos). El Taller 06
usa otros escenarios a propósito: aquí se consulta la técnica, no la solución.

---

## Antes de empezar

1. En su fork en GitHub: **Sync fork → Update branch**. Luego, en la carpeta del proyecto,
   `git pull`.
2. En los equipos de la sala, Node.js no está en el PATH: `.\entorno-sala.cmd` en cmd, o las
   tareas *COM30* de VS Code (ver `CLASE_S04.md`). La terminal de VS Code ya lo trae configurado.
3. `npm install` (no hay dependencias nuevas) y `npx ng serve`.

---

## Mapa de la sesión

| # | Diapositiva | Archivo | Concepto |
|---|---|---|---|
| 1 | 6 a 8 | `01-estados/estados-control.ts` | `valid`, `invalid`, `touched`, `dirty`; condición `invalid && (touched \|\| dirty)` |
| 2 | 10 y 11 | `02-validadores/ejemplo-integrados.ts` | `required`, `minLength`, `min`, `max`, `email`, `pattern`; `hasError` y `getError` |
| 3 | 12 a 16 | `03-propio-grupo/ejemplo-propio-grupo.ts` · `validadores.ts` | `sinSoloEspacios`, `correosCoinciden`, `markAllAsTouched`, `getRawValue`, `reset` |
| 4 | 19 a 22 | `04-formarray/ejemplo-formarray.ts` · `validadores.ts` | `FormArray`, `formArrayName`, `[formGroupName]`, `push`, `removeAt`, `minimoFilas` |

---

## Ejemplo 1 · Estados del control

- **Qué hacer:** abrir el ejemplo; escribir una letra y borrarla; pulsar Tab desde un campo intacto;
  marcar la casilla de la condición incorrecta.
- **Qué observar:** al abrir, `valid=false`, `touched=false`, `dirty=false`. Al escribir y borrar,
  `dirty` sigue en `true`. Con la casilla marcada el mensaje aparece antes de escribir.
- **Qué error previene:** mensajes de error visibles al abrir el formulario.

## Ejemplo 2 · Validadores integrados

- **Qué hacer:** escribir «A» en nombres; «Ana1»; documento «123»; semestre 0 y 11.
- **Qué observar:** el panel `errors` muestra el objeto real: `{ required: true }` con el campo vacío,
  `{ minlength: { requiredLength: 2, actualLength: 1 } }` con una letra.
- **Qué error previene:** escribir `hasError('minLength')` en lugar de `'minlength'`, o esperar la
  clave `minlength` en un campo vacío (solo existe `required`).

## Ejemplo 3 · Validador propio y de grupo

- **Qué hacer:** escribir tres espacios en nombres; correo `ana@iub.edu.co` y confirmación
  `Ana@iub.edu.co`; con todo vacío, pulsar «Enviar».
- **Qué observar:** `required` acepta los tres espacios y `sinSoloEspacios` los rechaza. El error de
  los correos queda en `contacto.errors`, no en un campo. «Enviar» con errores muestra todos los
  mensajes a la vez.
- **Qué error previene:** confiar en `required` para detectar espacios; consultar el error de grupo
  en un control.

## Ejemplo 4 · FormArray

- **Qué hacer:** quitar todas las filas y volver a agregar una; año de inicio 2020 y fin 2019; fin
  2020; «Enviar» con las filas vacías.
- **Qué observar:** sin filas aparece «Registre al menos un estudio». El error de años es de la fila
  (con igualdad es válido). «Enviar» muestra los errores de todas las filas.
- **Qué error previene:** omitir `formArrayName` (`Cannot find control with name: '0'`) u omitir
  `[formGroupName]="i"` (`Cannot find control with path: 'estudios -> institucion'`); botones sin
  `type="button"`.

---

## Qué se evalúa

Estos ejemplos no se evalúan. La evidencia calificable de la sesión es el **Taller 06**
(`COM30_S07_taller06.docx`, en el aula): guía de trabajo en `GUIA_TALLER_06.md`.
