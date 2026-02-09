const BaseAgent = require('../core/BaseAgent');

class ResearchAgent extends BaseAgent {
    constructor(name) {
        super(name, 'researcher');
    }

    async process(message) {
        if (message.content.type === 'task' && message.content.body.includes('research')) {
            console.log(`[${this.name}] Starting research on: ${message.content.body}`);

            // Simulate research work
            return {
                type: 'report',
                body: `Research findings for: ${message.content.body}. Observed multiple AI agents interacting in a virtual environment.`
            };
        }
        return null;
    }
}

module.exports = ResearchAgent;
