const MessageBus = require('./MessageBus');

class Orchestrator {
    constructor() {
        this.agents = new Map();
        console.log('[Orchestrator] Initialized');
    }

    registerAgent(agent) {
        this.agents.set(agent.id, agent);
        console.log(`[Orchestrator] Registered agent: ${agent.name} (${agent.role})`);
    }

    assignTask(taskDescription) {
        console.log(`[Orchestrator] Assigning task: ${taskDescription}`);
        MessageBus.publish('broadcast', {
            from: 'orchestrator',
            fromName: 'System Orchestrator',
            content: {
                type: 'task',
                body: taskDescription
            },
            timestamp: Date.now()
        });
    }
}

module.exports = new Orchestrator();
