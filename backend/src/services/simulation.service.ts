export class SimulationService {
  /**
   * Runs a Monte Carlo simulation for business growth.
   * @param currentLeads Current monthly leads.
   * @param conversionRate Current conversion rate (0-1).
   * @param marketingSpend Current monthly marketing spend.
   * @param increase Marketing spend increase (multiplier, e.g., 1.2 for 20% increase).
   */
  static async runGrowthSimulation(currentLeads: number, conversionRate: number, marketingSpend: number, increase: number) {
    const iterations = 1000;
    const results = [];

    for (let i = 0; i < iterations; i++) {
      // Add randomness to conversion and lead generation
      const randomConversion = conversionRate * (0.9 + Math.random() * 0.2);
      const randomLeads = currentLeads * increase * (0.8 + Math.random() * 0.4);
      const simulatedRevenue = randomLeads * randomConversion * 100; // Assume $100 per lead
      results.push(simulatedRevenue);
    }

    const averageRevenue = results.reduce((a, b) => a + b, 0) / iterations;
    const roi = (averageRevenue - (marketingSpend * increase)) / (marketingSpend * increase);

    return {
      projectedRevenue: averageRevenue,
      roi: roi,
      confidenceInterval: [averageRevenue * 0.8, averageRevenue * 1.2]
    };
  }
}





