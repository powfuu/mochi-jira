class Tarjeta {
	constructor() {
		this.botonCrearTarjeta = document.getElementById("crear-tarjeta");
		this.modal = document.getElementById("tarjeta-modal");
		this.listaPizarras = document.getElementById("pizarra-select");
		this.filtroPizarras = document.getElementById("filtro-pizarras");
		this.botonFiltrar = document.getElementById("filtrar-btn");
		this.botonQuitarFiltro = document.getElementById("quitar-filtro-btn");
		this.tarjetaContainer = document.querySelector(".tarjetas-container");

		this.tarjetas = JSON.parse(localStorage.getItem("tarjetas")) || [];
		this.pizarras = JSON.parse(localStorage.getItem("pizarras")) || [];
		this.editIndex = null;

		this.agregarEventos();
		this.cargarPizarras();
		this.mostrarTarjetas();
	}

	/** 🔹 Agregar eventos a los botones */
	agregarEventos() {
		this.botonCrearTarjeta.addEventListener("click", () =>
			this.openModal()
		);

		document
			.querySelector(".close")
			.addEventListener("click", () => this.closeModal());

		document
			.querySelector(".cancelar-btn")
			.addEventListener("click", () => this.closeModal());

		document
			.querySelector(".crear-btn")
			.addEventListener("click", () => this.createOrUpdateTarjeta());

		this.botonFiltrar.addEventListener("click", () =>
			this.filtrarTarjetas()
		);

		this.botonQuitarFiltro.addEventListener("click", () =>
			this.quitarFiltro()
		);
	}

	/** 🔹 Cargar las pizarras en los selects */
	cargarPizarras() {
		this.listaPizarras.innerHTML = "";
		this.filtroPizarras.innerHTML = "";

		const pizarrasGuardadas =
			JSON.parse(localStorage.getItem("pizarras")) || [];

		// Opción por defecto en el modal
		const defaultOption = document.createElement("option");
		defaultOption.value = "";
		defaultOption.disabled = true;
		defaultOption.selected = true;
		defaultOption.textContent = "Seleccionar Pizarra";
		this.listaPizarras.appendChild(defaultOption);

		// Si no hay pizarras disponibles
		if (pizarrasGuardadas.length === 0) {
			this.filtroPizarras.innerHTML = `<option disabled>No hay pizarras disponibles</option>`;
			return;
		}

		// Agregar pizarras al modal y al filtro
		pizarrasGuardadas.forEach((pizarra) => {
			const option = document.createElement("option");
			option.value = pizarra.id;
			option.textContent = pizarra.nombre;
			this.listaPizarras.appendChild(option);

			const filtroOption = document.createElement("option");
			filtroOption.value = pizarra.id;
			filtroOption.textContent = pizarra.nombre;
			this.filtroPizarras.appendChild(filtroOption);
		});
	}

	/** 🔹 Abre el modal para crear o editar */
	openModal(index = null) {
		this.modal.style.display = "flex";
		document.body.classList.add("modal-open");

		// 🔹 Cargar las pizarras antes de mostrar el modal
		this.cargarPizarras();

		if (index !== null) {
			// Edición de tarjeta
			this.editIndex = index;
			document.getElementById("tarjeta-titulo").value =
				this.tarjetas[index].titulo;
			document.getElementById("tarjeta-desc").value =
				this.tarjetas[index].descripcion;
			document.getElementById("tarjeta-prioridad").value =
				this.tarjetas[index].prioridad;
			document.getElementById("pizarra-select").value =
				this.tarjetas[index].id_pizarra;
			document.querySelector(".crear-btn").textContent = "Actualizar";
		} else {
			// Creación de nueva tarjeta
			this.editIndex = null;
			document.getElementById("tarjeta-titulo").value = "";
			document.getElementById("tarjeta-desc").value = "";
			document.getElementById("tarjeta-prioridad").value = "Media";
			document.getElementById("pizarra-select").value = "";
			document.querySelector(".crear-btn").textContent = "Crear";
		}
	}

	/** 🔹 Cierra el modal */
	closeModal() {
		this.modal.style.display = "none";
		document.body.classList.remove("modal-open");
	}

	/** 🔹 Crear o actualizar una tarjeta */
	createOrUpdateTarjeta() {
		const titulo = document.getElementById("tarjeta-titulo").value.trim();
		const descripcion = document
			.getElementById("tarjeta-desc")
			.value.trim();
		const prioridad = document.getElementById("tarjeta-prioridad").value;
		const id_pizarra = document.getElementById("pizarra-select").value;

		if (!titulo || !descripcion || !id_pizarra) {
			alert("Por favor, completa todos los campos.");
			return;
		}

		if (this.editIndex === null) {
			// Crear nueva tarjeta
			this.tarjetas.push({ titulo, descripcion, prioridad, id_pizarra });
		} else {
			// Editar tarjeta existente
			this.tarjetas[this.editIndex] = {
				titulo,
				descripcion,
				prioridad,
				id_pizarra
			};
			this.editIndex = null;
		}

		localStorage.setItem("tarjetas", JSON.stringify(this.tarjetas));
		this.mostrarTarjetas();
		this.closeModal();
	}

	/** 🔹 Filtrar tarjetas según la pizarra seleccionada */
	filtrarTarjetas() {
		const opcionesSeleccionadas = Array.from(
			this.filtroPizarras.selectedOptions
		).map((option) => option.value);

		if (opcionesSeleccionadas.length === 0) {
			this.mostrarTarjetas();
			return;
		}

		const tarjetasFiltradas = this.tarjetas.filter((tarjeta) =>
			opcionesSeleccionadas.includes(tarjeta.id_pizarra)
		);

		this.mostrarTarjetas(tarjetasFiltradas);
	}

	/** 🔹 Mostrar todas las tarjetas */
	mostrarTarjetas(tarjetas = this.tarjetas) {
		this.tarjetaContainer.innerHTML = "";

		if (tarjetas.length === 0) {
			this.tarjetaContainer.innerHTML = `<p class="empty-message">No hay tarjetas disponibles.</p>`;
			return;
		}

		tarjetas.forEach((tarjeta, index) => {
			const tarjetaElement = document.createElement("div");
			tarjetaElement.classList.add("tarjeta-item");
			tarjetaElement.innerHTML = `
                <h3>${tarjeta.titulo}</h3>
                <p>${tarjeta.descripcion}</p>
                <span class="prioridad-${tarjeta.prioridad.toLowerCase()}">${
				tarjeta.prioridad
			}</span>
                <p><strong>Pizarra:</strong> ${this.obtenerNombrePizarra(
					tarjeta.id_pizarra
				)}</p>
                <button class="edit-btn" data-index="${index}">Editar</button>
                <button class="delete-btn" data-index="${index}">Eliminar</button>
            `;
			this.tarjetaContainer.appendChild(tarjetaElement);
		});

		// Eventos de edición y eliminación
		document.querySelectorAll(".edit-btn").forEach((btn) => {
			btn.addEventListener("click", (event) => {
				const index = event.target.getAttribute("data-index");
				this.openModal(index);
			});
		});

		document.querySelectorAll(".delete-btn").forEach((btn) => {
			btn.addEventListener("click", (event) => {
				const index = event.target.getAttribute("data-index");
				this.eliminarTarjeta(index);
			});
		});
	}

	/** 🔹 Eliminar una tarjeta */
	eliminarTarjeta(index) {
		this.tarjetas.splice(index, 1);
		localStorage.setItem("tarjetas", JSON.stringify(this.tarjetas));
		this.mostrarTarjetas();
	}

	/** 🔹 Quitar el filtro y mostrar todas las tarjetas */
	quitarFiltro() {
		this.filtroPizarras.selectedIndex = -1;
		this.mostrarTarjetas();
	}

	/** 🔹 Obtener el nombre de la pizarra asociada */
	obtenerNombrePizarra(id_pizarra) {
		const pizarra = this.pizarras.find((p) => p.id == id_pizarra);
		return pizarra ? pizarra.nombre : "Sin Pizarra";
	}
}

// Iniciar la clase cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
	new Tarjeta();
});
