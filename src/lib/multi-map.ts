export class MultiMap<key1, key2, value> {
    private data = new Map<key1, Map<key2, value>>();


    get(k1: key1, k2: key2) {
        if (this.data.has(k1)) {
            return this.data.get(k1).get(k2);
        }
    }

    set(k1: key1, k2: key2, val: value) {
        if (!this.data.has(k1)) this.data.set(k1, new Map<key2, value>());
        return this.data.get(k1).set(k2, val);
    }

    delete(k1: key1, k2: key2) {
        if (this.data.has(k1)) this.data.get(k1).delete(k2);
    }

    clear() {
        this.data.clear();   
    }
}