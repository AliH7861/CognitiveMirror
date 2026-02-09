const BaseAgent = require('../core/BaseAgent');

class CodingAgent extends BaseAgent {
    constructor(name) {
        super(name, 'coder');
    }

    async process(message) {
        if (message.content.type === 'report') {
            console.log(`[${this.name}] Received research report. Writing code based on findings...`);

            this.broadcast({
                type: 'code',
                body: `// Code based on ${message.fromName}'s report\nconsole.log("Multi-agent system operational");`
            });
            return null;
        }

        if (message.content.type === 'task' && message.content.body.includes('code')) {
            return {
                type: 'code',
                body: 'function helloWorld() { return "Hello from Coding Agent"; }'
            };
        }
        return null;
    }
}

module.exports = CodingAgent;
