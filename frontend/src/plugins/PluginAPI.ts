export interface Plugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  onLoad: (api: PluginAPI) => void;
  onUnload: () => void;
}

export interface PluginAPI {
  registerBlock: (blockType: string, component: React.FC<any>) => void;
  addToolbarAction: (action: { icon: React.ReactNode; onClick: () => void }) => void;
  getBlocks: () => any[];
  updateBlock: (id: string, content: any) => void;
}

export class PluginManagerService {
  private plugins: Map<string, Plugin> = new Map();
  private api: PluginAPI;

  constructor(api: PluginAPI) {
    this.api = api;
  }

  loadPlugin(plugin: Plugin) {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} is already loaded.`);
      return;
    }
    plugin.onLoad(this.api);
    this.plugins.set(plugin.id, plugin);
    console.log(`Plugin ${plugin.name} loaded successfully.`);
  }

  unloadPlugin(id: string) {
    const plugin = this.plugins.get(id);
    if (plugin) {
      plugin.onUnload();
      this.plugins.delete(id);
      console.log(`Plugin ${plugin.name} unloaded.`);
    }
  }

  getLoadedPlugins() {
    return Array.from(this.plugins.values());
  }
}
