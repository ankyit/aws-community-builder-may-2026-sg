#!/bin/bash
case "${1:-help}" in
  setup)
    docker compose up -d
    echo "Waiting for OpenSearch 3.5..."
    npm run wait
    npm run setup-index
    npm run seed
    echo "Done. Dashboards: http://localhost:5601 (admin / Demo@Strong1Pass)"
    ;;
  test-local)    npm run test-local ;;
  test-cw)       npm run test-cw ;;
  create-alarms) npm run create-alarms ;;
  simulate)      npm run simulate -- "${2:-cpu}" ;;
  demo)          npm run demo ;;
  watch)         npm run watch ;;
  stop)          docker compose down ;;
  clean)         docker compose down -v ;;
  *)
    echo "Usage: ./run.sh <setup|test-local|test-cw|create-alarms|simulate|demo|stop|clean>"
    echo ""
    echo "  setup          Start OpenSearch 3.5, create index, seed incidents"
    echo "  test-local     Test OpenSearch search (no AWS needed)"
    echo "  test-cw        Test CloudWatch connector (needs AWS credentials)"
    echo "  create-alarms  Create 3 demo alarms in AWS account"
    echo "  simulate TYPE  Simulate alarm: cpu, latency, or database"
    echo "  demo           Run full Strands agent loop"
    echo "  stop           Stop OpenSearch"
    echo "  clean          Stop and delete all data"
    ;;
esac
