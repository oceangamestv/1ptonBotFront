import {createApp, Directive, DirectiveBinding} from 'vue'
import './style.css'
import router from './plugins/router'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

interface HTMLElement {
    event?: (event: Event) => void;
    stopProp?: (event: Event) => void;
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void;
    removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void;
}

const clickOutsideDirective: Directive<HTMLElement, any> = {
    beforeMount(el: HTMLElement, binding: DirectiveBinding) {
        el.stopProp = (event: Event) => event.stopPropagation();

        el.event = (event: Event) => {
            if (binding.value && typeof binding.value === 'function') {
                binding.value(event);
            }
        };

        el.addEventListener('click', el.stopProp);
        document.body.addEventListener('click', el.event);
    },
    unmounted(el: HTMLElement) {
        if (el.stopProp) {
            el.removeEventListener('click', el.stopProp);
        }
        if (el.event) {
            document.body.removeEventListener('click', el.event);
        }
    },
};

app.directive('click-outside', clickOutsideDirective);
app.use(pinia).use(router).mount('#app')
