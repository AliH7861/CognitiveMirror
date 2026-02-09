const MessageBus = require('./MessageBus');

class BaseAgent {
    constructor(name, role) {
        this.name = name;
        this.role = role;
        this.id = Math.random().toString(36).substring(7);

        // Auto-subscribe to personal messages and role-based messages
        MessageBus.subscribe(`agent.${this.id}`, (msg) => this.handleMessage(msg));
        MessageBus.subscribe(`role.${this.role}`, (msg) => this.handleMessage(msg));
        MessageBus.subscribe('broadcast', (msg) => this.handleMessage(msg));
    }

    async handleMessage(message) {
        console.log(`[${this.name}] received:`, message);
        if (message.from === this.id) return; // Don't process own messages

        const response = await this.process(message);
        if (response) {
            this.sendMessage(message.from, response);
        }
    }

    async process(message) {
        // Override in subclasses
        return null;
    }

    sendMessage(to, content) {
        MessageBus.publish(`agent.${to}`, {
            from: this.id,
            fromName: this.name,
            content: content,
            timestamp: Date.now()
        });
    }

    broadcast(content) {
        MessageBus.publish('broadcast', {
            from: this.id,
            fromName: this.name,
            content: content,
            timestamp: Date.now()
        });
    }
}

module.exports = BaseAgent;
