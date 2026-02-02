/**
 * Projects Service - Микросервис для управления проектами
 */

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const port = 3004;

app.use(cors());
app.use(express.json());

interface Project {
  id: string;
  userId: string;
  name: string;
  brandName: string;
  niche: string;
  style: string;
  brandAssets: any;
  pages: any[];
  presentation: any[];
  createdAt: string;
  updatedAt: string;
}

const dataDir = path.join(__dirname, '../../data');
const projectsFile = path.join(dataDir, 'projects.json');

// Инициализация данных
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function loadProjects(): Project[] {
  if (fs.existsSync(projectsFile)) {
    const data = fs.readFileSync(projectsFile, 'utf-8');
    return JSON.parse(data);
  }
  return [];
}

function saveProjects(projects: Project[]) {
  fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
}

// Получение всех проектов пользователя
app.get('/api/projects', (req, res) => {
  try {
    const userId = req.query.userId as string;
    const projects = loadProjects();
    const userProjects = userId ? projects.filter(p => p.userId === userId) : projects;
    res.json({ projects: userProjects });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение проекта по ID
app.get('/api/projects/:id', (req, res) => {
  try {
    const projects = loadProjects();
    const project = projects.find(p => p.id === req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ project });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создание проекта
app.post('/api/projects', (req, res) => {
  try {
    const { userId, name, brandName, niche, style } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const projects = loadProjects();
    const project: Project = {
      id: uuidv4(),
      userId,
      name,
      brandName: brandName || name,
      niche: niche || '',
      style: style || 'modern',
      brandAssets: {},
      pages: [],
      presentation: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(project);
    saveProjects(projects);

    res.status(201).json({ project });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление проекта
app.put('/api/projects/:id', (req, res) => {
  try {
    const projects = loadProjects();
    const index = projects.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    projects[index] = {
      ...projects[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };

    saveProjects(projects);
    res.json({ project: projects[index] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление проекта
app.delete('/api/projects/:id', (req, res) => {
  try {
    const projects = loadProjects();
    const filtered = projects.filter(p => p.id !== req.params.id);
    
    if (filtered.length === projects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    saveProjects(filtered);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'projects-service' });
});

app.listen(port, () => {
  console.log(`Projects Service running at http://localhost:${port}`);
});

