// Converts the downloaded CC0 auto-showroom dataset into a browser-ready,
// deterministic dealership dataset tailored to DriveBack's repeat-sales analysis.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'data', 'auto-showroom-source.json'), 'utf8'));
const makes = ['Aurelia','Nord','Velar','Orion','Kinetic','Solara','Atlas','Nova','Terra','Vantage'];
const models = ['S1','S3','X2','X5','E-Line','Touring','Cross','GT','Pro','Prime'];
const categories = ['sedan','SUV','electric','crossover','performance'];
const contactModes = ['Phone call','Phone call','Email','Send a gift','Home visit'];

const vehicles = source.vehicles.map((v, i) => ({
  id: v.id,
  model: `${makes[i % makes.length]} ${models[Math.floor(i / makes.length) % models.length]}`,
  manufacturer: makes[i % makes.length],
  category: categories[i % categories.length],
  price: Number(v.price || 32000 + ((i * 1739) % 52000)),
  power: 155 + ((i * 17) % 285),
  range: 420 + ((i * 23) % 360)
}));
const vehicleById = Object.fromEntries(vehicles.map(v => [v.id, v]));
const completed = source.transactions.filter(t => t.transaction_status === 'completed');
const txByCustomer = {};
for (const tx of completed) (txByCustomer[tx.customer_id] ||= []).push(tx);

const customers = source.customers.map((c, index) => {
  let txs = (txByCustomer[c.id] || []).sort((a,b) => a.transaction_date.localeCompare(b.transaction_date));
  const cycle = 2 + ((c.id * 7) % 5); // deterministic 2–6 year ownership cycle
  const targetPurchases = txs.length ? Math.max(txs.length, 1 + ((c.id * 11) % 4)) : 0;
  if (!targetPurchases) return null;
  const latestYear = 2018 + ((c.id * 13) % 8); // 2018–2025, so some are due in 2026
  const latestMonth = 1 + ((c.id * 5) % 12);
  const latestDay = 1 + ((c.id * 3) % 27);
  const history = [];
  for (let p = 0; p < targetPurchases; p++) {
    const original = txs[p % txs.length];
    const vehicleId = original?.vehicle_id || 1 + ((c.id * 19 + p * 7) % vehicles.length);
    const year = latestYear - cycle * (targetPurchases - 1 - p);
    history.push({
      date: `${year}-${String(latestMonth).padStart(2,'0')}-${String(latestDay).padStart(2,'0')}`,
      vehicleId,
      vehicle: vehicleById[vehicleId].model,
      amount: Number(original?.amount || vehicleById[vehicleId].price),
      paymentMethod: original?.payment_method || ['cash','financing','credit card'][p % 3]
    });
  }
  return {
    id: c.id,
    name: c.full_name,
    email: c.email,
    phone: c.phone,
    city: c.city || 'Not specified',
    loyalty: c.loyalty_status || 'bronze',
    preferredContact: contactModes[(c.id + index) % contactModes.length],
    purchaseHistory: history
  };
}).filter(Boolean);

const adapted = {
  meta: {
    title: 'DriveBack Adapted Auto Dealership Dataset',
    source: 'Auto Dealership Transactions, DatabaseSample.com, version 4',
    sourceLicense: 'CC0 1.0 Public Domain',
    sourceRows: 1080,
    generatedAt: '2026-11-01',
    note: 'Vehicle names and transaction years were deterministically adapted for repeat-purchase analysis.'
  },
  vehicles,
  customers
};
fs.writeFileSync(path.join(root, 'data', 'dataset.js'), `window.DRIVEBACK_DATA = ${JSON.stringify(adapted)};\n`);
console.log(`Created dataset.js: ${customers.length} customers, ${vehicles.length} vehicles, ${customers.reduce((n,c)=>n+c.purchaseHistory.length,0)} purchase records.`);
