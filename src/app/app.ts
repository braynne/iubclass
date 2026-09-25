import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// El componente raíz. No tiene lógica del negocio: solo la cáscara de la
// aplicación (encabezado y navegación) y el hueco donde el enrutador pone
// la vista que corresponda a la URL.
@Component({
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	selector: 'app-root',
	styleUrl: './app.css',
	templateUrl: './app.html',
})
export class App {
	protected readonly titulo = signal('Plaza de mercado');
	protected readonly modulo = signal('COM30 · Programación con Frameworks para Web');
}
