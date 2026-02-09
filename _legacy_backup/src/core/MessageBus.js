class MessageBus {
  constructor() {
    this.subscribers = new Map();
  }

  subscribe(topic, callback) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic).push(callback);
    console.log(`[MessageBus] New subscriber for topic: ${topic}`);
  }

  publish(topic, message) {
    console.log(`[MessageBus] Publishing to ${topic}:`, message);
    if (!this.subscribers.has(topic)) return;
    this.subscribers.get(topic).forEach(callback => callback(message));
  }
}

module.exports = new MessageBus();
