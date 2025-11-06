/**
 * GitHub MCP Service
 * Simple wrapper around GitHub MCP server
 * Uses Model Context Protocol for all GitHub operations
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

/**
 * Execute GitHub CLI command via MCP
 */
async function executeGitHubCLI(command) {
  try {
    const { stdout, stderr } = await execAsync(command, {
      env: {
        ...process.env,
        GITHUB_TOKEN,
        GH_TOKEN: GITHUB_TOKEN
      }
    });
    
    if (stderr && !stderr.includes('warning')) {
      console.error('GitHub CLI stderr:', stderr);
    }
    
    return {
      success: true,
      output: stdout.trim()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get authenticated user
 */
export async function getUser() {
  const result = await executeGitHubCLI('gh api user');
  
  if (result.success) {
    const user = JSON.parse(result.output);
    return {
      success: true,
      user: {
        login: user.login,
        name: user.name,
        email: user.email
      }
    };
  }
  
  return result;
}

/**
 * List repositories
 */
export async function listRepos(limit = 10) {
  const result = await executeGitHubCLI(`gh repo list --limit ${limit} --json name,description,url`);
  
  if (result.success) {
    return {
      success: true,
      repos: JSON.parse(result.output)
    };
  }
  
  return result;
}

/**
 * Get repository info
 */
export async function getRepo(owner = GITHUB_OWNER, repo = GITHUB_REPO) {
  const result = await executeGitHubCLI(`gh repo view ${owner}/${repo} --json name,description,url,defaultBranchRef`);
  
  if (result.success) {
    return {
      success: true,
      repo: JSON.parse(result.output)
    };
  }
  
  return result;
}

/**
 * Create a branch
 */
export async function createBranch(branchName, baseBranch = 'main') {
  const repo = `${GITHUB_OWNER}/${GITHUB_REPO}`;
  
  // Get base branch SHA
  const shaResult = await executeGitHubCLI(
    `gh api repos/${repo}/git/ref/heads/${baseBranch} --jq .object.sha`
  );
  
  if (!shaResult.success) {
    return shaResult;
  }
  
  const sha = shaResult.output;
  
  // Create new branch
  const result = await executeGitHubCLI(
    `gh api repos/${repo}/git/refs -f ref=refs/heads/${branchName} -f sha=${sha}`
  );
  
  if (result.success) {
    return {
      success: true,
      branch: branchName
    };
  }
  
  return result;
}

/**
 * Create or update a file
 */
export async function createFile(filePath, content, message, branch) {
  const repo = `${GITHUB_OWNER}/${GITHUB_REPO}`;
  const encodedContent = Buffer.from(content).toString('base64');
  
  // Check if file exists
  const checkResult = await executeGitHubCLI(
    `gh api repos/${repo}/contents/${filePath}?ref=${branch} 2>/dev/null || echo "{}"`
  );
  
  let sha = '';
  if (checkResult.success && checkResult.output !== '{}') {
    try {
      const existing = JSON.parse(checkResult.output);
      sha = existing.sha;
    } catch (e) {
      // File doesn't exist
    }
  }
  
  // Create/update file
  const shaParam = sha ? `-f sha=${sha}` : '';
  const result = await executeGitHubCLI(
    `gh api repos/${repo}/contents/${filePath} -X PUT -f message="${message}" -f content="${encodedContent}" -f branch=${branch} ${shaParam}`
  );
  
  if (result.success) {
    return {
      success: true,
      file: filePath
    };
  }
  
  return result;
}

/**
 * Create a pull request
 */
export async function createPR(title, body, head, base = 'main') {
  const repo = `${GITHUB_OWNER}/${GITHUB_REPO}`;
  
  const result = await executeGitHubCLI(
    `gh pr create --repo ${repo} --title "${title}" --body "${body}" --head ${head} --base ${base}`
  );
  
  if (result.success) {
    // Extract PR URL from output
    const prUrl = result.output.split('\n').find(line => line.includes('https://'));
    return {
      success: true,
      pr: {
        url: prUrl || result.output
      }
    };
  }
  
  return result;
}

/**
 * List pull requests
 */
export async function listPRs(state = 'open', limit = 10) {
  const repo = `${GITHUB_OWNER}/${GITHUB_REPO}`;
  
  const result = await executeGitHubCLI(
    `gh pr list --repo ${repo} --state ${state} --limit ${limit} --json number,title,url,state`
  );
  
  if (result.success) {
    return {
      success: true,
      prs: JSON.parse(result.output)
    };
  }
  
  return result;
}

/**
 * Get pull request details
 */
export async function getPR(prNumber) {
  const repo = `${GITHUB_OWNER}/${GITHUB_REPO}`;
  
  const result = await executeGitHubCLI(
    `gh pr view ${prNumber} --repo ${repo} --json number,title,body,url,state,author`
  );
  
  if (result.success) {
    return {
      success: true,
      pr: JSON.parse(result.output)
    };
  }
  
  return result;
}

/**
 * Add comment to PR
 */
export async function addPRComment(prNumber, comment) {
  const repo = `${GITHUB_OWNER}/${GITHUB_REPO}`;
  
  const result = await executeGitHubCLI(
    `gh pr comment ${prNumber} --repo ${repo} --body "${comment}"`
  );
  
  return result;
}

/**
 * Merge pull request
 */
export async function mergePR(prNumber) {
  const repo = `${GITHUB_OWNER}/${GITHUB_REPO}`;
  
  const result = await executeGitHubCLI(
    `gh pr merge ${prNumber} --repo ${repo} --squash --auto`
  );
  
  return result;
}

/**
 * Complete workflow: Create branch, file, and PR
 */
export async function createFeaturePR(featureName, fileName, fileContent, prTitle, prBody) {
  try {
    const branchName = `feature/${featureName}`;
    
    // 1. Create branch
    console.log(`Creating branch: ${branchName}`);
    const branchResult = await createBranch(branchName);
    if (!branchResult.success) {
      return { success: false, error: `Failed to create branch: ${branchResult.error}` };
    }
    
    // 2. Create file
    console.log(`Creating file: ${fileName}`);
    const fileResult = await createFile(fileName, fileContent, `feat: ${featureName}`, branchName);
    if (!fileResult.success) {
      return { success: false, error: `Failed to create file: ${fileResult.error}` };
    }
    
    // 3. Create PR
    console.log(`Creating PR: ${prTitle}`);
    const prResult = await createPR(prTitle, prBody, branchName);
    if (!prResult.success) {
      return { success: false, error: `Failed to create PR: ${prResult.error}` };
    }
    
    return {
      success: true,
      branch: branchName,
      file: fileName,
      pr: prResult.pr
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  getUser,
  listRepos,
  getRepo,
  createBranch,
  createFile,
  createPR,
  listPRs,
  getPR,
  addPRComment,
  mergePR,
  createFeaturePR
};
