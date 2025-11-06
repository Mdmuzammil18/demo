# GitHub MCP Integration - Simplified Guide

## Overview

This project uses **GitHub MCP (Model Context Protocol)** for all GitHub operations. No direct API calls - everything goes through MCP for simplicity and AI integration.

## 🎯 Why MCP Only?

- ✅ **Simpler** - One integration approach
- ✅ **AI-Ready** - Built for AI/Copilot workflows  
- ✅ **Consistent** - Same pattern as Jira MCP
- ✅ **Less Code** - Fewer files to maintain

## 🔧 Setup

### 1. Install GitHub CLI

```bash
# macOS
brew install gh

# Or download from: https://cli.github.com
```

### 2. Authenticate

```bash
gh auth login
```

Follow the prompts to authenticate with your GitHub account.

### 3. Add to `.env`

```bash
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_OWNER=Mdmuzammil18
GITHUB_REPO=your-repo-name
```

### 4. Test

```bash
npm run test:github
```

## 📚 Usage

### Import the Service

```javascript
import githubMCP from './backend/services/githubMCP.js';
```

### Available Methods

#### Get User
```javascript
const result = await githubMCP.getUser();
// Returns: { success: true, user: { login, name, email } }
```

#### List Repositories
```javascript
const result = await githubMCP.listRepos(10);
// Returns: { success: true, repos: [...] }
```

#### Get Repository
```javascript
const result = await githubMCP.getRepo('owner', 'repo');
// Returns: { success: true, repo: { name, description, url } }
```

#### Create Branch
```javascript
const result = await githubMCP.createBranch('feature/new-feature', 'main');
// Returns: { success: true, branch: 'feature/new-feature' }
```

#### Create File
```javascript
const result = await githubMCP.createFile(
  'src/component.jsx',
  'export default function Component() {...}',
  'feat: add component',
  'feature/new-feature'
);
// Returns: { success: true, file: 'src/component.jsx' }
```

#### Create Pull Request
```javascript
const result = await githubMCP.createPR(
  'Add new feature',
  'This PR adds...',
  'feature/new-feature',
  'main'
);
// Returns: { success: true, pr: { url: '...' } }
```

#### List Pull Requests
```javascript
const result = await githubMCP.listPRs('open', 10);
// Returns: { success: true, prs: [...] }
```

#### Get Pull Request
```javascript
const result = await githubMCP.getPR(123);
// Returns: { success: true, pr: { number, title, body, ... } }
```

#### Add PR Comment
```javascript
const result = await githubMCP.addPRComment(123, 'Looks good!');
// Returns: { success: true }
```

#### Complete Workflow
```javascript
const result = await githubMCP.createFeaturePR(
  'search',
  'src/components/Search.jsx',
  'export default function Search() {...}',
  'Add search feature',
  'Implements search functionality'
);
// Returns: { success: true, branch, file, pr }
```

## 🌐 API Endpoints

All routes use GitHub MCP under the hood:

- `GET /api/github/user` - Get authenticated user
- `GET /api/github/repos` - List repositories
- `GET /api/github/repo` - Get repository info
- `POST /api/github/branch` - Create branch
- `POST /api/github/file` - Create/update file
- `POST /api/github/pr` - Create pull request
- `GET /api/github/prs` - List pull requests
- `GET /api/github/pr/:number` - Get PR details
- `POST /api/github/pr/:number/comment` - Add comment
- `POST /api/github/feature-pr` - Complete workflow

## 🔄 Jira + GitHub Automation

### Complete Workflow Example

```javascript
import githubMCP from './backend/services/githubMCP.js';
import { getJiraIssue, updateJiraIssueStatus } from './backend/services/jiraMCP.js';

async function automateFeature(issueKey) {
  // 1. Fetch Jira ticket
  const issue = await getJiraIssue(issueKey);
  
  // 2. Generate code (AI/Copilot)
  const code = generateCode(issue);
  
  // 3. Create feature PR via MCP
  const result = await githubMCP.createFeaturePR(
    issueKey.toLowerCase(),
    `src/features/${issueKey}.jsx`,
    code,
    `[${issueKey}] ${issue.summary}`,
    `Implements: ${issue.summary}`
  );
  
  // 4. Update Jira
  await updateJiraIssueStatus(issueKey, 'In Review');
  
  return result;
}
```

## 🧪 Testing

### Test Connection
```bash
npm run test:github
```

### Test via API
```bash
# Get user
curl http://localhost:3001/api/github/user

# List repos
curl http://localhost:3001/api/github/repos

# Create feature PR
curl -X POST http://localhost:3001/api/github/feature-pr \
  -H "Content-Type: application/json" \
  -d '{
    "featureName": "test",
    "fileName": "test.js",
    "fileContent": "console.log(\"test\");",
    "prTitle": "Test PR"
  }'
```

## 🔐 Security

- ✅ `.env` in `.gitignore`
- ✅ GitHub CLI handles authentication
- ✅ Token stored securely
- ✅ No hardcoded credentials

## 🐛 Troubleshooting

### "gh: command not found"
**Solution**: Install GitHub CLI
```bash
brew install gh
```

### "authentication required"
**Solution**: Authenticate with GitHub CLI
```bash
gh auth login
```

### "repository not found"
**Solution**: Check GITHUB_OWNER and GITHUB_REPO in `.env`

## 📊 MCP Configuration

Your `mcp-config.json` is already configured:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

## ✅ Quick Reference

```bash
# Setup
brew install gh
gh auth login
npm run test:github

# Use in code
import githubMCP from './backend/services/githubMCP.js';
const result = await githubMCP.createPR(...);

# API
curl http://localhost:3001/api/github/user
```

---

**Simple, clean, MCP-only GitHub integration!** 🚀
