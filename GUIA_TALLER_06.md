# COM30 · Guía de trabajo del Taller 06

**Aplicación de gestión con formularios reactivos · avance: miércoles 28 de octubre de 2026, 22:00 ·
entrega final: martes 3 de noviembre de 2026, 23:59**

Esta guía ordena el trabajo e indica, para cada requisito, qué ejemplo de las sesiones S05, S06 y S07
contiene la técnica y **qué cambia en el taller**. Los ejemplos usan otro dominio (ficha académica,
favoritos, precios del día) a propósito: la técnica se consulta, la solución se diseña. El enunciado
oficial, con los escenarios, la tabla de casos de prueba y la rúbrica, es `COM30_S07_taller06.docx`,
en el aula.

---

## Antes de empezar

1. **Proyecto nuevo y propio.** No se trabaja sobre el fork de la clase.
   - **Visual Studio Code con Angular CLI.** Abra VS Code, abra la terminal integrada (ya trae Node
     configurado) y ejecute en la carpeta donde guardará el proyecto:
     `npx @angular/cli@22 new com30-taller06-apellido --style=css --ssr=false`. Entre a la carpeta
     (`cd com30-taller06-apellido`), abra esa carpeta en VS Code y ejecute `npx ng serve`.
   - **StackBlitz.** Cree un proyecto Angular nuevo. Todo el código va en `src/main.ts`.
2. **Repositorio público** `com30-taller06-apellido` en GitHub. Con VS Code: cree el repositorio
   vacío en github.com y, en la terminal, `git remote add origin <url>`, `git branch -M main` y
   `git push -u origin main`. Con StackBlitz: panel *Connect repository* y *Publish*.
3. **Escenario** de la tabla 1 del enunciado (E1 a E6) o uno propio aprobado por el docente. No se
   admite el catálogo de productos de los talleres anteriores.
4. **Primer commit en los primeros 30 minutos.** El avance de hoy exige 2 o más commits.

---

## Orden de trabajo

### Paso 1 · Modelo y servicio · R2

| | |
|---|---|
| **Construya** | La interfaz del registro (6 o más campos, lista de ítems y estado) y un servicio con signal privada, `asReadonly()`, un `computed` de total y pendientes, y los métodos `agregar`, `cambiarEstado` y `eliminar`. |
| **Consulte** | S05, ejemplo 1 (`src/app/s05/01-servicio/favoritos.service.ts`) y S06, ejemplo 3 (`precios-dia.service.ts`). |
| **Qué cambia en el taller** | Cada registro lleva un `id` y un `estado`; los cambios entran por métodos con `update()` y un arreglo nuevo. |
| **Compruebe** | Con dos registros agregados, el total es 2; al cambiar uno de estado, los pendientes bajan en 1. |

### Paso 2 · El formulario con validadores integrados · R3

| | |
|---|---|
| **Construya** | `inject(FormBuilder).nonNullable.group(...)` con 6 o más controles y 3 o más validadores integrados distintos. |
| **Consulte** | S07, ejemplo 2 (`02-validadores/ejemplo-integrados.ts`); S06, ejemplo 3 (`registro-precio.ts`) para `getRawValue()` y `reset()`. |
| **Qué cambia en el taller** | Los campos y las reglas salen de su escenario. |
| **Compruebe** | Un campo vacío solo tiene la clave `required`. |

### Paso 3 · Mensajes y estados del control · R6

| | |
|---|---|
| **Construya** | Mensajes de error con la condición `invalid && (touched || dirty)`, uno por tipo de error, y el envío bloqueado (`[disabled]` o `markAllAsTouched()`). |
| **Consulte** | S07, ejemplos 1, 2 y 3. |
| **Qué error previene** | Errores visibles al abrir el formulario; consultar `minLength` con mayúscula. |

### Paso 4 · Validador propio y de grupo · R4

| | |
|---|---|
| **Construya** | Un validador propio de control y un validador de grupo que compare dos campos. |
| **Consulte** | S07, ejemplo 3 y `src/app/s07/validadores.ts`. |
| **Qué cambia en el taller** | La regla es la de su escenario. El validador de grupo no puede dar error con los campos vacíos. |
| **Compruebe** | Su caso límite (valor justo en la frontera) y el primer valor válido, en la tabla de casos del informe. |

### Paso 5 · FormArray · R5

| | |
|---|---|
| **Construya** | Una lista dinámica de ítems con 2 o más controles validados por fila, agregar y quitar, y un validador que exija al menos una fila. |
| **Consulte** | S07, ejemplo 4 (`04-formarray/ejemplo-formarray.ts`). |
| **Qué error previene** | Omitir `formArrayName` o `[formGroupName]="i"`; botones sin `type="button"`; aceptar la lista vacía. |

### Paso 6 · Listado, estados y resumen · R7

| | |
|---|---|
| **Construya** | Listado con `@for` y `track`, bloque `@empty`, cambio de estado por registro y un panel de resumen con `@defer (on interaction)`. |
| **Consulte** | S05, ejemplo 4 (`src/app/s05/04-defer/`). |

### Paso 7 · Informe y repositorio · R1 y R8

1. Diligencie `COM30_S07_informe_plantilla.docx` (escenario, justificación de la estructura y del tipo
   de formulario, controles, validadores, 6 o más casos de prueba, capturas, enlace).
2. README del repositorio con el escenario y cómo ejecutarlo.
3. Verifique que `npx ng build` (o la vista previa de StackBlitz) funciona y que el repositorio abre
   en una ventana privada del navegador.

---

## Avance de hoy y entrega

- **Hoy, hasta las 22:00:** `git push` y enlace del repositorio en la actividad *Taller 06 · Avance en
  clase* (texto en línea). Mínimo: 2 commits, interfaz, servicio y formulario con 3 o más controles.
- **Martes 3 de noviembre de 2026, 23:59:** `COM30_Taller06_Apellido.pdf` en la actividad *Taller 06*,
  con el enlace del repositorio en el texto en línea.
