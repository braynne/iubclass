/* =============================================================================
   COM30 · S04 · EJEMPLOS DE LA CLASE · VERSIÓN PARA STACKBLITZ (un solo archivo)
   -----------------------------------------------------------------------------
   Es el mismo código de src/app/s04/, reunido en un archivo. Cada bloque indica
   el archivo original; la explicación de cada ejemplo está en su comentario de
   encabezado y en CLASE_S04.md.

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

import { Component, LOCALE_ID, OnDestroy, OnInit, computed, effect, input, model, output, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import localeEsCo from '@angular/common/locales/es-CO';

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/producto.ts
// =============================================================================
// =============================================================================
//  S04 · Tipo compartido por los ejemplos de la sesión
// -----------------------------------------------------------------------------
//  Cuando dos componentes intercambian datos, los dos necesitan conocer la
//  forma de ese dato. Por eso la interfaz vive en un archivo propio y cada
//  componente la importa: el padre para declarar la lista y el hijo para
//  declarar su input.
// =============================================================================

interface Producto {
  nombre: string;
  precio: number;
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/01-input/tarjeta-precio.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 1a · Componente hijo con input.required() e input()
//  Diapositivas 20 y 21
// -----------------------------------------------------------------------------
//  Qué muestra
//    - producto = input.required<Producto>(): el padre está obligado a pasarlo.
//      Si lo omite, la aplicación no compila (NG8008).
//    - destacado = input(false): entrada opcional con valor por defecto. Si el
//      padre no la pasa, vale false.
//    - Un input es una signal de solo lectura: se lee con paréntesis,
//      producto().nombre, y no tiene set() ni update().
//    - esCaro es un computed que depende de un input: cuando el padre cambia
//      el producto, esCaro se recalcula sin código adicional.
//
//  Qué observar
//    - La tarjeta no sabe de dónde viene el producto ni cuántas tarjetas hay.
//      Solo sabe mostrar el que recibe. Por eso se puede reutilizar.
// =============================================================================

@Component({
  selector: 'app-tarjeta-precio',
  imports: [CurrencyPipe],
  template: `
    <article class="tarjeta" [class.destacada]="destacado()">
      <h5>{{ producto().nombre }}</h5>
      <p class="precio">{{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
      @if (esCaro()) {
        <span class="etq">Precio alto</span>
      }
    </article>
  `,
  styles: `
    .tarjeta { border: 1px solid #cbd5e1; border-radius: .6rem; padding: .6rem .8rem; min-width: 8.5rem; background: #fff; }
    .destacada { border: 2px solid #f59e0b; background: #fffbeb; }
    h5 { font-weight: 700; color: #0f172a; }
    .precio { font-size: 1.1rem; font-weight: 800; color: #1d4ed8; }
    .etq { display: inline-block; margin-top: .3rem; border-radius: 999px; background: #fee2e2; color: #991b1b; padding: .05rem .5rem; font-size: .7rem; font-weight: 700; }
  `,
})
class TarjetaPrecio {
  // Obligatorio: sin producto, la tarjeta no tiene nada que mostrar.
  producto = input.required<Producto>();

  // Opcional: la mayoría de las tarjetas no van destacadas.
  destacado = input(false);

  // Valor derivado de un input. Se declara igual que en la S02.
  esCaro = computed(() => this.producto().precio >= 5000);
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/01-input/ejemplo-input.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 1b · El padre pasa datos al hijo con [producto]
//  Diapositivas 20 y 21
// -----------------------------------------------------------------------------
//  Qué muestra
//    - El padre importa al hijo en imports y lo usa por su selector.
//    - [producto]="p" es un binding de propiedad, el mismo de la S02, pero
//      dirigido al input de otro componente. Sin corchetes, Angular pasaría el
//      texto "p" y no el objeto.
//    - [destacado] recibe $first: solo la primera tarjeta va destacada. Si el
//      padre no pasara [destacado], el hijo usaría su valor por defecto, false.
//
//  Qué observar
//    - «Subir el ñame 1.000» cambia el dato en el padre. La tarjeta del ñame
//      muestra el precio nuevo y aparece la etiqueta «Precio alto»: el
//      computed del hijo depende del input y se recalcula solo.
// =============================================================================

@Component({
  selector: 'app-ejemplo-input',
  imports: [TarjetaPrecio],
  template: `
    <div class="flex flex-wrap gap-3">
      @for (p of productos(); track p.nombre; let primero = $first) {
        <app-tarjeta-precio [producto]="p" [destacado]="primero" />
      }
    </div>
    <div class="mt-3 flex gap-2">
      <button type="button" class="btn" (click)="subir('Ñame')">Subir el ñame 1.000</button>
      <button type="button" class="btn" (click)="restaurar()">Restaurar precios</button>
    </div>
  `,
  styles: `
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .35rem .8rem; font-size: .8rem; font-weight: 600; }
  `,
})
class EjemploInput {
  private readonly iniciales: Producto[] = [
    { nombre: 'Mango', precio: 1800 },
    { nombre: 'Ñame', precio: 4200 },
    { nombre: 'Patilla', precio: 6500 },
  ];

  // El padre es dueño de la lista. Las tarjetas solo la muestran.
  productos = signal<Producto[]>(this.iniciales);

  subir(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) => (p.nombre === nombre ? { ...p, precio: p.precio + 1000 } : p)),
    );
  }

  restaurar() {
    this.productos.set(this.iniciales);
  }
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/02-output/boton-favorito.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 2a · Componente hijo con output()
//  Diapositiva 22
// -----------------------------------------------------------------------------
//  Qué muestra
//    - alternar = output<string>(): el hijo declara un evento propio y el tipo
//      del dato que viaja con él (aquí, el nombre del producto).
//    - alternar.emit(nombre()): el hijo avisa. No decide qué pasa después.
//    - marcado es un input: el hijo no guarda si es favorito o no; se lo
//      dice el padre en cada momento.
//
//  Qué observar
//    - El botón no modifica ninguna lista. Solo emite. Si el padre no escucha
//      el evento, el clic no tiene ningún efecto.
// =============================================================================

@Component({
  selector: 'app-boton-favorito',
  template: `
    <button type="button" class="fav" [class.activo]="marcado()" (click)="alternar.emit(nombre())">
      {{ marcado() ? '★ Favorito' : '☆ Marcar' }}
    </button>
  `,
  styles: `
    .fav { border: 1px solid #cbd5e1; border-radius: .5rem; padding: .2rem .7rem; font-size: .8rem; font-weight: 600; color: #475569; background: #fff; }
    .activo { border-color: #f59e0b; background: #fef3c7; color: #92400e; }
  `,
})
class BotonFavorito {
  nombre = input.required<string>();
  marcado = input(false);

  // El nombre del evento es el que usa el padre entre paréntesis: (alternar).
  alternar = output<string>();
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/02-output/ejemplo-output.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 2b · El padre escucha el evento del hijo con (alternar)
//  Diapositivas 22 y 23
// -----------------------------------------------------------------------------
//  Qué muestra
//    - (alternar)="alternarFavorito($event)": el mismo binding de eventos de
//      la S02, pero sobre un evento declarado por el hijo. $event es el dato
//      que el hijo pasó a emit(), aquí un string.
//    - El padre es dueño de la lista de favoritos: es el único que la cambia,
//      con update() y un arreglo nuevo.
//    - totalFavoritos es un computed del padre: el encabezado y los botones
//      leen el mismo estado, así que nunca pueden quedar en desacuerdo.
//
//  Qué observar
//    - Los datos bajan (marcado) y los eventos suben (alternar). El contador
//      del encabezado cambia aunque el botón no sabe que ese contador existe.
// =============================================================================

@Component({
  selector: 'app-ejemplo-output',
  imports: [BotonFavorito],
  template: `
    <p class="text-sm font-semibold text-slate-700">
      Favoritos: {{ totalFavoritos() }} · Último evento recibido: {{ ultimo() || 'ninguno' }}
    </p>
    <ul class="mt-2 space-y-1">
      @for (nombre of productos; track nombre) {
        <li class="flex items-center justify-between rounded border border-slate-200 bg-white px-3 py-1.5 text-sm">
          <span>{{ nombre }}</span>
          <app-boton-favorito
            [nombre]="nombre"
            [marcado]="favoritos().includes(nombre)"
            (alternar)="alternarFavorito($event)"
          />
        </li>
      }
    </ul>
  `,
})
class EjemploOutput {
  productos = ['Mango', 'Guayaba', 'Patilla', 'Tomate'];
  favoritos = signal<string[]>([]);
  ultimo = signal('');
  totalFavoritos = computed(() => this.favoritos().length);

  // Recibe el nombre que emitió el hijo. Si ya es favorito, lo quita; si no,
  // lo agrega. En los dos casos se entrega un arreglo nuevo.
  alternarFavorito(nombre: string) {
    this.ultimo.set(nombre);
    this.favoritos.update((lista) =>
      lista.includes(nombre) ? lista.filter((n) => n !== nombre) : [...lista, nombre],
    );
  }
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/03-model/selector-cantidad.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 3a · Enlace en dos vías con model()
//  Diapositiva 27
// -----------------------------------------------------------------------------
//  Qué muestra
//    - cantidad = model(1): es un input que además se puede escribir. Cuando
//      el hijo hace cantidad.update(...), Angular emite el evento
//      cantidadChange y el padre recibe el valor nuevo.
//    - Equivale a declarar a mano input() + output() con el nombre
//      cantidadChange; model() lo hace en una línea.
//    - maximo es un input normal: el hijo lo lee, no lo cambia.
//
//  Cuándo usarlo
//    Para controles propios que editan un solo valor (selector de cantidad,
//    interruptor, calificación con estrellas). Para todo lo demás: input()
//    para bajar datos y output() para avisar.
// =============================================================================

@Component({
  selector: 'app-selector-cantidad',
  template: `
    <div class="sel">
      <button type="button" (click)="restar()" [disabled]="cantidad() <= 1">−</button>
      <span>{{ cantidad() }}</span>
      <button type="button" (click)="sumar()" [disabled]="cantidad() >= maximo()">+</button>
    </div>
  `,
  styles: `
    .sel { display: inline-flex; align-items: center; gap: .6rem; border: 1px solid #cbd5e1; border-radius: .5rem; padding: .2rem .4rem; background: #fff; }
    button { width: 1.8rem; border-radius: .35rem; background: #1e293b; color: #fff; font-weight: 700; }
    button:disabled { background: #cbd5e1; }
    span { min-width: 1.5rem; text-align: center; font-weight: 700; }
  `,
})
class SelectorCantidad {
  cantidad = model(1);
  maximo = input(10);

  // El hijo sí escribe en un model(). En un input() esto no compila.
  sumar() {
    this.cantidad.update((n) => n + 1);
  }

  restar() {
    this.cantidad.update((n) => n - 1);
  }
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/03-model/ejemplo-model.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 3b · El padre usa [(cantidad)]
//  Diapositiva 27
// -----------------------------------------------------------------------------
//  Qué muestra
//    - [(cantidad)]="libras": corchetes por fuera y paréntesis por dentro.
//      Los corchetes bajan el valor; los paréntesis reciben el cambio.
//    - libras es una signal del padre. Dentro de [( )] se escribe sin
//      paréntesis de lectura: Angular necesita la signal, no su valor.
//
//  Qué observar
//    - Con + y −, cambian el total y el texto del padre: el valor subió.
//    - Con «Reiniciar», el padre cambia la signal y el selector muestra 1:
//      el valor bajó. Es un solo dato, visible en los dos componentes.
// =============================================================================

@Component({
  selector: 'app-ejemplo-model',
  imports: [SelectorCantidad, CurrencyPipe],
  template: `
    <div class="flex flex-wrap items-center gap-4 text-sm">
      <span class="font-semibold">Mango · {{ precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }} la libra</span>
      <app-selector-cantidad [(cantidad)]="libras" [maximo]="6" />
      <span>{{ libras() }} lb · total {{ total() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
      <button type="button" class="btn" (click)="libras.set(1)">Reiniciar</button>
    </div>
  `,
  styles: `
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .3rem .8rem; font-size: .8rem; font-weight: 600; }
  `,
})
class EjemploModel {
  precio = 1800;
  libras = signal(2);
  total = computed(() => this.libras() * this.precio);
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/04-dueno-estado/ejemplo-dueno-estado.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 4 · Quién es el dueño del estado: una copia frente a un aviso
//  Diapositiva 29
// -----------------------------------------------------------------------------
//  Dos versiones del mismo hijo, un editor de precio con el botón «+100».
//
//  EditorMal · PROVOCA UN ERROR DE DISEÑO (compila y no muestra mensaje)
//    El hijo modifica el objeto que recibió por input:
//        this.producto().precio += 100
//    El hijo ve el precio nuevo, pero la signal del padre no se enteró del
//    cambio: la suma del padre no se recalcula. Hay dos versiones del dato en
//    pantalla y ninguna avisa que están en desacuerdo.
//
//  EditorBien
//    El hijo solo emite subir(nombre). El padre, que es el dueño de la lista,
//    la actualiza con update() y un arreglo nuevo. La tarjeta y la suma leen
//    el mismo estado, así que siempre coinciden.
//
//  Qué observar
//    - Pulsar «+100» tres veces en el panel de la izquierda: el precio de la
//      fila sube y la suma se queda igual.
//    - Hacer lo mismo en el panel de la derecha: suben los dos.
// =============================================================================

const PRODUCTOS: Producto[] = [
  { nombre: 'Mango', precio: 1800 },
  { nombre: 'Yuca', precio: 2800 },
];

const ESTILOS = `
  .fila { display: flex; align-items: center; justify-content: space-between; gap: .8rem; border-top: 1px solid #e2e8f0; padding: .35rem 0; font-size: .85rem; }
  .btn { border-radius: .4rem; background: #1e293b; color: #fff; padding: .15rem .6rem; font-size: .75rem; font-weight: 700; }
`;

// ----------------------------------------------------------------- versión mal
@Component({
  selector: 'app-editor-mal',
  imports: [CurrencyPipe],
  template: `
    <div class="fila">
      <span>{{ producto().nombre }} · {{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
      <button type="button" class="btn" (click)="subir()">+100</button>
    </div>
  `,
  styles: ESTILOS,
})
class EditorMal {
  producto = input.required<Producto>();

  subir() {
    // ERROR: modifica el objeto del padre sin pasar por su signal.
    this.producto().precio += 100;
  }
}

// ---------------------------------------------------------------- versión bien
@Component({
  selector: 'app-editor-bien',
  imports: [CurrencyPipe],
  template: `
    <div class="fila">
      <span>{{ producto().nombre }} · {{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
      <button type="button" class="btn" (click)="subir.emit(producto().nombre)">+100</button>
    </div>
  `,
  styles: ESTILOS,
})
class EditorBien {
  producto = input.required<Producto>();
  subir = output<string>();
}

// ---------------------------------------------------------------------- padre
@Component({
  selector: 'app-ejemplo-dueno-estado',
  imports: [EditorMal, EditorBien, CurrencyPipe],
  template: `
    <div class="grid gap-4 md:grid-cols-2">
      <div class="panel mal">
        <p class="tit">El hijo modifica su copia</p>
        @for (p of listaMal(); track p.nombre) {
          <app-editor-mal [producto]="p" />
        }
        <p class="suma">Suma en el padre: {{ sumaMal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
      </div>
      <div class="panel bien">
        <p class="tit">El hijo avisa y el padre actualiza</p>
        @for (p of listaBien(); track p.nombre) {
          <app-editor-bien [producto]="p" (subir)="subirPrecio($event)" />
        }
        <p class="suma">Suma en el padre: {{ sumaBien() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
      </div>
    </div>
  `,
  styles: `
    .panel { border-radius: .6rem; padding: .6rem .9rem; background: #fff; }
    .mal { border: 2px solid #fca5a5; }
    .bien { border: 2px solid #86efac; }
    .tit { font-size: .75rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #475569; }
    .suma { margin-top: .4rem; font-weight: 800; color: #0f172a; }
  `,
})
class EjemploDuenoEstado {
  // Copias independientes para que un panel no afecte al otro.
  listaMal = signal<Producto[]>(PRODUCTOS.map((p) => ({ ...p })));
  listaBien = signal<Producto[]>(PRODUCTOS.map((p) => ({ ...p })));

  sumaMal = computed(() => this.listaMal().reduce((s, p) => s + p.precio, 0));
  sumaBien = computed(() => this.listaBien().reduce((s, p) => s + p.precio, 0));

  // El único lugar donde cambia la lista de la derecha.
  subirPrecio(nombre: string) {
    this.listaBien.update((lista) =>
      lista.map((p) => (p.nombre === nombre ? { ...p, precio: p.precio + 100 } : p)),
    );
  }
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/05-ciclo-vida/reloj-plaza.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 5a · ngOnInit y ngOnDestroy
//  Diapositiva 31
// -----------------------------------------------------------------------------
//  Qué muestra
//    - ngOnInit se ejecuta una vez, cuando Angular ya asignó los inputs. Es el
//      lugar para arrancar un temporizador. En el constructor, los inputs
//      todavía no tienen valor.
//    - ngOnDestroy se ejecuta una vez, justo antes de que el componente salga
//      del DOM. Es el lugar para detener lo que ngOnInit arrancó.
//    - limpiar es un input que existe solo para la demostración: con
//      limpiar = false, el componente omite clearInterval.
//
//  Qué observar (con F12 > Consola abierta)
//    - Mostrar el reloj: aparece «ngOnInit» y un «tic» por segundo.
//    - Ocultarlo: aparece «ngOnDestroy» y los tics se detienen.
//    - Con el reloj sin limpieza, los tics siguen después de ocultarlo: el
//      componente ya no existe, pero el temporizador sí. Es una fuga. Se
//      detiene recargando la página.
//
//  Forma equivalente, sin implementar OnDestroy:
//      private destroyRef = inject(DestroyRef);
//      ...
//      this.destroyRef.onDestroy(() => clearInterval(this.id));
// =============================================================================

@Component({
  selector: 'app-reloj-plaza',
  imports: [DatePipe],
  template: `
    <p class="reloj">Hora en la plaza: {{ hora() | date: 'HH:mm:ss' }}</p>
  `,
  styles: `
    .reloj { display: inline-block; border-radius: .5rem; background: #0f172a; color: #fbbf24; padding: .3rem .8rem; font-family: ui-monospace, Consolas, monospace; font-weight: 700; }
  `,
})
class RelojPlaza implements OnInit, OnDestroy {
  etiqueta = input('reloj');
  limpiar = input(true);

  hora = signal(new Date());
  private id?: ReturnType<typeof setInterval>;
  private tics = 0;

  ngOnInit() {
    console.log(`[${this.etiqueta()}] ngOnInit: arranca el temporizador`);
    this.id = setInterval(() => {
      this.tics++;
      this.hora.set(new Date());
      console.log(`[${this.etiqueta()}] tic ${this.tics}`);
    }, 1000);
  }

  ngOnDestroy() {
    console.log(`[${this.etiqueta()}] ngOnDestroy`);
    if (this.limpiar()) {
      clearInterval(this.id);
    }
  }
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/05-ciclo-vida/ejemplo-ciclo-vida.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 5b · Crear y destruir un componente con @if
//  Diapositiva 31
// -----------------------------------------------------------------------------
//  Qué muestra
//    - @if no oculta: crea el componente cuando la condición se cumple y lo
//      destruye cuando deja de cumplirse (S03). Por eso sirve para ver el
//      ciclo de vida completo sin cambiar de ruta.
//    - Los relojes empiezan ocultos: se crean solo en el navegador, cuando el
//      usuario pulsa el botón.
//
//  Qué observar
//    Ver el comentario de reloj-plaza.ts. La consola del navegador (F12) es la
//    evidencia: la pantalla no muestra la fuga.
// =============================================================================

@Component({
  selector: 'app-ejemplo-ciclo-vida',
  imports: [RelojPlaza],
  template: `
    <div class="flex flex-wrap gap-2">
      <button type="button" class="btn" (click)="correcto.update(alternar)">
        {{ correcto() ? 'Ocultar' : 'Mostrar' }} el reloj con limpieza
      </button>
      <button type="button" class="btn rojo" (click)="sinLimpieza.update(alternar)">
        {{ sinLimpieza() ? 'Ocultar' : 'Mostrar' }} el reloj sin limpieza
      </button>
    </div>
    <div class="mt-3 flex flex-wrap gap-3">
      @if (correcto()) {
        <app-reloj-plaza etiqueta="con limpieza" />
      }
      @if (sinLimpieza()) {
        <app-reloj-plaza etiqueta="sin limpieza" [limpiar]="false" />
      }
    </div>
  `,
  styles: `
    .btn { border-radius: .5rem; background: #1e293b; color: #fff; padding: .35rem .8rem; font-size: .8rem; font-weight: 600; }
    .rojo { background: #991b1b; }
  `,
})
class EjemploCicloVida {
  correcto = signal(false);
  sinLimpieza = signal(false);
  protected alternar = (v: boolean) => !v;
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/05-ciclo-vida/ejemplo-effect.ts
// =============================================================================
// =============================================================================
//  S04 · EJEMPLO 6 · effect() frente a computed()
//  Diapositiva 32
// -----------------------------------------------------------------------------
//  Qué muestra
//    - computed() produce un valor: visibles y cantidad se leen en la
//      plantilla.
//    - effect() no produce ningún valor: ejecuta una acción hacia fuera del
//      componente cada vez que cambia una signal que lee. Aquí escribe en la
//      consola; en una aplicación real guardaría una preferencia o enviaría
//      una métrica.
//    - El effect se declara en un inicializador de campo (o en el
//      constructor), porque necesita el contexto de inyección del componente.
//      Se destruye solo cuando se destruye el componente.
//
//  Qué observar (F12 > Consola)
//    - Al cargar, el effect se ejecuta una vez con el valor inicial.
//    - Cada botón de rango escribe una línea nueva. Pulsar dos veces el mismo
//      botón no escribe nada: la signal no cambió.
//
//  Regla: si el resultado se muestra en pantalla, es un computed.
// =============================================================================

type Rango = 'todos' | 'economico' | 'alto';

@Component({
  selector: 'app-ejemplo-effect',
  template: `
    <div class="flex flex-wrap gap-2">
      @for (r of rangos; track r.id) {
        <button type="button" class="btn" [class.activo]="rango() === r.id" (click)="rango.set(r.id)">{{ r.texto }}</button>
      }
    </div>
    <p class="mt-2 text-sm">
      {{ cantidad() }} productos:
      @for (p of visibles(); track p.nombre; let ultimo = $last) {
        {{ p.nombre }}{{ ultimo ? '' : ', ' }}
      }
    </p>
  `,
  styles: `
    .btn { border: 1px solid #cbd5e1; border-radius: .5rem; background: #fff; padding: .25rem .8rem; font-size: .8rem; font-weight: 600; }
    .activo { background: #1e293b; color: #fff; }
  `,
})
class EjemploEffect {
  rangos: { id: Rango; texto: string }[] = [
    { id: 'todos', texto: 'Todos' },
    { id: 'economico', texto: 'Económicos' },
    { id: 'alto', texto: 'Precio alto' },
  ];
  rango = signal<Rango>('todos');

  private productos = [
    { nombre: 'Plátano', precio: 1500 },
    { nombre: 'Mango', precio: 1800 },
    { nombre: 'Patilla', precio: 6500 },
    { nombre: 'Queso costeño', precio: 14000 },
  ];

  // Valores: computed.
  visibles = computed(() => {
    const r = this.rango();
    if (r === 'todos') return this.productos;
    return this.productos.filter((p) => (r === 'economico' ? p.precio < 5000 : p.precio >= 5000));
  });
  cantidad = computed(() => this.visibles().length);

  // Acción hacia fuera: effect. Lee rango(), así que se repite cuando cambia.
  private registro = effect(() => {
    console.log(`[effect] rango = ${this.rango()} · ${this.cantidad()} productos`);
  });
}

// =============================================================================
// ARCHIVO ORIGINAL: src/app/s04/s04.ts
// =============================================================================
// =============================================================================
//  S04 · Página de ejemplos · ruta /s04
// -----------------------------------------------------------------------------
//  Reúne los seis ejemplos de la sesión, en el orden de la presentación. Cada
//  tarjeta indica la diapositiva que la acompaña y el archivo donde está el
//  código. La explicación completa de cada ejemplo está en el comentario de
//  encabezado de su archivo y en CLASE_S04.md.
//
//  Esta misma página es un ejemplo del tema de la sesión: S04 es el padre y
//  cada ejemplo es un componente hijo que se usa por su selector.
// =============================================================================

@Component({
  selector: 'app-s04',
  imports: [EjemploInput, EjemploOutput, EjemploModel, EjemploDuenoEstado, EjemploCicloVida, EjemploEffect],
  template: `
    <h2 class="text-2xl font-bold text-slate-900">Sesión S04 · Interacción de componentes y ciclo de vida</h2>
    <p class="mt-1 text-sm text-slate-500">
      Ejemplos de la clase. Cada uno indica la diapositiva que lo acompaña y su archivo en src/app/s04/.
      Los ejemplos 5 y 6 se observan en la consola del navegador (F12).
    </p>

    <h3 class="bloque">Bloque 1 · Datos que bajan, eventos que suben</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 1 · Diapositivas 20 y 21 · 01-input/tarjeta-precio.ts y ejemplo-input.ts</p>
      <h4>input.required() e input() con valor por defecto</h4>
      <app-ejemplo-input />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 2 · Diapositivas 22 y 23 · 02-output/boton-favorito.ts y ejemplo-output.ts</p>
      <h4>output() y el padre que escucha el evento</h4>
      <app-ejemplo-output />
    </section>

    <h3 class="bloque">Bloque 2 · Dueño del estado y ciclo de vida</h3>
    <section class="tarjeta">
      <p class="meta">Ejemplo 3 · Diapositiva 27 · 03-model/selector-cantidad.ts y ejemplo-model.ts</p>
      <h4>model() y el enlace en dos vías [( )]</h4>
      <app-ejemplo-model />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 4 · Diapositiva 29 · 04-dueno-estado/ejemplo-dueno-estado.ts</p>
      <h4>Una copia modificada frente a un aviso al dueño</h4>
      <app-ejemplo-dueno-estado />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 5 · Diapositiva 31 · 05-ciclo-vida/reloj-plaza.ts y ejemplo-ciclo-vida.ts</p>
      <h4>ngOnInit y ngOnDestroy: el temporizador que se detiene y el que no</h4>
      <app-ejemplo-ciclo-vida />
    </section>
    <section class="tarjeta">
      <p class="meta">Ejemplo 6 · Diapositiva 32 · 05-ciclo-vida/ejemplo-effect.ts</p>
      <h4>effect() frente a computed()</h4>
      <app-ejemplo-effect />
    </section>
  `,
  styles: `
    .bloque { margin-top: 2rem; font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .15em; color: #b45309; }
    .tarjeta { margin-top: .9rem; border: 1px solid #e2e8f0; border-left: 4px solid #1e293b; border-radius: .75rem; background: #fff; padding: 1rem 1.2rem; }
    .meta { font-size: .7rem; font-family: ui-monospace, Consolas, monospace; color: #64748b; }
    h4 { margin: .15rem 0 .7rem; font-size: 1.05rem; font-weight: 700; color: #0f172a; }
  `,
})
class S04 {}

// =============================================================================
// ARRANQUE (en Angular CLI esto está en main.ts, app.ts y app.config.ts)
// =============================================================================
@Component({ selector: 'app-root', imports: [S04], template: `<main style="max-width:64rem;margin:auto;padding:1.5rem"><app-s04 /></main>` })
class App {}

registerLocaleData(localeEsCo);
bootstrapApplication(App, { providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }] });
