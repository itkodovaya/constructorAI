/**
 * Примеры тестов для проекта
 * Для запуска установите: npm install --save-dev jest @testing-library/react
 */

// Пример unit теста для ProjectsService
describe('ProjectsService', () => {
  it('should create a project with valid data', async () => {
    const projectData = {
      brandName: 'Test Brand',
      niche: 'Технологии',
      style: 'modern',
      colors: ['#2563eb'],
      goals: ['website'],
    };

    // const project = await ProjectsService.create(projectData);
    // expect(project).toHaveProperty('id');
    // expect(project.brandName).toBe('Test Brand');
  });

  it('should validate project data', () => {
    const invalidData = {
      brandName: '', // Пустое имя
      niche: 'Технологии',
    };

    // const validation = validateProject(invalidData, CreateProjectSchema);
    // expect(validation.success).toBe(false);
  });
});

// Пример интеграционного теста для API
describe('API Endpoints', () => {
  it('should return health status', async () => {
    // const response = await fetch('http://localhost:3001/health');
    // const data = await response.json();
    // expect(data.status).toBe('ok');
  });

  it('should create and retrieve project', async () => {
    // const project = await api.createProject({...});
    // const retrieved = await api.getProject(project.id);
    // expect(retrieved.id).toBe(project.id);
  });
});

// Пример теста для React компонента
describe('SiteBuilder Component', () => {
  it('should render blocks correctly', () => {
    // const { getByText } = render(<SiteBuilder {...props} />);
    // expect(getByText('Welcome')).toBeInTheDocument();
  });

  it('should save blocks on change', async () => {
    // const { getByRole } = render(<SiteBuilder {...props} />);
    // const input = getByRole('textbox');
    // fireEvent.change(input, { target: { value: 'New Title' } });
    // await waitFor(() => {
    //   expect(mockSave).toHaveBeenCalled();
    // });
  });
});

