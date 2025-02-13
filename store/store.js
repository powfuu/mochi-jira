export class Store {
    _pizarras;
    _tarjetas;

    constructor() {
        if (!Store.instance) {
            this._pizarras = JSON.parse(localStorage.getItem("pizarras")) || [];
            this._tarjetas = JSON.parse(localStorage.getItem("tarjetas")) || [];
            Store.instance = this;
        }
        return Store.instance;
    }

    getPizarras() {
        return this._pizarras;
    }

    getTarjetas() {
        return this._tarjetas;
    }

    addPizarra(pizarra) {
        this._pizarras.push(pizarra);
        localStorage.setItem("pizarras", JSON.stringify(this._pizarras));
    }

    addTarjeta(tarjeta) {
        this._tarjetas.push(tarjeta);
        localStorage.setItem("tarjetas", JSON.stringify(this._tarjetas)); 
    }
}

export const store = new Store();
window.store = store; 