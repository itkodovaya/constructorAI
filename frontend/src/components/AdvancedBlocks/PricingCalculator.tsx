import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Check, ArrowRight } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
  features: string[];
  popular?: boolean;
}

interface PricingCalculatorProps {
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
  onCalculate?: (tier: PricingTier, quantity: number, total: number) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  title,
  subtitle,
  tiers,
  onCalculate,
}) => {
  const [selectedTier, setSelectedTier] = useState<PricingTier>(tiers[0]);
  const [quantity, setQuantity] = useState(1);
  const [customFeatures, setCustomFeatures] = useState<string[]>([]);

  const total = selectedTier.basePrice * quantity;

  const handleCalculate = () => {
    onCalculate?.(selectedTier, quantity, total);
  };

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

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Tier Selection */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Select Plan</h3>
            <div className="space-y-4">
              {tiers.map((tier) => (
                <motion.button
                  key={tier.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTier(tier)}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                    selectedTier.id === tier.id
                      ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{tier.name}</h4>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-black text-indigo-600">
                          ${tier.basePrice}
                        </span>
                        <span className="text-slate-500 font-semibold">/{tier.unit}</span>
                      </div>
                    </div>
                    {tier.popular && (
                      <div className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                        Popular
                      </div>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Calculator */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-indigo-600" />
              <h3 className="text-2xl font-bold text-slate-900">Calculate Price</h3>
            </div>

            <div className="space-y-6">
              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-indigo-300 transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-center font-bold text-slate-900 focus:border-indigo-500 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-indigo-300 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Base Price ({selectedTier.unit})</span>
                  <span className="font-bold">${selectedTier.basePrice}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Quantity</span>
                  <span className="font-bold">× {quantity}</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex items-center justify-between text-xl font-black text-slate-900">
                  <span>Total</span>
                  <span className="text-indigo-600">${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Calculate & Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

