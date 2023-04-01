
/**
 * Forwards events to all registered listeners
 */
export default class Announcer {
    constructor() {
        this.listeners = [];
        this.eventHandlers = [];
    }

    registerListener(listener, handler) {
        if (this.listeners.map(l => l.listener).indexOf(listener) < 0) {
            this.listeners.push({ listener: listener, handler: handler.bind(listener) });
        }
    }

    registerEventHandler(name, eventHandler) {
        this.eventHandlers.push({ name: name, handler: eventHandler });
    }

    announce(source, evt, msg) {
        if (!(evt instanceof LayoutEvent)) {
            evt = new LayoutEvent(evt);
        }

        this.listeners.forEach(l => {
            if ((l.listener !== source) && l.handler) {
                l.handler(source, evt, msg);
            }
        });

        this.eventHandlers.forEach(eh => {
            if (source !== eh.name) {
                eh.handler(source, evt, msg);
            }
        });
    }
}

export class LayoutEvent {

    constructor() {
        this.eventTypes = [];
        for (var i = 0; i < arguments.length; i++) {
            let arg = arguments[i];
            if (arg instanceof Array) {
                this.eventTypes = [...this.eventTypes, ...arg];
            }
            else {
                this.eventTypes.push(arg);
            }
        }
    }

    is(eventType) {
        return this.eventTypes.includes(eventType);
    }

}