# Jira MCP Quick Start

## ⚡ Quick Setup (3 Steps)

### 1. Create `.env` file

```bash
cp .env.example .env
```

Then edit `.env` and replace `your-jira-api-token-here` with your actual token:

```bash
JIRA_API_TOKEN=ATATT3xFfGF0GSZBCErXUsFbOfXqoWN-V81H8FWqmh-Oq9IvXMicdephbx-E69nYJ-02FgAVal_ihuyyPDbPVt90ZI2lVCjpKGMZe-BuUJB0CxpdXaq9_BwSCxeBjfuQFpwjoobJChe2ugI8Yi5bWYNlV733Wi4vo9bLO_awFg3-WcMX2BmoMCI=9D661D8B
```

### 2. Test Connection

```bash
npm run test:jira
```

Or test with a specific issue:
```bash
npm run test:jira PROJ-123
```

### 3. Use in Your Code

```javascript
// Fetch a Jira ticket
const response = await fetch('/api/jira/issue/PROJ-123');
const ticket = await response.json();
```

## 📋 Your Jira Details

- **URL**: https://mdmuzammil18.atlassian.net
- **Email**: md.muzammil18@gmail.com
- **Type**: Cloud
- **Auth**: Basic

## 🎯 Common Tasks

### Get a Ticket
```bash
curl http://localhost:3001/api/jira/issue/PROJ-123
```

### Search Tickets
```bash
curl -X POST http://localhost:3001/api/jira/search \
  -H "Content-Type: application/json" \
  -d '{"jql": "project = MYPROJECT"}'
```

### Update Status
```bash
curl -X POST http://localhost:3001/api/jira/issue/PROJ-123/transition \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'
```

## 📚 Full Documentation

See `JIRA-MCP-SETUP.md` for complete integration guide.

## ✅ What's Configured

- ✅ MCP config file (`mcp-config.json`)
- ✅ Environment variables (`.env.example`)
- ✅ Test script (`test-jira-mcp.js`)
- ✅ Your Jira credentials ready to use

## 🚀 Next Steps

1. Create `.env` file with your token
2. Run `npm run test:jira` to verify
3. Start building your Jira integration!
