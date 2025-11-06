#!/usr/bin/env node

/**
 * Test script for GitHub MCP integration
 * Usage: node test-github-mcp.js
 */

import githubMCP from './backend/services/githubMCP.js';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testGitHubMCP() {
  log('\n🔍 Testing GitHub MCP Integration...', 'cyan');
  log('━'.repeat(50), 'cyan');

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;

  // Check environment variables
  if (!GITHUB_TOKEN) {
    log('\n❌ Error: Missing GitHub credentials', 'red');
    log('Please add to .env file:', 'yellow');
    log('  GITHUB_TOKEN=your-personal-access-token', 'yellow');
    log('  GITHUB_OWNER=your-github-username', 'yellow');
    log('  GITHUB_REPO=your-repo-name', 'yellow');
    log('\n💡 Generate token at: https://github.com/settings/tokens', 'yellow');
    log('💡 Install GitHub CLI: brew install gh', 'yellow');
    process.exit(1);
  }

  log(`\n🔑 Token: ${GITHUB_TOKEN.substring(0, 10)}...`, 'cyan');
  log(`👤 Owner: ${GITHUB_OWNER || 'Not set'}`, 'cyan');
  log(`📦 Repo: ${GITHUB_REPO || 'Not set'}`, 'cyan');

  try {
    // Test 1: Get authenticated user
    log('\n\n1️⃣  Testing authentication...', 'cyan');
    const userResult = await githubMCP.getUser();
    
    if (userResult.success) {
      log(`   ✅ Authenticated as: ${userResult.user.login}`, 'green');
      log(`   📧 Email: ${userResult.user.email || 'Not public'}`, 'green');
      log(`   👤 Name: ${userResult.user.name || 'Not set'}`, 'green');
    } else {
      log(`   ❌ Authentication failed: ${userResult.error}`, 'red');
      throw new Error('Authentication failed');
    }

    // Test 2: List repositories
    log('\n2️⃣  Fetching repositories...', 'cyan');
    const reposResult = await githubMCP.listRepos(5);
    
    if (reposResult.success) {
      log(`   ✅ Found ${reposResult.repos.length} repositories:`, 'green');
      reposResult.repos.forEach(repo => {
        log(`      • ${repo.name}`, 'green');
        if (repo.description) {
          log(`        ${repo.description.substring(0, 60)}...`, 'cyan');
        }
      });
    } else {
      log(`   ⚠️  Could not fetch repositories: ${reposResult.error}`, 'yellow');
    }

    // Test 3: Get specific repository (if configured)
    if (GITHUB_OWNER && GITHUB_REPO) {
      log(`\n3️⃣  Fetching repository ${GITHUB_OWNER}/${GITHUB_REPO}...`, 'cyan');
      const repoResult = await githubMCP.getRepo(GITHUB_OWNER, GITHUB_REPO);
      
      if (repoResult.success) {
        log(`   ✅ Repository found:`, 'green');
        log(`      Name: ${repoResult.repo.name}`, 'cyan');
        log(`      Description: ${repoResult.repo.description || 'No description'}`, 'cyan');
        log(`      URL: ${repoResult.repo.url}`, 'cyan');
      } else {
        log(`   ⚠️  Repository not found: ${repoResult.error}`, 'yellow');
      }

      // Test 4: List Pull Requests
      log(`\n4️⃣  Fetching pull requests...`, 'cyan');
      const prsResult = await githubMCP.listPRs('all', 5);
      
      if (prsResult.success) {
        if (prsResult.prs.length > 0) {
          log(`   ✅ Found ${prsResult.prs.length} pull request(s):`, 'green');
          prsResult.prs.forEach(pr => {
            const stateIcon = pr.state === 'OPEN' ? '🟢' : pr.state === 'CLOSED' ? '🔴' : '🟣';
            log(`      ${stateIcon} #${pr.number}: ${pr.title}`, 'green');
          });
        } else {
          log(`   ℹ️  No pull requests found`, 'yellow');
        }
      } else {
        log(`   ⚠️  Could not fetch PRs: ${prsResult.error}`, 'yellow');
      }
    } else {
      log(`\n⚠️  Skipping repository tests (GITHUB_OWNER and GITHUB_REPO not set)`, 'yellow');
    }

    // Summary
    log('\n' + '━'.repeat(50), 'cyan');
    log('✅ All tests passed! GitHub MCP is ready.', 'green');
    log('\n📚 Next steps:', 'cyan');
    log('   1. Set GITHUB_OWNER and GITHUB_REPO in .env', 'yellow');
    log('   2. Use GitHub MCP in your application', 'yellow');
    log('   3. See GITHUB-MCP-SETUP.md for examples', 'yellow');
    log('');

  } catch (error) {
    log('\n❌ Error testing GitHub MCP:', 'red');
    log(`   ${error.message}`, 'red');
    log('\n💡 Troubleshooting:', 'yellow');
    log('   • Install GitHub CLI: brew install gh', 'yellow');
    log('   • Authenticate: gh auth login', 'yellow');
    log('   • Verify token: gh auth status', 'yellow');
    process.exit(1);
  }
}

// Run the test
testGitHubMCP();
