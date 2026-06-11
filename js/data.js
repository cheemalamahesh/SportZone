/* ============================================================
   data.js — Product catalogue & mock data
   ============================================================ */

const PRODUCTS = [
  { id: 1, name: 'Pro Strike Football', brand: 'Nike', category: 'football', price: 2999, originalPrice: 3999, rating: 4.7, reviews: 312, badge: 'sale', image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=400&fit=crop', description: 'Professional-grade football with superior grip and aerodynamic design. Suitable for all weather conditions.', stock: 15, sizes: ['3', '4', '5'], colors: ['#111','#ff6b35','#fff'] },
  { id: 2, name: 'Elite Basketball Pro', brand: 'Adidas', category: 'basketball', price: 3499, originalPrice: 4299, rating: 4.8, reviews: 198, badge: 'hot', image: 'https://midwaysports.com/cdn/shop/files/BX7E-PRO-00_High_Large_386dc1e8-c915-4bd2-a91e-74ab1874b0f2.png?crop=center&height=1200&v=1754298744&width=1200', description: 'Indoor/Outdoor composite leather basketball for serious players.', stock: 8, sizes: ['6', '7'], colors: ['#e05a00','#111'] },
  { id: 3, name: 'Carbon Smash Racket', brand: 'Wilson', category: 'tennis', price: 7499, originalPrice: 9999, rating: 4.9, reviews: 87, badge: 'sale', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=400&fit=crop', description: 'Carbon fiber frame with vibration dampening for precision control.', stock: 6, sizes: ['4 1/8', '4 1/4', '4 3/8'], colors: ['#e53e3e','#111'] },
  { id: 4, name: 'IronGrip Dumbbells Set', brand: 'Rogue', category: 'fitness', price: 5999, originalPrice: 7499, rating: 4.6, reviews: 445, badge: null, image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=400&fit=crop', description: 'Hex rubber dumbbells set (5–30kg) with anti-roll design.', stock: 22, sizes: ['5kg','10kg','15kg','20kg','25kg','30kg'], colors: ['#333','#e05a00'] },
  { id: 5, name: 'AquaSpeed Swim Goggles', brand: 'Speedo', category: 'swimming', price: 1299, originalPrice: 1799, rating: 4.5, reviews: 276, badge: 'new', image: 'https://images.unsplash.com/photo-1615117972428-28de67cda58e?w=400&h=400&fit=crop', description: 'UV-protection anti-fog lenses for competitive swimming.', stock: 40, sizes: ['S','M','L'], colors: ['#1a73e8','#e53e3e','#333'] },
  { id: 6, name: 'TrailBlazer Bike 27.5"', brand: 'Trek', category: 'cycling', price: 29999, originalPrice: 34999, rating: 4.8, reviews: 63, badge: 'sale', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', description: '27.5-inch trail mountain bike with 21-speed Shimano gearing.', stock: 4, sizes: ['S','M','L','XL'], colors: ['#2d9cdb','#111','#e05a00'] },
  { id: 7, name: 'Speed Boost Running Shoes', brand: 'Adidas', category: 'fitness', price: 8999, originalPrice: 11999, rating: 4.7, reviews: 521, badge: 'hot', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', description: 'Boost foam midsole for maximum energy return and comfort.', stock: 30, sizes: ['6','7','8','9','10','11'], colors: ['#fff','#111','#ff6b35'] },
  { id: 8, name: 'Champion Goalkeeper Gloves', brand: 'Nike', category: 'football', price: 2499, originalPrice: 2999, rating: 4.4, reviews: 134, badge: null, image: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=400&h=400&fit=crop', description: 'Negative cut foam for superior ball contact and grip.', stock: 18, sizes: ['7','8','9','10','11'], colors: ['#e53e3e','#ff6b35'] },
  { id: 9, name: 'FlexPower Yoga Mat', brand: 'Liforme', category: 'fitness', price: 3999, originalPrice: 4999, rating: 4.9, reviews: 389, badge: 'new', image: 'https://wiselife.in/cdn/shop/files/4_6731e00b-24e1-48ae-899d-64951efd1dcd.png?v=1769506584', description: 'Non-slip alignment markers, 4.2mm natural rubber mat.', stock: 55, sizes: ['Standard','XL'], colors: ['#6b46c1','#2d9cdb','#111'] },
  { id: 10, name: 'Slam Dunk Basketball Hoop', brand: 'Spalding', category: 'basketball', price: 12999, originalPrice: 15999, rating: 4.5, reviews: 47, badge: 'sale', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400&h=400&fit=crop', description: 'Portable adjustable hoop 2.4m–3.05m with breakaway rim.', stock: 7, sizes: ['Standard'], colors: ['#e05a00','#111'] },
  { id: 11, name: 'TurboCharge Swim Fins', brand: 'Speedo', category: 'swimming', price: 1899, originalPrice: 2299, rating: 4.3, reviews: 98, badge: null, image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=400&fit=crop', description: 'Short-blade training fins for ankle flexibility and speed.', stock: 25, sizes: ['S','M','L','XL'], colors: ['#1a73e8','#111'] },
  { id: 12, name: 'Aero Road Helmet', brand: 'Giro', category: 'cycling', price: 5499, originalPrice: 6999, rating: 4.7, reviews: 112, badge: 'new', image: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?w=400&h=400&fit=crop', description: 'MIPS protection system with 25 wind-tunnel tested vents.', stock: 12, sizes: ['S','M','L'], colors: ['#fff','#111','#e53e3e'] },
  { id: 13, name: 'Power Serve Tennis Balls', brand: 'Penn', category: 'tennis', price: 499, originalPrice: 649, rating: 4.4, reviews: 830, badge: null, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=400&fit=crop', description: 'Pressurized felt tennis balls for consistent bounce. Pack of 6.', stock: 200, sizes: ['Pack of 3','Pack of 6'], colors: ['#f5e642'] },
  { id: 14, name: 'Pro Knee Guard Set', brand: 'Mueller', category: 'fitness', price: 1799, originalPrice: 2199, rating: 4.6, reviews: 203, badge: null, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', description: 'Neoprene knee guards with silicone grip for maximum support.', stock: 35, sizes: ['S','M','L','XL'], colors: ['#111','#333'] },
  { id: 15, name: 'Carbon Cycling Gloves', brand: 'Trek', category: 'cycling', price: 1299, originalPrice: 1699, rating: 4.5, reviews: 156, badge: null, image: 'https://www.reisemoto.com/cdn/shop/files/GCarbonYellow.jpg?v=1738134206&width=2000', description: 'Padded palm, breathable mesh back for long rides.', stock: 28, sizes: ['S','M','L','XL'], colors: ['#111','#2d9cdb'] },
  { id: 16, name: 'Match Ball Football Size 5', brand: 'Puma', category: 'football', price: 1999, originalPrice: 2499, rating: 4.3, reviews: 267, badge: null, image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&h=400&fit=crop', description: 'FIFA quality pro certified match ball for training and matches.', stock: 50, sizes: ['5'], colors: ['#fff','#111'] }
];

const CATEGORIES = [
  { id: 'football', name: 'Football', icon: '⚽', count: 0 },
  { id: 'basketball', name: 'Basketball', icon: '🏀', count: 0 },
  { id: 'tennis', name: 'Tennis', icon: '🎾', count: 0 },
  { id: 'fitness', name: 'Fitness', icon: '🏋️', count: 0 },
  { id: 'swimming', name: 'Swimming', icon: '🏊', count: 0 },
  { id: 'cycling', name: 'Cycling', icon: '🚴', count: 0 }
];

// Compute counts
CATEGORIES.forEach(cat => {
  cat.count = PRODUCTS.filter(p => p.category === cat.id).length;
});

const BRANDS = [...new Set(PRODUCTS.map(p => p.brand))];

const MOCK_ORDERS = [
  { id: 'ORD-2024001', date: '2026-04-10', status: 'delivered', total: 11498, items: [PRODUCTS[0], PRODUCTS[4]], itemCount: 2 },
  { id: 'ORD-2024002', date: '2026-04-28', status: 'shipped', total: 7499, items: [PRODUCTS[2]], itemCount: 1 },
  { id: 'ORD-2024003', date: '2026-05-12', status: 'processing', total: 29999, items: [PRODUCTS[5]], itemCount: 1 }
];

const PROMO_CODES = {
  'SPORT20': { discount: 0.20, label: '20% off' },
  'NEWUSER': { discount: 0.15, label: '15% off' },
  'SAVE10': { discount: 0.10, label: '10% off' }
};

function formatPrice(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function getStarHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) html += '★';
    else if (i === full && half) html += '☆';
    else html += '☆';
  }
  return `<span class="rating-stars" style="color:#F5A623">${html}</span>`;
}
