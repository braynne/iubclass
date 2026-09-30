# COM30 · S04 · Ejemplos de la clase

**Sesión S04 · miércoles 30 de septiembre de 2026 · Interacción de componentes y ciclo de vida**

El código de la sesión está en `src/app/s04/` y se ve en la ruta **`/s04`** de la aplicación
(pestaña «S04 · Ejemplos»). Cada ejemplo corresponde a una o varias diapositivas de la
presentación `COM30_S04_sesion.pdf`, publicada en el aula. La explicación completa está en el
comentario de encabezado de cada archivo; este documento la resume y dice qué debe observarse.

Quien trabaja en StackBlitz tiene los seis ejemplos en un solo archivo:
`_para-stackblitz/s04-main.ts`.

---

## Antes de abrir los ejemplos: el entorno local

Primera parte de la sesión (diapositivas 5 a 16). En los equipos de la sala Node.js está
instalado, pero su carpeta **no está en el PATH**: `node`, `npm` y `ng` «no se reconocen». La
corrección no pide administrador y vale para la ventana donde se ejecuta. Se trabaja en
**Símbolo del sistema (cmd)**, no en PowerShell.

```
REM 1. Antes de clonar: Node.js y la carpeta global de npm en el PATH de esta ventana
set "PATH=C:\Program Files\nodejs;%APPDATA%\npm;%PATH%"
node -v                     v22.22 o superior, o v24.15 o superior
npm -v
git --version

REM 2. Clonar, instalar y ejecutar
git clone https://github.com/SU_USUARIO/iubclass.git
cd iubclass
npm install                 reconstruye node_modules a partir de package-lock.json
npx ng serve                abre la aplicación en http://localhost:4200
```

- **Cada ventana nueva de cmd necesita el PATH otra vez.** Dentro del proyecto basta con
  `.\entorno-sala.cmd`, que hace lo mismo y muestra las versiones.
- **En VS Code no hace falta nada:** `.vscode/settings.json` abre las terminales en cmd con
  Node en el PATH, y `.vscode/tasks.json` trae las tareas *COM30 · 1 Verificar entorno*,
  *2 Instalar dependencias*, *3 Servidor de desarrollo* y *4 Compilar* (Terminal → Ejecutar
  tarea). La primera vez, VS Code pregunta si confía en los autores de la carpeta: sin
  confiar, no aplica esta configuración.
- Escribir la ruta completa (`"C:\Program Files\nodejs\npm.cmd"`) sirve para `npm`, pero
  no para `ng`: el lanzador de `ng` busca `node` en el PATH y falla con
  `"node" no se reconoce como un comando interno o externo`.
- Antes de clonar, en la página de su fork en GitHub: **Sync fork → Update branch**.
- `node_modules` no se sube a GitHub ni se entrega en el ZIP: `npm install` la reconstruye.

---

## Mapa de la sesión

| # | Diapositiva | Archivo | Concepto |
|---|---|---|---|
| 1 | 20 y 21 | `01-input/tarjeta-precio.ts` · `01-input/ejemplo-input.ts` | `input.required()`, `input()` con valor por defecto y `computed` sobre un input |
| 2 | 22 y 23 | `02-output/boton-favorito.ts` · `02-output/ejemplo-output.ts` | `output()`, `emit()` y `$event` en el padre |
| 3 | 27 | `03-model/selector-cantidad.ts` · `03-model/ejemplo-model.ts` | `model()` y `[( )]` |
| 4 | 29 | `04-dueno-estado/ejemplo-dueno-estado.ts` | El hijo que modifica su copia frente al hijo que avisa |
| 5 | 31 | `05-ciclo-vida/reloj-plaza.ts` · `05-ciclo-vida/ejemplo-ciclo-vida.ts` | `ngOnInit`, `ngOnDestroy` y la fuga de un temporizador |
| 6 | 32 | `05-ciclo-vida/ejemplo-effect.ts` | `effect()` frente a `computed()` |
| — | — | `producto.ts` | Interfaz compartida por el padre y el hijo |
| — | — | `s04.ts` | La página `/s04`: un padre con seis hijos |

---

## Bloque 1 · Datos que bajan, eventos que suben

### Ejemplo 1 · `input.required()` e `input()`

`TarjetaPrecio` es un hijo que no sabe de dónde viene el producto: lo recibe del padre.

- **Qué hacer:** pulsar «Subir el ñame 1.000» y luego «Restaurar precios».
- **Qué observar:** el padre cambia su lista; la tarjeta del ñame muestra el precio nuevo y la
  etiqueta «Precio alto», porque `esCaro` es un `computed` que depende del input. Solo la
  primera tarjeta va destacada: las demás usan el valor por defecto de `destacado`.
- **Qué error previene:** borrar `[producto]="p"` de la plantilla del padre produce
  `NG8008: Required input 'producto' from component TarjetaPrecio must be specified.`

### Ejemplo 2 · `output()`

`BotonFavorito` emite el nombre del producto. No modifica ninguna lista.

- **Qué hacer:** marcar y desmarcar dos productos.
- **Qué observar:** el contador «Favoritos» del padre cambia, y «Último evento recibido» muestra
  el dato que viajó en `$event`. El botón no sabe que el contador existe.
- **Qué error previene:** un hijo que cambia el estado del padre directamente.

---

## Bloque 2 · Dueño del estado y ciclo de vida

### Ejemplo 3 · `model()`

- **Qué hacer:** pulsar + y − en el selector; luego «Reiniciar».
- **Qué observar:** el total del padre cambia con + y − (el valor sube), y el selector vuelve a 1
  con «Reiniciar» (el valor baja). Es un solo dato con dos lectores.
- **Detalle de sintaxis:** `[(cantidad)]="libras"`, sin paréntesis de lectura en `libras`.

### Ejemplo 4 · Una copia modificada frente a un aviso

- **Qué hacer:** pulsar «+100» tres veces en el mango de cada panel.
- **Qué observar:** a la izquierda, el precio de la fila sube pero la suma del padre se queda en
  $ 4.600. A la derecha, suben los dos. El panel izquierdo compila y no muestra ningún error:
  por eso es peligroso.

### Ejemplo 5 · `ngOnInit` y `ngOnDestroy`

Abra la consola del navegador (F12 → Consola) antes de empezar.

1. «Mostrar el reloj con limpieza»: aparece `ngOnInit` y un `tic` por segundo.
2. «Ocultar»: aparece `ngOnDestroy` y los tics se detienen.
3. Repita con el reloj sin limpieza: después de ocultarlo, los tics continúan. El componente ya
   no existe, pero el temporizador sí. Recargue la página para detenerlo.

### Ejemplo 6 · `effect()` frente a `computed()`

- **Qué hacer:** con la consola abierta, pulsar los tres botones de rango, y dos veces seguidas el
  mismo.
- **Qué observar:** la lista y la cantidad (dos `computed`) cambian en pantalla. El `effect` solo
  escribe en la consola, y no escribe nada cuando se repite el mismo botón: la signal no cambió.
