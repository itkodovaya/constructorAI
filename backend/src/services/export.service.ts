export class ExportService {
  static generateHTML(projectId: string, brandName: string, assets: any, pages: any[], activePageId: string, seo?: any, lang: string = 'ru'): string {
    const activePage = pages.find(p => p.id === activePageId) || pages[0];
    const project: any = pages; // This is a bit of a hack since we don't have the full project object here easily, but let's assume it's passed or available.
    // Actually, I'll update the signature to accept the full project.
    return this.generateFullHTML(projectId, brandName, assets, pages, activePageId, seo, lang);
  }

  static generateFullHTML(projectId: string, brandName: string, assets: any, pages: any[], activePageId: string, seo?: any, lang: string = 'ru', products: any[] = [], posts: any[] = []): string {
    const activePage = pages.find(p => p.id === activePageId) || pages[0];
    const blocks = activePage?.blocks || [];
    const palette = assets.palette || ['#2563eb', '#1e40af', '#ffffff', '#f8fafc'];
    const font = assets.fonts?.[0] || 'Inter';
    const conversion = assets.conversion || { popup: { enabled: false }, fab: { enabled: false } };
    
    // SEO мета-теги
    const seoTitle = seo?.title || seo?.ogTitle || activePage?.title || brandName;
    const seoDescription = seo?.description || seo?.ogDescription || `Сайт ${brandName}`;
    const seoImage = seo?.ogImage || seo?.image || assets.logoUrl || '';
    const seoKeywords = seo?.keywords || '';

    // Article View (Single Post)
    const activePostSlug = seo?.activePostSlug;
    if (activePostSlug) {
      const post = posts.find(p => p.slug === activePostSlug);
      if (post) {
        return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(post.title)} - ${this.escapeHtml(brandName)}</title>
    <meta name="description" content="${this.escapeHtml(post.excerpt)}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;700;900&display=swap" rel="stylesheet">
    <style>body { font-family: '${font}', sans-serif; }</style>
</head>
<body class="bg-white text-slate-900">
    <header class="py-6 px-8 border-b border-slate-100">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <a href="index.html" class="text-2xl font-black tracking-tighter">${this.escapeHtml(brandName)}</a>
        <a href="index.html" class="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Back to Home</a>
      </div>
    </header>
    <article class="py-20 px-8">
      <div class="max-w-3xl mx-auto space-y-12">
        <div class="space-y-6 text-center">
          <div class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">${new Date(post.createdAt).toLocaleDateString()}</div>
          <h1 class="text-5xl md:text-6xl font-black leading-tight text-slate-900">${this.escapeHtml(post.title)}</h1>
          <div class="flex items-center justify-center gap-3">
            <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black">${this.escapeHtml(post.author || 'A').charAt(0)}</div>
            <span class="text-sm font-bold text-slate-500">${this.escapeHtml(post.author || 'Admin')}</span>
          </div>
        </div>
        ${post.image ? `<img src="${this.escapeHtml(post.image)}" class="w-full aspect-video object-cover rounded-[48px] shadow-2xl" />` : ''}
        <div class="prose prose-lg max-w-none text-slate-600 font-medium leading-relaxed">
          ${this.escapeHtml(post.content).replace(/\n/g, '<br/>')}
        </div>
      </div>
    </article>
    <footer class="py-20 bg-slate-50 border-t border-slate-100 text-center">
      <div class="max-w-4xl mx-auto space-y-8">
        <div class="text-2xl font-black">${this.escapeHtml(brandName)}</div>
        <div class="text-slate-400 text-sm font-bold">© 2026 ${this.escapeHtml(brandName)}. All rights reserved.</div>
      </div>
    </footer>
</body>
</html>`;
      }
    }

    const blocksHTML = blocks.map((block: any, index: number) => {
      const bgColor = block.content.bgColor || 'transparent';
      const align = block.content.align || 'center';
      const padding = block.content.padding || (block.type === 'header' ? 'py-4' : 'py-20');
      const textAlignClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
      const mxClass = align === 'left' ? 'mr-auto' : align === 'right' ? 'ml-auto' : 'mx-auto';
      
      // Animation settings
      const motion = block.content.motion || { type: 'none', duration: 0.5 };
      let animationClass = '';
      if (motion.type === 'fade-up') animationClass = 'reveal-fade-up';
      if (motion.type === 'fade-in') animationClass = 'reveal-fade-in';
      if (motion.type === 'slide-in') animationClass = 'reveal-slide-in';
      if (motion.type === 'zoom-in') animationClass = 'reveal-zoom-in';

      let contentHTML = '';

      switch (block.type) {
        case 'header':
          const linksHTML = pages.map((page: any) => 
            `<a href="?page=${page.id}" class="hover:text-slate-900 transition-colors ${page.id === activePageId ? 'text-slate-900 font-bold' : ''}">${this.escapeHtml(page.title)}</a>`
          ).join('');
          
          contentHTML = `
            <div class="flex items-center justify-between w-full max-w-7xl mx-auto">
              <div class="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                <div class="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                ${this.escapeHtml(block.content.logo || brandName)}
              </div>
              <div class="hidden md:flex items-center gap-8 font-black text-[10px] uppercase tracking-widest text-slate-400">
                ${linksHTML}
              </div>
              <div class="flex items-center gap-4">
                <button class="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">Get Started</button>
              </div>
            </div>
          `;
          break;
        case 'hero':
          contentHTML = `
            <div class="max-w-4xl ${mxClass} ${animationClass}">
              <h1 class="text-5xl md:text-7xl font-black mb-8 leading-tight text-slate-900">${this.escapeHtml(block.content.title || '')}</h1>
              <p class="text-xl text-slate-500 mb-12 max-w-2xl ${mxClass}">${this.escapeHtml(block.content.subtitle || '')}</p>
              <button class="px-10 py-5 text-white font-black rounded-2xl shadow-xl transition-transform hover:scale-105" style="background-color: ${palette[0]}">
                Get Started
              </button>
            </div>
          `;
          break;
        case 'features':
          const featuresItems = Array.isArray(block.content.items) 
            ? block.content.items.map((item: any) => {
                const itemTitle = typeof item === 'string' ? item : (item.title || item);
                const itemDesc = typeof item === 'object' ? (item.description || '') : '';
                return `
                  <div class="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
                    <div class="w-16 h-16 bg-blue-50 rounded-2xl mb-6 flex items-center justify-center text-blue-600 mx-auto group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-4 text-slate-900">${this.escapeHtml(itemTitle)}</h3>
                    <p class="text-slate-500 leading-relaxed">${this.escapeHtml(itemDesc)}</p>
                  </div>
                `;
              }).join('')
            : '';
          contentHTML = `
            <div class="max-w-6xl mx-auto ${animationClass}">
              ${block.content.title ? `<h2 class="text-4xl font-black mb-16 text-slate-900">${this.escapeHtml(block.content.title)}</h2>` : ''}
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">${featuresItems}</div>
            </div>
          `;
          break;
        case 'pricing':
          const plans = Array.isArray(block.content.plans) ? block.content.plans : [];
          const plansHTML = plans.map((plan: any) => `
            <div class="p-10 rounded-[40px] border-2 flex flex-col h-full transition-all hover:scale-[1.02] ${plan.popular ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 bg-white'}">
              ${plan.popular ? `<div class="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full w-fit mb-6">Most Popular</div>` : ''}
              <h3 class="text-2xl font-black mb-2 text-slate-900">${this.escapeHtml(plan.name || '')}</h3>
              <div class="flex items-baseline gap-1 mb-8">
                <span class="text-5xl font-black text-slate-900">$${this.escapeHtml(plan.price || '0')}</span>
                <span class="text-slate-400 font-bold">/mo</span>
              </div>
              <ul class="space-y-4 mb-10 flex-1">
                ${Array.isArray(plan.features) ? plan.features.map((f: string) => `
                  <li class="flex items-center gap-3 text-slate-600 font-medium text-left">
                    <div class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    </div> 
                    ${this.escapeHtml(f)}
                  </li>
                `).join('') : ''}
              </ul>
              <button class="w-full py-5 rounded-2xl font-black transition-all ${plan.popular ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-white'}" ${plan.popular ? `style="background-color: ${palette[0]}"` : ''}>
                Choose Plan
              </button>
            </div>
          `).join('');
          contentHTML = `
            <div class="max-w-6xl mx-auto ${animationClass}">
              <h2 class="text-4xl font-black mb-16 text-slate-900">${this.escapeHtml(block.content.title || 'Pricing Plans')}</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">${plansHTML}</div>
            </div>
          `;
          break;
        case 'gallery':
          const galleryImages = Array.isArray(block.content.images) ? block.content.images : [];
          const galleryHTML = galleryImages.map((img: string, i: number) => `
            <div class="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
              <img src="${this.escapeHtml(img)}" alt="Gallery ${i + 1}" class="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            </div>
          `).join('');
          contentHTML = `
            <div class="max-w-6xl mx-auto ${animationClass}">
              <h2 class="text-4xl font-black mb-16 text-slate-900">${this.escapeHtml(block.content.title || 'Gallery')}</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">${galleryHTML}</div>
            </div>
          `;
          break;
        case 'faq':
          const faqs = Array.isArray(block.content.items) ? block.content.items : [];
          const faqHTML = faqs.map((faq: any, i: number) => `
            <div class="rounded-3xl border border-slate-100 bg-slate-50/50 mb-4 overflow-hidden">
              <button onclick="toggleFaq(${index}, ${i})" class="w-full p-8 flex items-center justify-between text-left">
                <span class="text-lg font-bold text-slate-900">${this.escapeHtml(faq.question || faq.q || '')}</span>
                <svg class="w-6 h-6 text-slate-400 transition-transform" id="icon-${index}-${i}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div id="content-${index}-${i}" class="hidden p-8 pt-0 text-slate-500 leading-relaxed border-t border-slate-50">
                ${this.escapeHtml(faq.answer || faq.a || '')}
              </div>
            </div>
          `).join('');
          contentHTML = `
            <div class="max-w-3xl mx-auto ${animationClass}">
              <h2 class="text-4xl font-black mb-16 text-slate-900">${this.escapeHtml(block.content.title || 'FAQ')}</h2>
              <div class="text-left">${faqHTML}</div>
            </div>
          `;
          break;
        case 'testimonials':
          const testimonials = Array.isArray(block.content.items) ? block.content.items : [];
          const testimonialsHTML = testimonials.map((test: any) => `
            <div class="p-10 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 text-left">
              <p class="text-slate-700 font-medium italic mb-10 leading-relaxed text-lg">"${this.escapeHtml(test.text || test.content || '')}"</p>
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl">${this.escapeHtml(test.author || 'C').charAt(0)}</div>
                <div>
                  <div class="font-black text-slate-900">${this.escapeHtml(test.author || test.name || '')}</div>
                  <div class="text-sm text-slate-400 font-bold uppercase tracking-wider">${this.escapeHtml(test.role || test.position || '')}</div>
                </div>
              </div>
            </div>
          `).join('');
          contentHTML = `
            <div class="max-w-6xl mx-auto ${animationClass}">
              <h2 class="text-4xl font-black mb-16 text-slate-900">${this.escapeHtml(block.content.title || 'What Our Clients Say')}</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">${testimonialsHTML}</div>
            </div>
          `;
          break;
        case 'stats':
          const stats = Array.isArray(block.content.items) ? block.content.items : [];
          const statsHTML = stats.map((stat: any) => `
            <div class="space-y-3">
              <div class="text-5xl font-black leading-none tracking-tight text-blue-600" style="color: ${palette[0]}">${this.escapeHtml(stat.value || stat.v || '0')}</div>
              <div class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">${this.escapeHtml(stat.label || stat.l || '')}</div>
            </div>
          `).join('');
          contentHTML = `
            <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 ${animationClass}">
              ${statsHTML}
            </div>
          `;
          break;
        case 'store':
          const storeHTML = products.length > 0 ? products.map((p: any) => `
            <div class="group bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all flex flex-col h-full text-left">
              <div class="aspect-[4/5] relative overflow-hidden bg-slate-50">
                ${p.image ? `<img src="${this.escapeHtml(p.image)}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />` : `<div class="w-full h-full flex items-center justify-center text-slate-200"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div>`}
                <div class="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl font-black text-slate-900 shadow-xl">$${p.price}</div>
              </div>
              <div class="p-8 space-y-4 flex-1 flex flex-col">
                <div class="space-y-1 flex-1">
                  <h3 class="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">${this.escapeHtml(p.name)}</h3>
                  <p class="text-sm text-slate-400 font-medium line-clamp-2">${this.escapeHtml(p.description)}</p>
                </div>
                <button onclick="handlePurchase('${p.id}', '${this.escapeHtml(p.name)}')" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">Buy Now</button>
              </div>
            </div>
          `).join('') : '<p class="text-slate-400 font-bold">No products available.</p>';
          contentHTML = `
            <div class="max-w-6xl mx-auto ${animationClass}">
              <div class="text-center space-y-4 max-w-2xl mx-auto mb-16">
                <h2 class="text-4xl font-black text-slate-900 leading-tight">${this.escapeHtml(block.content.title || 'Our Products')}</h2>
                <p class="text-slate-500 font-medium">${this.escapeHtml(block.content.subtitle || '')}</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${block.content.columns || 3} gap-10">
                ${storeHTML}
              </div>
            </div>
          `;
          break;
        case 'blog':
          const blogPosts = posts.filter(p => p.status === 'published').slice(0, block.content.count || 3);
          const blogHTML = blogPosts.length > 0 ? blogPosts.map((p: any) => `
            <div class="group bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all flex flex-col h-full text-left">
              <div class="aspect-[16/10] relative overflow-hidden bg-slate-50">
                ${p.image ? `<img src="${this.escapeHtml(p.image)}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />` : `<div class="w-full h-full flex items-center justify-center text-slate-200 font-black text-4xl">B</div>`}
              </div>
              <div class="p-8 space-y-4 flex-1 flex flex-col">
                <div class="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>${new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 class="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">${this.escapeHtml(p.title)}</h3>
                <p class="text-sm text-slate-400 font-medium line-clamp-3 flex-1">${this.escapeHtml(p.excerpt)}</p>
                <a href="?post=${p.slug}" class="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest group-hover:gap-3 transition-all">Read Story <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg></a>
              </div>
            </div>
          `).join('') : '<p class="text-slate-400 font-bold">No articles available.</p>';
          contentHTML = `
            <div class="max-w-6xl mx-auto ${animationClass}">
              <div class="text-center space-y-4 max-w-2xl mx-auto mb-16">
                <h2 class="text-4xl font-black text-slate-900 leading-tight">${this.escapeHtml(block.content.title || 'Latest Stories')}</h2>
                <p class="text-slate-500 font-medium">${this.escapeHtml(block.content.subtitle || '')}</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${blogHTML}
              </div>
            </div>
          `;
          break;
        case 'countdown':
          contentHTML = `
            <div class="max-w-4xl mx-auto ${animationClass}">
              <div class="text-center space-y-4 mb-12">
                <h2 class="text-4xl font-black text-slate-900 leading-tight">${this.escapeHtml(block.content.title || 'Limited Offer!')}</h2>
                <p class="text-slate-500 font-medium">${this.escapeHtml(block.content.subtitle || '')}</p>
              </div>
              <div class="flex justify-center gap-6 mb-12">
                ${['Days', 'Hours', 'Min', 'Sec'].map(u => `
                  <div class="flex flex-col items-center gap-2">
                    <div id="countdown-${u.toLowerCase()}" class="w-20 h-20 md:w-24 md:h-24 bg-slate-900 rounded-[32px] flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-xl">00</div>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">${u}</span>
                  </div>
                `).join('')}
              </div>
              <button class="px-12 py-5 bg-rose-500 text-white font-black rounded-[24px] shadow-xl hover:scale-105 transition-all">Claim Discount</button>
            </div>
            <script>
              (function() {
                const target = new Date("${block.content.targetDate || new Date(Date.now() + 86400000).toISOString()}").getTime();
                setInterval(() => {
                  const now = new Date().getTime();
                  const diff = target - now;
                  if (diff < 0) return;
                  document.getElementById('countdown-days').innerText = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
                  document.getElementById('countdown-hours').innerText = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
                  document.getElementById('countdown-min').innerText = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                  document.getElementById('countdown-sec').innerText = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
                }, 1000);
              })();
            </script>
          `;
          break;
        case 'contact':
          const fields = Array.isArray(block.content.fields) ? block.content.fields : [
            { id: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'Enter your name' },
            { id: 'email', label: 'Your Email', type: 'email', required: true, placeholder: 'Enter your email' },
            { id: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'How can we help?' }
          ];

          const fieldsHTML = fields.map((f: any) => {
            const required = f.required ? 'required' : '';
            if (f.type === 'textarea') {
              return `<div class="space-y-1.5"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">${this.escapeHtml(f.label)}</label><textarea name="${f.id}" class="w-full p-5 bg-white rounded-2xl border-none text-sm font-bold shadow-sm h-40" placeholder="${this.escapeHtml(f.placeholder)}" ${required}></textarea></div>`;
            } else if (f.type === 'select') {
              const options = Array.isArray(f.options) ? f.options.map((opt: string) => `<option value="${this.escapeHtml(opt)}">${this.escapeHtml(opt)}</option>`).join('') : '';
              return `<div class="space-y-1.5"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">${this.escapeHtml(f.label)}</label><select name="${f.id}" class="w-full p-5 bg-white rounded-2xl border-none text-sm font-bold shadow-sm appearance-none" ${required}><option value="">${this.escapeHtml(f.placeholder || 'Select option...')}</option>${options}</select></div>`;
            } else if (f.type === 'checkbox') {
              return `<div class="flex items-center gap-3 p-2"><input type="checkbox" name="${f.id}" id="check-${f.id}" class="w-5 h-5 rounded-lg border-none bg-white shadow-sm" ${required}><label for="check-${f.id}" class="text-sm font-bold text-slate-600">${this.escapeHtml(f.label)}</label></div>`;
            } else {
              return `<div class="space-y-1.5"><label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">${this.escapeHtml(f.label)}</label><input name="${f.id}" type="${f.type}" class="w-full p-5 bg-white rounded-2xl border-none text-sm font-bold shadow-sm" placeholder="${this.escapeHtml(f.placeholder)}" ${required} /></div>`;
            }
          }).join('');

          contentHTML = `
            <div class="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 bg-white p-16 rounded-[60px] border border-slate-100 shadow-2xl shadow-slate-200/50 text-left ${animationClass}">
              <div class="space-y-8">
                <h2 class="text-5xl font-black text-slate-900 tracking-tight leading-tight">${this.escapeHtml(block.content.title || 'Let\'s Work Together')}</h2>
                <p class="text-lg text-slate-500 font-medium">${this.escapeHtml(block.content.subtitle || '')}</p>
                <div class="space-y-6 pt-10 border-t border-slate-100">
                  <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div class="space-y-1">
                      <div class="text-xs font-black text-slate-400 uppercase">Email Us</div>
                      <div class="text-slate-900 font-bold text-lg">contact@brand.com</div>
                    </div>
                  </div>
                </div>
              </div>
              <form id="contactForm" class="space-y-5 bg-slate-50/50 p-10 rounded-[40px] border border-slate-100">
                ${fieldsHTML}
                <button type="submit" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl" style="background-color: ${palette[0]}">Send Message</button>
                <div id="formStatus" class="text-center text-sm font-bold mt-4 hidden"></div>
              </form>
            </div>
          `;
          break;
        case 'footer':
          contentHTML = `
            <div class="max-w-4xl mx-auto border-t border-slate-100 pt-12 ${animationClass}">
              <div class="flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-sm font-bold tracking-tight">
                <div class="text-2xl font-black text-slate-900">${this.escapeHtml(brandName)}</div>
                <div>${this.escapeHtml(block.content.text || `© 2026 ${brandName}. All rights reserved.`)}</div>
                <div class="flex gap-6">
                  <a href="#" class="hover:text-blue-600 transition-colors">Privacy</a>
                  <a href="#" class="hover:text-blue-600 transition-colors">Terms</a>
                </div>
              </div>
            </div>
          `;
          break;
        default:
          return '';
      }

      return `
        <section class="${padding} px-8 ${textAlignClass}" style="background-color: ${bgColor}">
          ${contentHTML}
        </section>
      `;
    }).join('');

    // Conversion: Exit Intent Popup
    let popupHTML = '';
    if (conversion.popup?.enabled) {
      popupHTML = `
        <div id="exitPopup" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] hidden items-center justify-center p-6">
          <div class="bg-white max-w-lg w-full rounded-[48px] p-12 text-center shadow-2xl space-y-8 relative">
            <button onclick="closePopup()" class="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            <div class="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto shadow-sm"><svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
            <div class="space-y-3">
              <h3 class="text-3xl font-black text-slate-900">${this.escapeHtml(conversion.popup.title)}</h3>
              <p class="text-slate-500 font-medium leading-relaxed">${this.escapeHtml(conversion.popup.text)}</p>
            </div>
            <button onclick="closePopup()" class="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl">I'm Interested</button>
          </div>
        </div>
      `;
    }

    // Conversion: Floating Action Button
    let fabHTML = '';
    if (conversion.fab?.enabled) {
      const icon = conversion.fab.type === 'WhatsApp' ? '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-14.7 8.38 8.38 0 013.8.9L21 3.5z"></path>' : '<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>';
      fabHTML = `
        <a href="${conversion.fab.type === 'WhatsApp' ? 'https://wa.me/' + conversion.fab.value : conversion.fab.type === 'Phone' ? 'tel:' + conversion.fab.value : 'mailto:' + conversion.fab.value}" target="_blank" class="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-[100]" style="background-color: ${palette[0]}">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}"></path></svg>
        </a>
      `;
    }

    return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(seoTitle)}</title>
    <meta name="description" content="${this.escapeHtml(seoDescription)}">
    ${seoKeywords ? `<meta name="keywords" content="${this.escapeHtml(seoKeywords)}">` : ''}
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${this.escapeHtml(seoTitle)}">
    <meta property="og:description" content="${this.escapeHtml(seoDescription)}">
    ${seoImage ? `<meta property="og:image" content="${this.escapeHtml(seoImage)}">` : ''}
    <meta property="og:site_name" content="${this.escapeHtml(brandName)}">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: '${font}', sans-serif; }
        .hidden { display: none; }
        
        /* Animations */
        .reveal-fade-up { opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out; }
        .reveal-fade-in { opacity: 0; transition: all 0.8s ease-out; }
        .reveal-slide-in { opacity: 0; transform: translateX(-30px); transition: all 0.8s ease-out; }
        .reveal-zoom-in { opacity: 0; transform: scale(0.95); transition: all 0.8s ease-out; }
        
        .reveal-active { opacity: 1; transform: translate(0, 0); }
    </style>
</head>
<body class="bg-white text-slate-900 overflow-x-hidden">
    <main>
      ${blocksHTML}
    </main>

    ${popupHTML}
    ${fabHTML}

    <script>
        // FAQ Toggle
        function toggleFaq(blockIdx, faqIdx) {
            const content = document.getElementById('content-' + blockIdx + '-' + faqIdx);
            const icon = document.getElementById('icon-' + blockIdx + '-' + faqIdx);
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        }

        // Reveal Animations on Scroll
        function reveal() {
            const reveals = document.querySelectorAll("[class*='reveal-']");
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 150;
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add("reveal-active");
                }
            }
        }
        window.addEventListener("scroll", reveal);
        reveal(); // Initial check

        // Lead Form Submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = contactForm.querySelector('button');
                const statusDiv = document.getElementById('formStatus');
                
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());
                
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';
                
                try {
                    const response = await fetch(\`/api/projects/${projectId}/leads\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    
                    if (response.ok) {
                        statusDiv.innerText = 'Success! We will contact you soon.';
                        statusDiv.classList.remove('hidden', 'text-red-500');
                        statusDiv.classList.add('text-green-500');
                        contactForm.reset();
                    } else {
                        throw new Error('Failed to send');
                    }
                } catch (err) {
                    statusDiv.innerText = 'Error sending message. Please try again.';
                    statusDiv.classList.remove('hidden', 'text-green-500');
                    statusDiv.classList.add('text-red-500');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Send Message';
                }
            });
        }

        // Purchase Handling
        async function handlePurchase(productId, productName) {
            const email = prompt('Please enter your email to complete the purchase of "' + productName + '":');
            if (!email) return;

            try {
                const response = await fetch(\`/api/projects/${projectId}/leads\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        name: 'Customer',
                        message: 'Purchase Interest: ' + productName,
                        data: { productId, type: 'purchase' },
                        status: 'qualified'
                    })
                });
                if (response.ok) alert('Thank you! We will contact you to complete the payment.');
            } catch (err) {
                console.error(err);
            }
        }

        // Exit Intent Popup
        let popupShown = false;
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0 && !popupShown) {
                const popup = document.getElementById('exitPopup');
                if (popup) {
                    popup.classList.remove('hidden');
                    popup.classList.add('flex');
                    popupShown = true;
                }
            }
        });

        function closePopup() {
            const popup = document.getElementById('exitPopup');
            if (popup) {
                popup.classList.add('hidden');
                popup.classList.remove('flex');
            }
        }
    </script>
</body>
</html>`;
  }

  private static escapeHtml(text: any): string {
    if (text === undefined || text === null) return '';
    if (typeof text === 'object') {
      text = text.title || text.text || text.name || text.content || JSON.stringify(text);
    }
    const s = String(text);
    const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return s.replace(/[&<>"']/g, (m) => map[m]);
  }
}
