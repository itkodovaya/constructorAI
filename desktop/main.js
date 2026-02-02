const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: "ConstructorAI Desktop (Sovereign Edition)",
    backgroundColor: '#ffffff'
  });

  // В десктопной версии мы можем загружать локальный фронтенд или удаленный сервер
  // Для начала загружаем основную веб-версию
  win.loadURL('http://localhost:5173'); 

  // Прямой доступ к локальным LLM можно реализовать через IPC
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

