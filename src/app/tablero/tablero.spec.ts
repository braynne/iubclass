import { Tablero } from './tablero';

describe('Tablero · Reto S02', () => {
	let tablero: Tablero;

	beforeEach(() => {
		tablero = new Tablero();
	});

	it('arranca con los valores de la clase: $47.400 y 23 unidades', () => {
		expect(tablero.total()).toBe(47400);
		expect(tablero.unidades()).toBe(23);
		expect(tablero.total() > 50000).toBe(false); // el mensaje mayorista no se ve aún
	});

	it('Reto 1 · hay 1 producto agotado al inicio (la guayaba)', () => {
		expect(tablero.agotados()).toBe(1);
	});

	it('Reto 2 · hay inventario bajo porque el ñame tiene 2 unidades', () => {
		expect(tablero.hayInventarioBajo()).toBe(true);
		tablero.reabastecer('Ñame');
		expect(tablero.hayInventarioBajo()).toBe(false);
	});

	it('Reto 3 · el producto más caro es el ñame ($4.200)', () => {
		expect(tablero.masCaro()?.nombre).toBe('Ñame');
	});

	it('Reto 4 · vender todo deja la fila en cero y sube el contador de agotados', () => {
		tablero.venderTodo('Yuca');
		const yuca = tablero.productos().find((p) => p.nombre === 'Yuca')!;
		expect(yuca.cantidad).toBe(0);
		expect(tablero.agotados()).toBe(2);
	});

	it('Reto 5 · la primera fila al ordenar es el mango y la lista NO se muta', () => {
		expect(tablero.ordenados()[0].nombre).toBe('Mango');
		expect(tablero.productos()[3].nombre).toBe('Mango'); // el orden original se conserva
	});

	it('Reto 5 · ordena por subtotal de mayor a menor', () => {
		const subtotales = tablero.ordenados().map((p) => p.precio * p.cantidad);
		expect(subtotales).toEqual([...subtotales].sort((a, b) => b - a));
	});

	it('Reto 5 · la copia es real: un nuevo ordenado no cambia la lista de la signal', () => {
		const listaOriginal = tablero.productos();
		const listaOrdenada = tablero.ordenados();
		expect(listaOrdenada).not.toBe(listaOriginal);
		expect(tablero.productos()).toEqual(listaOriginal);
	});
});
