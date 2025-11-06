# Copilot Automation Guide

## Overview

This document provides instructions for implementing AI-powered copilot automation to enhance the ShopHub e-commerce platform. The copilot will assist with code generation, feature implementation, and automated development workflows.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup Instructions](#setup-instructions)
3. [Automation Workflows](#automation-workflows)
4. [Feature Development with Copilot](#feature-development-with-copilot)
5. [Code Generation Patterns](#code-generation-patterns)
6. [Best Practices](#best-practices)
7. [Example Scenarios](#example-scenarios)

---

## Prerequisites

### Required Tools
- **GitHub Copilot** - AI pair programmer
- **VS Code** or compatible IDE
- **Node.js** (v16+)
- **Git** for version control

### Optional Integrations
- **Jira MCP** - For ticket management (✅ Configured - see JIRA-MCP-SETUP.md)
- **GitHub Actions** - For CI/CD automation
- **OpenAI API** - For custom AI features

> **Note**: Jira MCP is already configured for your account (mdmuzammil18.atlassian.net). See `JIRA-MCP-SETUP.md` for usage instructions.

---

## Setup Instructions

### 1. Enable GitHub Copilot

```bash
# Install GitHub Copilot extension in VS Code
# Or use the CLI
gh extension install github/gh-copilot
```

### 2. Configure Copilot Settings

Create `.vscode/settings.json`:

```json
{
  "github.copilot.enable": {
    "*": true,
    "javascript": true,
    "javascriptreact": true,
    "typescript": true,
    "typescriptreact": true
  },
  "github.copilot.advanced": {
    "debug.overrideEngine": "gpt-4",
    "inlineSuggest.enable": true
  }
}
```

### 3. Set Up Project Context

Create `.copilot-context.md` in project root:

```markdown
# Project: ShopHub E-commerce Platform

## Tech Stack
- Frontend: React 18, TailwindCSS, Framer Motion
- Backend: Express.js, Node.js
- State Management: Zustand
- Routing: React Router v6

## Code Style
- Use functional components with hooks
- Prefer arrow functions
- Use TailwindCSS for styling
- Follow ESLint rules
- Use async/await for async operations

## Project Structure
- Pages in `src/pages/`
- Components in `src/components/`
- Store in `src/store/`
- API routes in `backend/routes/`
```

---

## Automation Workflows

### Workflow 1: Feature Request to Implementation

**Steps:**

1. **Create Feature Request**
   ```markdown
   Feature: Product Search
   Description: Add search functionality to filter products by name
   Acceptance Criteria:
   - Search bar in header
   - Real-time filtering
   - Clear search button
   ```

2. **Generate Component with Copilot**
   ```javascript
   // Type this comment and let Copilot complete:
   // Create a ProductSearch component with real-time filtering
   ```

3. **Copilot Generates:**
   ```javascript
   import React, { useState } from 'react';
   import { Search, X } from 'lucide-react';
   
   export default function ProductSearch({ onSearch }) {
     const [query, setQuery] = useState('');
     
     const handleSearch = (e) => {
       const value = e.target.value;
       setQuery(value);
       onSearch(value);
     };
     
     const clearSearch = () => {
       setQuery('');
       onSearch('');
     };
     
     return (
       <div className="relative">
         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
         <input
           type="text"
           value={query}
           onChange={handleSearch}
           placeholder="Search products..."
           className="input pl-10 pr-10"
         />
         {query && (
           <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2">
             <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
           </button>
         )}
       </div>
     );
   }
   ```

### Workflow 2: API Endpoint Generation

**Prompt Pattern:**
```javascript
// Create an Express route to handle product search with query parameter
// Route: GET /api/products/search?q=query
// Returns: filtered products array
```

**Copilot Generates:**
```javascript
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json(products);
    }
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(q.toLowerCase()) ||
      product.description.toLowerCase().includes(q.toLowerCase()) ||
      product.category.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});
```

### Workflow 3: Test Generation

**Prompt:**
```javascript
// Generate unit tests for ProductSearch component using React Testing Library
```

**Copilot Generates:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import ProductSearch from './ProductSearch';

describe('ProductSearch', () => {
  it('renders search input', () => {
    render(<ProductSearch onSearch={jest.fn()} />);
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });
  
  it('calls onSearch when typing', () => {
    const mockOnSearch = jest.fn();
    render(<ProductSearch onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'laptop' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('laptop');
  });
  
  it('clears search when X button clicked', () => {
    const mockOnSearch = jest.fn();
    render(<ProductSearch onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'laptop' } });
    
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    expect(input.value).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
```

---

## Feature Development with Copilot

### Common Features to Implement

#### 1. Product Wishlist

**Prompt:**
```javascript
// Create a wishlist feature with:
// - Add/remove products from wishlist
// - Persist in localStorage
// - Wishlist page to view saved items
// - Heart icon toggle on product cards
```

#### 2. Product Reviews

**Prompt:**
```javascript
// Implement product reviews with:
// - Star rating component (1-5 stars)
// - Review form with name, rating, comment
// - Display reviews on product page
// - Average rating calculation
```

#### 3. Order History

**Prompt:**
```javascript
// Create order history feature:
// - Store completed orders in state
// - Display order list with date, items, total
// - Order details page
// - Reorder functionality
```

#### 4. User Authentication

**Prompt:**
```javascript
// Add user authentication:
// - Login/Register forms
// - JWT token management
// - Protected routes
// - User profile page
```

---

## Code Generation Patterns

### Pattern 1: Component Generation

**Template:**
```javascript
// Create a [ComponentName] component that [description]
// Props: [prop1, prop2, ...]
// Features: [feature1, feature2, ...]
// Styling: TailwindCSS
```

**Example:**
```javascript
// Create a ProductCard component that displays product information
// Props: product (object with id, name, price, image, rating)
// Features: Add to cart button, favorite toggle, rating stars
// Styling: TailwindCSS with hover effects
```

### Pattern 2: Hook Generation

**Template:**
```javascript
// Create a custom hook use[HookName] that [description]
// Returns: [return values]
// Side effects: [effects]
```

**Example:**
```javascript
// Create a custom hook useLocalStorage that syncs state with localStorage
// Returns: [value, setValue] similar to useState
// Side effects: Saves to localStorage on value change
```

### Pattern 3: API Integration

**Template:**
```javascript
// Create an API service for [resource]
// Methods: get, create, update, delete
// Base URL: /api/[resource]
// Error handling: try-catch with proper error messages
```

### Pattern 4: State Management

**Template:**
```javascript
// Create a Zustand store for [feature]
// State: [state properties]
// Actions: [action methods]
// Persist: localStorage
```

---

## Best Practices

### 1. Write Clear Comments

✅ **Good:**
```javascript
// Create a responsive navigation bar with logo, menu items, and cart icon
// Mobile: Hamburger menu
// Desktop: Horizontal menu
// Sticky on scroll
```

❌ **Bad:**
```javascript
// Make navbar
```

### 2. Provide Context

```javascript
// In a React e-commerce app using TailwindCSS and Zustand
// Create a product filter sidebar with:
// - Price range slider
// - Category checkboxes
// - Brand multi-select
// - Apply/Reset buttons
```

### 3. Specify Tech Stack

```javascript
// Using React Router v6, create protected routes
// Redirect to /login if user not authenticated
// Use Navigate component for redirects
```

### 4. Include Edge Cases

```javascript
// Create a checkout form with validation
// Handle: empty cart, invalid email, missing required fields
// Show error messages below each field
// Disable submit button while processing
```

### 5. Request Tests

```javascript
// Generate the component above
// Then generate Jest tests covering:
// - Rendering
// - User interactions
// - Edge cases
// - Error states
```

---

## Example Scenarios

### Scenario 1: Add Product Filtering

**Step 1: Comment-Driven Development**
```javascript
// src/components/ProductFilters.jsx
// Create a product filter component with:
// - Price range: $0-$500 with slider
// - Categories: checkboxes for each category
// - Rating: 1-5 stars filter
// - Stock status: In stock / Out of stock
// - Apply and Clear buttons
// - Responsive design
```

**Step 2: Let Copilot Generate**
Press `Tab` to accept suggestions, `Alt+]` for next suggestion.

**Step 3: Integrate**
```javascript
// In Products.jsx, add the filter component
// Pass products and setFilteredProducts as props
// Apply filters when user clicks Apply button
```

### Scenario 2: Implement Pagination

**Prompt:**
```javascript
// Add pagination to product list
// Show 9 products per page
// Page numbers at bottom
// Previous/Next buttons
// Highlight current page
// Disable buttons at boundaries
```

### Scenario 3: Add Loading States

**Prompt:**
```javascript
// Add loading skeletons for product cards
// Show 6 skeleton cards while loading
// Animate with pulse effect
// Match product card dimensions
// Use TailwindCSS
```

### Scenario 4: Error Boundaries

**Prompt:**
```javascript
// Create an ErrorBoundary component
// Catch React errors in child components
// Display friendly error message
// Log errors to console
// Provide retry button
```

---

## Copilot Chat Commands

### Useful Commands

```bash
# Explain code
/explain [select code]

# Fix bugs
/fix [select code with bug]

# Generate tests
/tests [select component]

# Optimize code
/optimize [select code]

# Generate documentation
/doc [select function]
```

### Example Usage

1. **Refactor Code**
   - Select code block
   - Open Copilot Chat
   - Type: `/optimize this code for better performance`

2. **Add TypeScript Types**
   - Select JavaScript code
   - Type: `/convert this to TypeScript with proper types`

3. **Generate API Documentation**
   - Select API routes
   - Type: `/doc create API documentation in OpenAPI format`

---

## Automation Scripts

### Auto-generate Components

Create `scripts/generate-component.js`:

```javascript
// Script to generate React component boilerplate
// Usage: node scripts/generate-component.js ComponentName
// Creates: Component file, test file, and updates index

const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];

if (!componentName) {
  console.error('Please provide a component name');
  process.exit(1);
}

const template = `import React from 'react';

export default function ${componentName}() {
  return (
    <div className="container">
      <h1>${componentName}</h1>
    </div>
  );
}
`;

const testTemplate = `import { render, screen } from '@testing-library/react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName} />);
    expect(screen.getByText('${componentName}')).toBeInTheDocument();
  });
});
`;

// Create files
fs.writeFileSync(`src/components/${componentName}.jsx`, template);
fs.writeFileSync(`src/components/${componentName}.test.jsx`, testTemplate);

console.log(`✅ Generated ${componentName} component`);
```

### Auto-format on Save

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Integration with CI/CD

### GitHub Actions Workflow

`.github/workflows/copilot-review.yml`:

```yaml
name: Copilot Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
```

---

## Tips for Maximum Productivity

### 1. Use Copilot Labs
- **Explain**: Understand complex code
- **Translate**: Convert between languages
- **Brushes**: Refactor code styles

### 2. Keyboard Shortcuts
- `Tab` - Accept suggestion
- `Esc` - Dismiss suggestion
- `Alt + ]` - Next suggestion
- `Alt + [` - Previous suggestion
- `Ctrl + Enter` - Open Copilot panel

### 3. Context Matters
- Keep related files open
- Use descriptive variable names
- Write clear function names
- Add JSDoc comments

### 4. Iterate Quickly
- Start with comment
- Accept suggestion
- Refine with more comments
- Test and adjust

---

## Common Pitfalls to Avoid

❌ **Don't:**
- Accept suggestions blindly
- Skip code review
- Ignore security implications
- Forget to test generated code
- Use without understanding

✅ **Do:**
- Review all suggestions
- Test thoroughly
- Validate security
- Understand the code
- Customize to your needs

---

## Resources

### Documentation
- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [Copilot Best Practices](https://github.blog/2023-06-20-how-to-write-better-prompts-for-github-copilot/)
- [React Docs](https://react.dev)
- [TailwindCSS Docs](https://tailwindcss.com)

### Community
- [GitHub Copilot Discussions](https://github.com/orgs/community/discussions/categories/copilot)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/github-copilot)

---

## Conclusion

GitHub Copilot is a powerful tool for accelerating development. Use it wisely:

1. **Start with clear requirements**
2. **Write descriptive comments**
3. **Review and test all code**
4. **Iterate and refine**
5. **Learn from suggestions**

Happy coding with your AI pair programmer! 🚀

---

**Last Updated:** November 2024  
**Version:** 1.0.0  
**Maintainer:** ShopHub Development Team
