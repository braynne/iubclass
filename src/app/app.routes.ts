import { Routes } from '@angular/router';
import { Tablero } from './tablero/tablero';
import { Frutas } from './frutas/frutas';
import { Acerca } from './acerca/acerca';
import { S03 } from './s03/s03';

// El mapa de rutas de la aplicación: qué componente se muestra en cada URL.
// Esto se ve completo en la S09. Hoy solo dejamos el esqueleto para que la
// aplicación tenga dónde crecer: dos vistas y una redirección.
export const routes: Routes = [
	{ path: '', redirectTo: 'tablero', pathMatch: 'full' },
	{ path: 'tablero', component: Tablero },
	{ path: 'frutas', component: Frutas }, // Taller 01 · Parte B, el puesto de frutas
	{ path: 's03', component: S03 }, // ejemplos de la sesión S03
	{ path: 'acerca', component: Acerca },
	{ path: '**', redirectTo: 'tablero' }, // cualquier otra URL vuelve al tablero
];
