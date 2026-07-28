# Agentic Incident Response on AWS

This repository contains the demo project from my AWS Community Builder session.

The project shows how AI agents can work together to investigate CloudWatch alarms, search historical incidents in OpenSearch, and use Amazon Bedrock to recommend the next action.

Instead of sending every alert directly to engineers, the agents collaborate to determine whether an incident is already known, requires attention, or should be escalated.

## Architecture

CloudWatch Alarm

↓

Detective Agent

↓

Investigator Agent

↓

OpenSearch

↓

Amazon Bedrock

↓

Recommendation

- Suppress
- Notify
- Escalate

## What You'll Learn

This project demonstrates how to:

- Build AI agents using the Strands Agents SDK
- Connect agents to Amazon Bedrock
- Search historical incidents with OpenSearch
- Process CloudWatch alarms
- Create a simple multi-agent workflow

## Project Structure

```
src/
├── agents/
├── cloudwatch/
├── opensearch/
├── search/
├── run-demo.ts
└── watch-demo.ts

docker-compose.yml
run.sh
```

## Prerequisites

Before getting started, you'll need:

- Node.js 22 or later
- Docker
- AWS CLI configured
- Access to Amazon Bedrock

## Installation

Clone the repository.

```bash
git clone https://github.com/the-incident-guy/aws-community-builder-may-2026-sg.git

cd aws-community-builder-may-2026-sg
```

Install dependencies.

```bash
npm install
```

Create your environment file.

```bash
cp .env.example .env
```

## Start OpenSearch

```bash
./run.sh setup
```

## Run the Demo

```bash
./run.sh demo
```

The demo will:

1. Read a CloudWatch alarm.
2. Collect incident details.
3. Search similar incidents.
4. Ask Amazon Bedrock for recommendations.
5. Return the suggested response.

## Demo Commands

```bash
./run.sh setup
./run.sh test-local
./run.sh create-alarms
./run.sh simulate cpu
./run.sh simulate latency
./run.sh simulate database
./run.sh demo
```

## Future Ideas

This project can be extended with:

- Slack notifications
- Amazon EventBridge
- AWS Lambda
- Amazon Q
- Jira integration
- PagerDuty integration
- Automatic remediation

## Contributing

Issues and pull requests are welcome.

## License

MIT
