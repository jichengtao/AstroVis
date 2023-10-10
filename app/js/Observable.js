export default class Observable {
    constructor() {
        this.observers = new Map();
        // this.observer=[];
    }

    addObserver(label, callback) {
        this.observers.has(label) || this.observers.set(label, []);
        this.observers.get(label).push(callback);
    }

    emit(label, e) {
        const observers = this.observers.get(label);

        if (observers && observers.length) {
            observers.forEach((callback) => {
                callback(e);
            });
        }
    }

    notifyObservers(value) {
        this.observers.forEach((observer) => observer.update(value));
      }

   
}