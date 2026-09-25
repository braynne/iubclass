import { Component, computed, signal } from '@angular/core';

// -----------------------------------------------------------------------------
// PARTE B · El puesto de frutas en Angular.
// El mismo problema que en frutas.html, con tres diferencias:
//   1. El estado vive en una signal.
//   2. Los totales son computed: se deducen, nadie los repinta.
//   3. La plantilla se actualiza sola cuando los datos cambian.
// -----------------------------------------------------------------------------
interface Fruta {
	nombre: string;
	precio: number;
	cantidad: number;
}

@Component({
	selector: 'app-frutas',
	templateUrl: './frutas.html',
})
export class Frutas {
	// ===========================================================================
	// EL ESTADO · una signal con el arreglo de frutas (los mismos datos de la
	// Parte A). Una signal lleva la cuenta de quién la mira y avisa cuando cambia.
	// ===========================================================================
	frutas = signal<Fruta[]>([
		{ nombre: 'Mango', precio: 1800, cantidad: 12 },
		{ nombre: 'Guayaba', precio: 1200, cantidad: 8 },
		{ nombre: 'Patilla', precio: 6500, cantidad: 2 },
		{ nombre: 'Maracuyá', precio: 3400, cantidad: 5 },
		{ nombre: 'Níspero', precio: 2900, cantidad: 4 },
	]);

	// ===========================================================================
	// VALORES DERIVADOS · computed.
	// No se guardan: se deducen de la signal. Al leer frutas() adentro, cada
	// computed queda suscrito y se recalcula solo cuando la lista cambia.
	// En la Parte A el equivalente a estos dos bloques era pintar() entero.
	// ===========================================================================
	totalDinero = computed(() =>
		// Requisito 2 · la suma de los subtotales (precio por cantidad).
		this.frutas().reduce((suma, f) => suma + f.precio * f.cantidad, 0),
	);

	totalUnidades = computed(() =>
		// Requisito 4 · la suma de las cantidades, NO de los precios.
		this.frutas().reduce((suma, f) => suma + f.cantidad, 0),
	);

	// ===========================================================================
	// MÉTODOS · cómo se cambia la signal.
	// update() construye un arreglo NUEVO con map y devuelve una copia de la
	// fruta vendida con la cantidad en uno menos. Jamás se toca el arreglo por
	// dentro:
	//     this.frutas()[0].cantidad--        <-- NO: la señal no se entera
	//     this.frutas.update(lista => ...)   <-- SÍ: se reemplaza el valor
	// ===========================================================================
	vender(nombre: string) {
		this.frutas.update((lista) =>
			lista.map(
				(f) =>
					f.nombre === nombre && f.cantidad > 0
						? { ...f, cantidad: f.cantidad - 1 } // objeto nuevo
						: f, // las demás frutas, tal cual estaban
			),
		);
		// Y aquí NO hay que llamar a pintar(). No existe.
		// totalDinero y totalUnidades ya están al día: son computed.
	}

	// Requisito 3 · el botón pedido por el enunciado. Vender cada fruta desde
	// su fila también sirve; con eso se baja el total por debajo de $50.000 y
	// se puede ver el @if del mensaje apagándose solo.
	venderMango() {
		this.vender('Mango');
	}
}
