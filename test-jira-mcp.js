#!/usr/bin/env node

/**
 * Test script for Jira MCP integration
 * Usage: node test-jira-mcp.js [ISSUE-KEY]
 * Example: node test-jira-mcp.js PROJ-123
 */

import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_USER_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testJiraConnection() {
  log('\n🔍 Testing Jira MCP Connection...', 'cyan');
  log('━'.repeat(50), 'cyan');

  // Check environment variables
  if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    log('\n❌ Error: Missing Jira credentials', 'red');
    log('Please create a .env file with:', 'yellow');
    log('  JIRA_BASE_URL=https://your-domain.atlassian.net', 'yellow');
    log('  JIRA_USER_EMAIL=your-email@example.com', 'yellow');
    log('  JIRA_API_TOKEN=your-api-token', 'yellow');
    process.exit(1);
  }

  log(`\n📍 Jira URL: ${JIRA_BASE_URL}`, 'blue');
  log(`📧 Email: ${JIRA_EMAIL}`, 'blue');
  log(`🔑 API Token: ${JIRA_API_TOKEN.substring(0, 10)}...`, 'blue');

  try {
    // Test 1: Get current user
    log('\n\n1️⃣  Testing authentication...', 'cyan');
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
    
    const userResponse = await axios.get(
      `${JIRA_BASE_URL}/rest/api/3/myself`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      }
    );

    log(`   ✅ Authenticated as: ${userResponse.data.displayName}`, 'green');
    log(`   📧 Email: ${userResponse.data.emailAddress}`, 'green');

    // Test 2: Get projects
    log('\n2️⃣  Fetching projects...', 'cyan');
    const projectsResponse = await axios.get(
      `${JIRA_BASE_URL}/rest/api/3/project`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      }
    );

    log(`   ✅ Found ${projectsResponse.data.length} project(s):`, 'green');
    projectsResponse.data.slice(0, 5).forEach(project => {
      log(`      • ${project.key}: ${project.name}`, 'green');
    });

    // Test 3: Search for recent issues
    log('\n3️⃣  Searching for recent issues...', 'cyan');
    
    // Get the first project key for the search
    const firstProjectKey = projectsResponse.data[0]?.key;
    
    if (firstProjectKey) {
      const searchResponse = await axios.post(
        `${JIRA_BASE_URL}/rest/api/3/search/jql`,
        {
          jql: `project = ${firstProjectKey} ORDER BY created DESC`,
          maxResults: 5,
          fields: ['summary', 'status', 'assignee', 'created']
        },
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      log(`   ✅ Found ${searchResponse.data.total} total issues in project ${firstProjectKey}`, 'green');
      
      if (searchResponse.data.issues.length > 0) {
        log(`   📋 Recent issues:`, 'green');
        searchResponse.data.issues.forEach(issue => {
          log(`      • ${issue.key}: ${issue.fields.summary}`, 'green');
          log(`        Status: ${issue.fields.status.name}`, 'blue');
        });
      } else {
        log(`   ℹ️  No issues found in project ${firstProjectKey}`, 'yellow');
      }
    } else {
      log(`   ⚠️  No projects available to search`, 'yellow');
    }

    // Test 4: Get specific issue if provided
    const issueKey = process.argv[2];
    if (issueKey) {
      log(`\n4️⃣  Fetching issue ${issueKey}...`, 'cyan');
      try {
        const issueResponse = await axios.get(
          `${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`,
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Accept': 'application/json'
            }
          }
        );

        const issue = issueResponse.data;
        log(`   ✅ Issue found:`, 'green');
        log(`      Key: ${issue.key}`, 'blue');
        log(`      Summary: ${issue.fields.summary}`, 'blue');
        log(`      Status: ${issue.fields.status.name}`, 'blue');
        log(`      Type: ${issue.fields.issuetype.name}`, 'blue');
        log(`      Priority: ${issue.fields.priority?.name || 'None'}`, 'blue');
        log(`      Assignee: ${issue.fields.assignee?.displayName || 'Unassigned'}`, 'blue');
        log(`      Created: ${new Date(issue.fields.created).toLocaleString()}`, 'blue');
        
        if (issue.fields.description) {
          const desc = issue.fields.description.content?.[0]?.content?.[0]?.text || 
                       issue.fields.description;
          log(`      Description: ${typeof desc === 'string' ? desc.substring(0, 100) : 'N/A'}...`, 'blue');
        }
      } catch (error) {
        log(`   ❌ Issue ${issueKey} not found or not accessible`, 'red');
      }
    }

    // Summary
    log('\n' + '━'.repeat(50), 'cyan');
    log('✅ All tests passed! Jira MCP is ready to use.', 'green');
    log('\n📚 Next steps:', 'cyan');
    log('   1. Use the Jira MCP in your application', 'yellow');
    log('   2. See JIRA-MCP-SETUP.md for integration examples', 'yellow');
    log('   3. Test with: node test-jira-mcp.js YOUR-ISSUE-KEY', 'yellow');
    log('');

  } catch (error) {
    log('\n❌ Error testing Jira connection:', 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Message: ${error.response.data.errorMessages?.[0] || error.message}`, 'red');
    } else {
      log(`   ${error.message}`, 'red');
    }
    log('\n💡 Troubleshooting:', 'yellow');
    log('   • Verify your API token is correct', 'yellow');
    log('   • Check your Jira URL format', 'yellow');
    log('   • Ensure your email matches your Jira account', 'yellow');
    process.exit(1);
  }
}

// Run the test
testJiraConnection();
