# Jira MCP Integration Guide

## Overview

This guide explains how to use the Jira MCP (Model Context Protocol) server to fetch and manage Jira tickets in your ShopHub e-commerce project.

## ✅ Configuration Complete

Your Jira MCP is already configured with the following details:

- **Jira URL**: https://mdmuzammil18.atlassian.net
- **Email**: md.muzammil18@gmail.com
- **Type**: Cloud
- **Auth Type**: Basic

## 📁 Configuration Files

### 1. MCP Configuration (`mcp-config.json`)

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-jira"],
      "env": {
        "JIRA_URL": "https://mdmuzammil18.atlassian.net",
        "JIRA_EMAIL": "md.muzammil18@gmail.com",
        "JIRA_API_TOKEN": "your-token",
        "JIRA_TYPE": "cloud",
        "JIRA_AUTH_TYPE": "basic"
      }
    }
  }
}
```

### 2. Environment Variables (`.env`)

Create a `.env` file (not tracked in git):

```bash
# Server Configuration
PORT=3001

# Jira Configuration
JIRA_BASE_URL=https://mdmuzammil18.atlassian.net
JIRA_USER_EMAIL=md.muzammil18@gmail.com
JIRA_API_TOKEN=ATATT3xFfGF0GSZBCErXUsFbOfXqoWN-V81H8FWqmh-Oq9IvXMicdephbx-E69nYJ-02FgAVal_ihuyyPDbPVt90ZI2lVCjpKGMZe-BuUJB0CxpdXaq9_BwSCxeBjfuQFpwjoobJChe2ugI8Yi5bWYNlV733Wi4vo9bLO_awFg3-WcMX2BmoMCI=9D661D8B
JIRA_TYPE=cloud
JIRA_AUTH_TYPE=basic
```

## 🚀 Installation

### 1. Install MCP Server

```bash
npm install -g @modelcontextprotocol/server-jira
```

Or use npx (no installation needed):
```bash
npx @modelcontextprotocol/server-jira
```

### 2. Test Connection

```bash
# Test if MCP server can connect to Jira
npx @modelcontextprotocol/server-jira --test
```

## 📋 Using Jira MCP

### Available MCP Tools

The Jira MCP server provides these tools:

1. **jira_search_issues** - Search for Jira issues
2. **jira_get_issue** - Get details of a specific issue
3. **jira_create_issue** - Create a new issue
4. **jira_update_issue** - Update an existing issue
5. **jira_add_comment** - Add comment to an issue
6. **jira_get_projects** - List all projects
7. **jira_get_transitions** - Get available transitions for an issue
8. **jira_transition_issue** - Transition an issue to a new status

### Example Usage in Code

#### Fetch a Jira Ticket

```javascript
// backend/services/jiraMCP.js
import { MCPClient } from '@modelcontextprotocol/sdk';

const mcpClient = new MCPClient({
  serverUrl: 'http://localhost:3000', // MCP server URL
  config: {
    jira: {
      url: process.env.JIRA_BASE_URL,
      email: process.env.JIRA_USER_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN
    }
  }
});

// Get a specific issue
export async function getJiraIssue(issueKey) {
  try {
    const result = await mcpClient.callTool('jira_get_issue', {
      issueKey: issueKey
    });
    
    return {
      key: result.key,
      summary: result.fields.summary,
      description: result.fields.description,
      status: result.fields.status.name,
      assignee: result.fields.assignee?.displayName,
      priority: result.fields.priority?.name,
      created: result.fields.created,
      updated: result.fields.updated
    };
  } catch (error) {
    console.error('Error fetching Jira issue:', error);
    throw error;
  }
}

// Search for issues
export async function searchJiraIssues(jql) {
  try {
    const result = await mcpClient.callTool('jira_search_issues', {
      jql: jql,
      maxResults: 50
    });
    
    return result.issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee?.displayName
    }));
  } catch (error) {
    console.error('Error searching Jira issues:', error);
    throw error;
  }
}

// Update issue status
export async function updateJiraIssueStatus(issueKey, transitionName) {
  try {
    // First, get available transitions
    const transitions = await mcpClient.callTool('jira_get_transitions', {
      issueKey: issueKey
    });
    
    // Find the transition ID
    const transition = transitions.find(t => 
      t.name.toLowerCase() === transitionName.toLowerCase()
    );
    
    if (!transition) {
      throw new Error(`Transition "${transitionName}" not found`);
    }
    
    // Execute the transition
    await mcpClient.callTool('jira_transition_issue', {
      issueKey: issueKey,
      transitionId: transition.id
    });
    
    return { success: true, message: `Issue ${issueKey} moved to ${transitionName}` };
  } catch (error) {
    console.error('Error updating Jira issue:', error);
    throw error;
  }
}
```

### Example API Routes

```javascript
// backend/routes/jira.js
import express from 'express';
import { getJiraIssue, searchJiraIssues, updateJiraIssueStatus } from '../services/jiraMCP.js';

const router = express.Router();

// Get a specific issue
router.get('/issue/:key', async (req, res) => {
  try {
    const issue = await getJiraIssue(req.params.key);
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search issues
router.post('/search', async (req, res) => {
  try {
    const { jql } = req.body;
    const issues = await searchJiraIssues(jql);
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update issue status
router.post('/issue/:key/transition', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await updateJiraIssueStatus(req.params.key, status);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

## 🎯 Common JQL Queries

### Search for Open Issues
```javascript
const jql = 'project = MYPROJECT AND status = "To Do"';
const issues = await searchJiraIssues(jql);
```

### Search by Assignee
```javascript
const jql = 'assignee = currentUser() AND status != Done';
const issues = await searchJiraIssues(jql);
```

### Search Recent Issues
```javascript
const jql = 'created >= -7d ORDER BY created DESC';
const issues = await searchJiraIssues(jql);
```

### Search by Priority
```javascript
const jql = 'priority = High AND status = "In Progress"';
const issues = await searchJiraIssues(jql);
```

## 🔧 Integration with Copilot Automation

### Workflow: Jira Ticket → Code Generation → PR

```javascript
// Example workflow automation
async function automateFeatureFromJira(issueKey) {
  // 1. Fetch Jira ticket
  const issue = await getJiraIssue(issueKey);
  console.log(`Processing: ${issue.summary}`);
  
  // 2. Generate code using AI/Copilot
  const generatedCode = await generateCodeFromTicket(issue);
  
  // 3. Create branch and commit
  await createBranchAndCommit(issueKey, generatedCode);
  
  // 4. Create Pull Request
  const pr = await createPullRequest(issueKey, issue.summary);
  
  // 5. Update Jira ticket status
  await updateJiraIssueStatus(issueKey, 'In Review');
  
  // 6. Add comment with PR link
  await mcpClient.callTool('jira_add_comment', {
    issueKey: issueKey,
    comment: `Pull Request created: ${pr.url}`
  });
  
  return {
    issue: issueKey,
    pr: pr.url,
    status: 'In Review'
  };
}
```

## 📊 Frontend Integration

### React Component to Display Jira Tickets

```jsx
import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, Clock } from 'lucide-react';

export default function JiraTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/jira/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jql: 'project = MYPROJECT ORDER BY created DESC'
        })
      });
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading tickets...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Jira Tickets</h2>
      {tickets.map(ticket => (
        <div key={ticket.key} className="card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{ticket.key}</h3>
              <p className="text-gray-700">{ticket.summary}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  ticket.status === 'Done' ? 'bg-green-100 text-green-700' :
                  ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {ticket.status}
                </span>
                {ticket.assignee && (
                  <span className="text-sm text-gray-600">
                    Assigned to: {ticket.assignee}
                  </span>
                )}
              </div>
            </div>
            <a
              href={`https://mdmuzammil18.atlassian.net/browse/${ticket.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 🔐 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Rotate API tokens regularly** - Generate new tokens every 90 days
3. **Use environment variables** - Never hardcode credentials
4. **Limit token permissions** - Only grant necessary Jira permissions
5. **Monitor API usage** - Check Jira API rate limits

## 🐛 Troubleshooting

### Issue: "Authentication failed"
**Solution**: Verify your API token is correct and hasn't expired

### Issue: "Issue not found"
**Solution**: Check the issue key format (e.g., PROJ-123) and permissions

### Issue: "Rate limit exceeded"
**Solution**: Implement caching or reduce API call frequency

### Issue: "MCP server not responding"
**Solution**: Restart the MCP server or check network connectivity

## 📚 Additional Resources

- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Jira API Token Management](https://id.atlassian.com/manage-profile/security/api-tokens)

## 🎯 Next Steps

1. ✅ Configuration complete
2. Create `.env` file with your credentials
3. Test the MCP connection
4. Implement ticket fetching in your app
5. Build automation workflows
6. Integrate with GitHub for PR creation

---

**Your Jira MCP is ready to use!** 🚀
