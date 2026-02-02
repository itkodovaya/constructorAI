# ConstructorAI API Reference

## Projects API

### GET /api/projects
Returns all projects for the current user.

### POST /api/projects
Creates a new project.
**Body:** `{ brandName: string, niche: string, style: string }`

## AI API

### POST /api/ai/site-structure
Generates an optimal site structure.
**Body:** `{ brandName: string, niche: string, goals: string[] }`

### POST /api/ai/copy
Generates marketing copy for a block.
**Body:** `{ blockType: string, context: any }`
