// Web Worker Manager
let worker: Worker | null = null;

export function getWorker(): Worker {
  if (!worker) {
    // Create worker from inline code
    const workerCode = `
      ${processBlocks.toString()}
      ${optimizeImages.toString()}
      ${calculateLayout.toString()}
      
      self.onmessage = function(e) {
        const { type, data } = e.data;
        
        switch (type) {
          case 'PROCESS_BLOCKS':
            const processed = processBlocks(data.blocks);
            self.postMessage({ type: 'BLOCKS_PROCESSED', data: processed });
            break;
          
          case 'OPTIMIZE_IMAGES':
            const optimized = optimizeImages(data.images);
            self.postMessage({ type: 'IMAGES_OPTIMIZED', data: optimized });
            break;
          
          case 'CALCULATE_LAYOUT':
            const layout = calculateLayout(data.blocks);
            self.postMessage({ type: 'LAYOUT_CALCULATED', data: layout });
            break;
        }
      };
      
      function processBlocks(blocks) {
        return blocks.map(block => ({
          ...block,
          processed: true,
          timestamp: Date.now(),
        }));
      }
      
      function optimizeImages(images) {
        return images.map(img => img);
      }
      
      function calculateLayout(blocks) {
        return {
          totalHeight: blocks.length * 100,
          positions: blocks.map((_, i) => ({ y: i * 100 })),
        };
      }
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    worker = new Worker(URL.createObjectURL(blob));
  }
  
  return worker;
}

export function terminateWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

export function sendToWorker(type: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = getWorker();
    const handler = (e: MessageEvent) => {
      if (e.data.type === type.toUpperCase() + '_RESPONSE') {
        w.removeEventListener('message', handler);
        resolve(e.data.data);
      }
    };
    
    w.addEventListener('message', handler);
    w.addEventListener('error', reject);
    w.postMessage({ type, data });
  });
}

