import { Frutas } from './frutas';

describe('Frutas · Taller 01 Parte B', () => {
	let frutas: Frutas;

	beforeEach(() => {
		frutas = new Frutas();
	});

	it('da el total de $72.800 y 31 unidades con los datos iniciales', () => {
		expect(frutas.totalDinero()).toBe(72800);
		expect(frutas.totalUnidades()).toBe(31);
	});

	it('supera los $50.000, así que el mensaje de venta mayorista debe verse', () => {
		expect(frutas.totalDinero() > 50000).toBe(true);
	});

	it('tras vender 4 mangos el total es $65.600 y las unidades 27', () => {
		frutas.venderMango();
		frutas.venderMango();
		frutas.venderMango();
		frutas.venderMango();
		expect(frutas.totalDinero()).toBe(65600);
		expect(frutas.totalUnidades()).toBe(27);
		expect(frutas.frutas()[0].cantidad).toBe(8);
	});

	it('vender mango reemplaza el arreglo (update), no lo muta por dentro', () => {
		const antes = frutas.frutas();
		frutas.venderMango();
		expect(frutas.frutas()).not.toBe(antes);
		expect(antes[0].cantidad).toBe(12); // el arreglo original quedó intacto
	});

	it('cada fila puede vender su propia fruta', () => {
		frutas.vender('Patilla');
		expect(frutas.frutas()[2].cantidad).toBe(1);
		expect(frutas.totalDinero()).toBe(72800 - 6500);
	});

	it('vendiendo otros productos el total baja de $50.000 y el mensaje se apaga', () => {
		// Los 12 mangos dejan el total en 51.200: aún por encima del umbral.
		for (let i = 0; i < 12; i++) frutas.venderMango();
		expect(frutas.totalDinero()).toBe(51200);
		// Una maracuyá más lo cruza: 51.200 - 3.400 = 47.800 < 50.000.
		frutas.vender('Maracuyá');
		expect(frutas.totalDinero()).toBe(47800);
		expect(frutas.totalDinero() > 50000).toBe(false); // el @if del mensaje se apaga
	});
});
