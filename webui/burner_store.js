import { createStore } from "/js/AlpineStore.js";
import { toastFrontendSuccess, toastFrontendError } from "/components/notifications/notification-store.js";

export const store = createStore("burnerStore", {
    items: { front: [], back: [] },
    newFrontText: '',
    newBackText: '',
    loaded: false,

    init() {
        // Called automatically by Alpine when store is registered
    },

    async onOpen() {
        // Called when modal opens via x-init
        await this.fetchItems();
    },

    cleanup() {
        // Called when modal closes via x-destroy
        this.newFrontText = '';
        this.newBackText = '';
    },

    async fetchItems() {
        try {
            const response = await fetch('/api/burner_items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get' })
            });
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            this.items = data.items ? data.items : data;
            this.loaded = true;
        } catch (e) {
            toastFrontendError("Failed to load burner items.", "Front & Back Burner");
        }
    },

    async save() {
        try {
            const response = await fetch('/api/burner_items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'save', items: this.items })
            });
            if (!response.ok) throw new Error('Failed to save');
        } catch (e) {
            toastFrontendError("Failed to save burner items.", "Front & Back Burner");
        }
    },

    addFront() {
        if (this.newFrontText.trim()) {
            this.items.front.push(this.newFrontText.trim());
            this.newFrontText = '';
            this.save();
        }
    },

    addBack() {
        if (this.newBackText.trim()) {
            this.items.back.push(this.newBackText.trim());
            this.newBackText = '';
            this.save();
        }
    },

    removeFront(index) {
        this.items.front.splice(index, 1);
        this.save();
    },

    removeBack(index) {
        this.items.back.splice(index, 1);
        this.save();
    },

    moveToBack(index) {
        const item = this.items.front.splice(index, 1)[0];
        this.items.back.push(item);
        this.save();
    },

    moveToFront(index) {
        const item = this.items.back.splice(index, 1)[0];
        this.items.front.push(item);
        this.save();
    }
});
