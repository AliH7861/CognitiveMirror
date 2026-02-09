const BaseAgent = require('../core/BaseAgent');

/**
 * TemplateAgent - A boilerplate for creating new agents properly.
 * 
 * Usage:
 * 1. Copy this file.
 * 2. Rename the class and the role.
 * 3. Implement your custom logic in the process() method.
 */
class TemplateAgent extends BaseAgent {
    constructor(name) {
        // 'template-role' allows you to send messages to all agents of this type
        super(name, 'template-role');

        // Example of internal state (memory)
        this.history = [];
    }

    /**
     * The main entry point for message handling.
     * @param {Object} message - The incoming message object
     * @returns {Object|null} - Return an object to send a direct reply to the sender, or null.
     */
    async process(message) {
        try {
            // Keep track of what we've heard
            this.history.push(message);

            // 1. Check if we should handle this message
            if (this.shouldHandle(message)) {
                return await this.executeTask(message);
            }

        } catch (error) {
            console.error(`[${this.name}] Error processing message:`, error);
        }

        return null;
    }

    /**
     * Logic to determine if this agent should respond.
     */
    shouldHandle(message) {
        // Example: Only handle 'task' types directed at our role or generally
        return message.content.type === 'task' || message.content.type === 'template-trigger';
    }

    /**
     * The actual "work" the agent does.
     */
    async executeTask(message) {
        console.log(`[${this.name}] Executing task:`, message.content.body);

        // Simulate some processing...
        const result = `Processed: ${message.content.body}`;

        // Return the result as a direct reply
        return {
            type: 'result',
            body: result,
            status: 'success'
        };
    }
}

module.exports = TemplateAgent;
