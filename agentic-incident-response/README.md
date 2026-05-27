# Agentic Incident Response on AWS

AI agents that detect, investigate, and respond to infrastructure incidents.
Built with Strands Agents SDK, OpenSearch 3.5, CloudWatch, and Amazon Nova 2 Lite.

## Get Running in 2 Minutes

**Prerequisites:** Node.js 22+, Docker, AWS CLI configured

```bash
# Clone and install
git clone <repo>
cd agentic-incident-response
npm install
cp .env.example .env

# Start OpenSearch and seed historical incidents
./run.sh setup

# Test search works (no AWS needed)
./run.sh test-local
```

## Connect to AWS

```bash
# Enable Nova 2 Lite in Bedrock console first
# https://console.aws.amazon.com/bedrock/home?region=ap-southeast-1#/modelaccess

# Create demo alarms
./run.sh create-alarms

# Trigger a CPU alarm and run agents
./run.sh simulate cpu
./run.sh demo
```

## Demo Scenarios

| Command | What Happens | Agent Decision |
|---------|-------------|----------------|
| `./run.sh simulate cpu` | Monday CPU spike | AUTO-SUPPRESS (known batch job) |
| `./run.sh simulate latency` | Midnight API latency | NOTIFY (known CDN cache pattern) |
| `./run.sh simulate database` | DB connection exhaustion | ESCALATE (needs human) |
