const Orchestrator = require('./src/core/Orchestrator');
const ResearchAgent = require('./src/agents/ResearchAgent');
const CodingAgent = require('./src/agents/CodingAgent');

// 1. Initialize Agents
const researcher = new ResearchAgent('Dr. Find');
const coder = new CodingAgent('Bitsy');

// 2. Register Agents with Orchestrator
Orchestrator.registerAgent(researcher);
Orchestrator.registerAgent(coder);

// 3. Simulating a multi-agent workflow
console.log('\n--- Starting Multi-Agent Workflow ---\n');

Orchestrator.assignTask('research the benefits of multi-agent systems');

// We wait a bit to let messages flow (normally this would be event-driven/async)
setTimeout(() => {
    console.log('\n--- Workflow Simulation Complete ---\n');
}, 5000);
