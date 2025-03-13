class Pizarra {
	constructor() {
		this.botonCrearPizarra = document.getElementById("crear-pizarra");
		this.modal = document.getElementById("pizarra-modal");
		this.pizarraContainer = document.querySelector(".pizarra");
		this.pizarras = [];
		this.editIndex = null; // Para saber si estamos editando una pizarra existente

		this.cargarDesdeLocalStorage(); // Cargar pizarras guardadas
		this.agregarEventos();
		this.mostrarPizarras(); // Mostrar las pizarras al cargar la página
	}

	agregarEventos() {
		this.botonCrearPizarra.addEventListener("click", () =>
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
			.addEventListener("click", () => this.createOrUpdatePizarra());
	}

	openModal(index = null) {
		this.modal.style.display = "flex";
		document.body.classList.add("modal-open");

		if (index !== null) {
			this.editIndex = index;
			document.getElementById("pizarra-name").value =
				this.pizarras[index].nombre;
			document.getElementById("pizarra-desc").value =
				this.pizarras[index].descripcion;
			document.querySelector(".crear-btn").textContent = "Actualizar";
		} else {
			this.editIndex = null;
			document.getElementById("pizarra-name").value = "";
			document.getElementById("pizarra-desc").value = "";
			document.querySelector(".crear-btn").textContent = "Crear";
		}
	}

	closeModal() {
		this.modal.style.display = "none";
		document.body.classList.remove("modal-open");
	}

	createOrUpdatePizarra() {
		const pizarraName = document
			.getElementById("pizarra-name")
			.value.trim();
		const pizarraDesc = document
			.getElementById("pizarra-desc")
			.value.trim();

		if (pizarraName && pizarraDesc) {
			if (this.editIndex === null) {
				// Crear nueva pizarra
				this.pizarras.push({
					id: Date.now(), // ID único basado en timestamp
					nombre: pizarraName,
					descripcion: pizarraDesc
				});
			} else {
				// Editar pizarra existente
				this.pizarras[this.editIndex] = {
					...this.pizarras[this.editIndex],
					nombre: pizarraName,
					descripcion: pizarraDesc
				};
				this.editIndex = null;
			}

			this.guardarEnLocalStorage(); // Guardar cambios en localStorage
			this.mostrarPizarras();
			this.closeModal();
		} else {
			alert("Por favor, completa todos los campos.");
		}
	}

	mostrarPizarras() {
		this.pizarraContainer.innerHTML = "";

		if (this.pizarras.length === 0) {
			this.pizarraContainer.innerHTML = `
                <div class="empty-message">
                    <i class="fa-solid fa-ban"></i>
                    <p>No existen pizarras</p>
                </div>
            `;
		} else {
			this.pizarras.forEach((pizarra, index) => {
				const pizarraElement = document.createElement("div");
				pizarraElement.classList.add("pizarra-item");
				pizarraElement.innerHTML = `
                    <h3>${pizarra.nombre}</h3>
                    <p>${pizarra.descripcion}</p>
                    <button class="edit-btn" data-index="${index}">Editar</button>
                    <button class="delete-btn" data-index="${index}">Eliminar</button>
                `;
				this.pizarraContainer.appendChild(pizarraElement);
			});

			// Agregar eventos a los botones de eliminar y editar
			document.querySelectorAll(".delete-btn").forEach((button) => {
				button.addEventListener("click", (event) => {
					const index = event.target.getAttribute("data-index");
					this.eliminarPizarra(index);
				});
			});

			document.querySelectorAll(".edit-btn").forEach((button) => {
				button.addEventListener("click", (event) => {
					const index = event.target.getAttribute("data-index");
					this.openModal(index);
				});
			});
		}
	}

	eliminarPizarra(index) {
		this.pizarras.splice(index, 1);
		this.guardarEnLocalStorage();
		this.mostrarPizarras();
	}

	guardarEnLocalStorage() {
		localStorage.setItem("pizarras", JSON.stringify(this.pizarras));
	}

	cargarDesdeLocalStorage() {
		const pizarrasGuardadas = localStorage.getItem("pizarras");
		if (pizarrasGuardadas) {
			this.pizarras = JSON.parse(pizarrasGuardadas);
		}
	}
}

const pizarra = new Pizarra();
