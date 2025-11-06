import express from 'express';
import githubMCP from '../services/githubMCP.js';

const router = express.Router();

/**
 * Get authenticated user
 * GET /api/github/user
 */
router.get('/user', async (req, res) => {
  try {
    const result = await githubMCP.getUser();
    
    if (result.success) {
      res.json(result.user);
    } else {
      res.status(401).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * List user repositories
 * GET /api/github/repos
 */
router.get('/repos', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const result = await githubMCP.listRepos(limit);
    
    if (result.success) {
      res.json(result.repos);
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get repository info
 * GET /api/github/repo
 */
router.get('/repo', async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const result = await githubMCP.getRepo(owner, repo);
    
    if (result.success) {
      res.json(result.repo);
    } else {
      res.status(404).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create a new branch
 * POST /api/github/branch
 * Body: { branchName, baseBranch? }
 */
router.post('/branch', async (req, res) => {
  try {
    const { branchName, baseBranch } = req.body;
    
    if (!branchName) {
      return res.status(400).json({ error: 'branchName is required' });
    }
    
    const result = await githubMCP.createBranch(branchName, baseBranch);
    
    if (result.success) {
      res.json({ branch: result.branch });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create or update a file
 * POST /api/github/file
 * Body: { filePath, content, message, branch }
 */
router.post('/file', async (req, res) => {
  try {
    const { filePath, content, message, branch } = req.body;
    
    if (!filePath || !content || !message || !branch) {
      return res.status(400).json({ 
        error: 'filePath, content, message, and branch are required' 
      });
    }
    
    const result = await githubMCP.createFile(filePath, content, message, branch);
    
    if (result.success) {
      res.json({ file: result.file });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create a Pull Request
 * POST /api/github/pr
 * Body: { title, body, head, base? }
 */
router.post('/pr', async (req, res) => {
  try {
    const { title, body, head, base } = req.body;
    
    if (!title || !head) {
      return res.status(400).json({ 
        error: 'title and head branch are required' 
      });
    }
    
    const result = await githubMCP.createPR(title, body, head, base);
    
    if (result.success) {
      res.json(result.pr);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * List Pull Requests
 * GET /api/github/prs?state=open
 */
router.get('/prs', async (req, res) => {
  try {
    const { state, limit } = req.query;
    const result = await githubMCP.listPRs(state, limit);
    
    if (result.success) {
      res.json(result.prs);
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get Pull Request details
 * GET /api/github/pr/:number
 */
router.get('/pr/:number', async (req, res) => {
  try {
    const { number } = req.params;
    const result = await githubMCP.getPR(parseInt(number));
    
    if (result.success) {
      res.json(result.pr);
    } else {
      res.status(404).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add comment to PR
 * POST /api/github/pr/:number/comment
 * Body: { comment }
 */
router.post('/pr/:number/comment', async (req, res) => {
  try {
    const { number } = req.params;
    const { comment } = req.body;
    
    if (!comment) {
      return res.status(400).json({ error: 'comment is required' });
    }
    
    const result = await githubMCP.addPRComment(parseInt(number), comment);
    
    if (result.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Complete workflow: Create feature PR
 * POST /api/github/feature-pr
 * Body: { featureName, fileName, fileContent, prTitle, prBody }
 */
router.post('/feature-pr', async (req, res) => {
  try {
    const { featureName, fileName, fileContent, prTitle, prBody } = req.body;
    
    if (!featureName || !fileName || !fileContent || !prTitle) {
      return res.status(400).json({ 
        error: 'featureName, fileName, fileContent, and prTitle are required' 
      });
    }
    
    const result = await githubMCP.createFeaturePR(
      featureName, fileName, fileContent, prTitle, prBody
    );
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
