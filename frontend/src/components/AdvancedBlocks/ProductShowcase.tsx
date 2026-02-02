import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  featured?: boolean;
}

interface ProductShowcaseProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  columns?: number;
  showFilters?: boolean;
  showSearch?: boolean;
  onProductClick?: (product: Product) => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  title,
  subtitle,
  products,
  columns = 3,
  showFilters = true,
  showSearch = true,
  onProductClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl text-slate-600">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Controls */}
      {(showSearch || showFilters) && (
        <div className="max-w-7xl mx-auto mb-8 space-y-4">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
              />
            </div>
          )}

          {showFilters && (
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${
                    viewMode === 'grid'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${
                    viewMode === 'list'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No products found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onProductClick?.(product)}
                className="bg-white rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-indigo-300 transition-all cursor-pointer group shadow-sm hover:shadow-xl"
              >
                <div className="aspect-square bg-slate-50 relative overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl font-black">
                      {product.name.charAt(0)}
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {product.category && (
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                      {product.category}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-slate-700">{product.rating}</span>
                        </div>
                      )}
                      <div className="text-2xl font-black text-slate-900">
                        ${product.price}
                      </div>
                    </div>
                    <button className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onProductClick?.(product)}
                className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-indigo-300 transition-all cursor-pointer group shadow-sm hover:shadow-xl flex gap-6"
              >
                <div className="w-32 h-32 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl font-black">
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {product.category && (
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                          {product.category}
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      ${product.price}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-4">
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-slate-700">{product.rating}</span>
                      </div>
                    )}
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

