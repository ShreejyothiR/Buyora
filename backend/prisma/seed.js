const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Buyora database with rich product intelligence data...');

  // Clear existing
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.priceAlert.deleteMany();
  await prisma.savedProduct.deleteMany();
  await prisma.comparison.deleteMany();
  await prisma.review.deleteMany();
  await prisma.reviewAnalysis.deleteMany();
  await prisma.productAnalysis.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.productListing.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.user.deleteMany();

  // Create Demo User
  const passwordHash = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'demo@buyora.com',
      passwordHash,
      preferences: {
        create: {
          priceWeight: 30,
          performanceWeight: 25,
          batteryWeight: 20,
          durabilityWeight: 15,
          cameraWeight: 10,
          portabilityWeight: 5,
          gamingWeight: 5,
          longTermWeight: 10,
        }
      }
    }
  });
  console.log('✅ Demo user created: demo@buyora.com / password123');

  // Create Sellers
  const sellers = await Promise.all([
    prisma.seller.create({
      data: {
        name: 'Official Brand Store',
        rating: 4.8,
        trustScore: 98,
        returnPolicy: '14-Day Hassle-Free Replacement / Return',
        warrantyInfo: '1 Year Brand Manufacturer Warranty',
        shippingInfo: 'Free Express 24-48h Delivery',
      }
    }),
    prisma.seller.create({
      data: {
        name: 'Appario Retail Superstore',
        rating: 4.6,
        trustScore: 92,
        returnPolicy: '7-Day Return for Damaged/Defective Units',
        warrantyInfo: '1 Year Standard Brand Warranty with GST Invoice',
        shippingInfo: 'Same-day dispatch available',
      }
    }),
    prisma.seller.create({
      data: {
        name: 'ElectroDirect DirectSeller',
        rating: 4.2,
        trustScore: 78,
        returnPolicy: 'Replacement Only for Dead on Arrival (DOA)',
        warrantyInfo: 'Seller-provided 6-month repair warranty',
        shippingInfo: 'Standard 4-7 business days',
      }
    }),
  ]);

  // Product 1: Apple iPhone 15 Pro Max
  const iphone = await prisma.product.create({
    data: {
      name: 'Apple iPhone 15 Pro Max (256GB, Natural Titanium)',
      brand: 'Apple',
      category: 'Smartphones',
      modelNumber: 'MU773HN/A',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      currentPrice: 148900,
      originalPrice: 159900,
      rating: 4.7,
      reviewCount: 1420,
      buyVerdict: 'BUY',
      verdictReason: 'Class-leading video recording and A17 Pro efficiency make it the premier choice for creators and iOS ecosystem users.',
      decisionConfidence: 94,
      listingCompletenessScore: 82,
      futureProofScore: 93,
      regretRisk: 'LOW',
      rawDescription: 'iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
      specifications: {
        create: [
          { category: 'Performance', key: 'Chipset', value: 'Apple A17 Pro (3nm)', confidenceScore: 99 },
          { category: 'Display', key: 'Screen Size & Type', value: '6.7-inch Super Retina XDR OLED 120Hz ProMotion', confidenceScore: 98 },
          { category: 'Camera', key: 'Rear Camera System', value: '48MP Main + 12MP Ultra-Wide + 12MP 5x Telephoto', confidenceScore: 96 },
          { category: 'Battery', key: 'Battery Capacity', value: '4422 mAh (approx. 29h video playback)', confidenceScore: 90 },
          { category: 'Build', key: 'Materials', value: 'Grade 5 Titanium frame with Ceramic Shield front', confidenceScore: 97 },
          { category: 'Storage', key: 'Internal Storage', value: '256 GB NVMe (Non-expandable)', confidenceScore: 100 },
        ]
      },
      productAnalysis: {
        create: {
          marketingClaims: JSON.stringify([
            { claim: 'Titanium design makes it aerospace light', evidence: 'Reduced weight to 221g (19g lighter than 14 Pro Max)', confidence: 95, verdict: 'True and noticeable in daily hand-feel' },
            { claim: 'Console-quality gaming with hardware ray tracing', evidence: 'Runs Resident Evil 4 native, but experiences thermal throttling after 25 mins', confidence: 84, verdict: 'Capable but prone to frame drops under sustained heat' },
            { claim: 'All-day battery life', evidence: 'Averages 9.5 hours continuous screen-on time', confidence: 92, verdict: 'Verified excellent battery longevity' }
          ]),
          missingInformation: JSON.stringify([
            { field: 'RAM Capacity', impact: 'Medium', whyImportant: 'Apple does not state 8GB LPDDR5 RAM on official spec sheets' },
            { field: 'Wired Fast Charging Speed Cap', impact: 'High', whyImportant: 'Maxes out at ~27W peak; significantly slower than Android flagships' },
            { field: 'Out-of-Warranty Screen Replacement Cost', impact: 'High', whyImportant: 'Costs ~₹37,500 without AppleCare+' }
          ]),
          hiddenCosts: JSON.stringify([
            { item: '20W/30W USB-C Power Adapter', estimatedCost: 1900, isRequired: true, note: 'No charging brick in the retail packaging' },
            { item: 'Official MagSafe Protective Case', estimatedCost: 4900, isRequired: false, note: 'Titanium edges can scratch if dropped directly on tarmac' },
            { item: 'iCloud+ 200GB Storage Subscription (Annual)', estimatedCost: 2628, isRequired: true, note: '48MP ProRAW photos quickly fill the 5GB free tier' }
          ]),
          totalEstimatedRealCost: 158328,
          regretReasons: JSON.stringify([
            { reason: 'Slow 27W charging speed compared to 65W+ Android competitors', severity: 'Medium', mitigation: 'Charge overnight with optimized battery charging enabled' },
            { reason: 'Expensive proprietary repair ecosystem without AppleCare+', severity: 'High', mitigation: 'Purchase AppleCare+ or a rugged case on day one' }
          ]),
          whoShouldNotBuy: JSON.stringify([
            'Budget-conscious consumers who prioritize fast 15-minute quick charging',
            'Users heavily invested in Windows and Android custom file transfer ecosystems',
            'Gamers expecting 60FPS sustained continuous gameplay without a clip-on cooler'
          ]),
          productDna: JSON.stringify({
            performance: 95,
            value: 70,
            durability: 90,
            portability: 82,
            innovation: 88,
            repairability: 45,
            risk: 15,
            longTermValue: 95
          }),
          marginalValueScore: 7.9,
          fakeDiscountAnalysis: JSON.stringify({
            isSuspicious: false,
            typicalPrice: 149900,
            explanation: 'The current ₹148,900 reflects genuine bank promotional discounts from the original ₹159,900 launch price.',
            confidence: 94
          }),
          contradictions: JSON.stringify([])
        }
      },
      reviewAnalysis: {
        create: {
          sentimentScore: 89,
          positiveThemes: JSON.stringify(['Phenomenal 5x telephoto camera', 'Noticeably lighter titanium frame', 'Silky 120Hz display', 'Top-tier video recording']),
          negativeThemes: JSON.stringify(['Slow wired charging speeds', 'Thermal buildup under heavy gaming', 'Very expensive initial purchase']),
          commonComplaints: JSON.stringify(['Takes over 1h 45m for full charge', 'Device gets warm during initial setup and 4K60 recording']),
          commonPraise: JSON.stringify(['Log video recording directly to external SSD is a game changer', 'Battery easily lasts 1.5 days on moderate use']),
          heatingComplaints: 34,
          batteryComplaints: 8,
          performanceComplaints: 5,
          buildComplaints: 12,
          softwareComplaints: 9,
          anomalyScore: 8,
          anomalyExplanation: 'Reviews show high organic variance, photo attachments, and verified purchase flags.',
          summaryText: 'Overwhelmingly praised for its lightweight titanium ergonomics and camera versatility, with minor complaints centered on charging speed and thermal throttling.'
        }
      },
      priceHistory: {
        create: [
          { price: 159900, recordedAt: new Date(Date.now() - 90 * 86400000) },
          { price: 156900, recordedAt: new Date(Date.now() - 60 * 86400000) },
          { price: 151900, recordedAt: new Date(Date.now() - 30 * 86400000) },
          { price: 148900, recordedAt: new Date() },
        ]
      },
      listings: {
        create: [
          { sellerId: sellers[0].id, price: 148900, inStock: true, listingUrl: 'https://apple.com' },
          { sellerId: sellers[1].id, price: 149900, inStock: true, listingUrl: 'https://amazon.in' },
        ]
      }
    }
  });

  // Product 2: Samsung Galaxy S24 Ultra
  const s24Ultra = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Gray)',
      brand: 'Samsung',
      category: 'Smartphones',
      modelNumber: 'SM-S928B',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      currentPrice: 129999,
      originalPrice: 144999,
      rating: 4.8,
      reviewCount: 1850,
      buyVerdict: 'BUY',
      verdictReason: 'The ultimate Android powerhouse with built-in S-Pen, anti-reflective Gorilla Armor glass, and guaranteed 7 years of OS updates.',
      decisionConfidence: 96,
      listingCompletenessScore: 91,
      futureProofScore: 96,
      regretRisk: 'LOW',
      rawDescription: 'Meet Galaxy S24 Ultra with Galaxy AI, Titanium exterior, 6.8 inch flat display, 200MP camera, built-in S Pen and Snapdragon 8 Gen 3 for Galaxy.',
      specifications: {
        create: [
          { category: 'Performance', key: 'Chipset', value: 'Snapdragon 8 Gen 3 for Galaxy (4nm)', confidenceScore: 99 },
          { category: 'Display', key: 'Screen Tech & Brightness', value: '6.8-inch Dynamic AMOLED 2X, 2600 nits, Anti-Reflective Gorilla Armor', confidenceScore: 99 },
          { category: 'Camera', key: 'Quad Camera Setup', value: '200MP Wide + 50MP 5x Periscope + 10MP 3x Telephoto + 12MP Ultra-wide', confidenceScore: 98 },
          { category: 'Battery', key: 'Battery & Charging', value: '5000 mAh with 45W Wired Fast Charging', confidenceScore: 95 },
          { category: 'Productivity', key: 'Stylus & Software Support', value: 'Built-in S-Pen Stylus + 7 Years OS & Security Updates', confidenceScore: 100 },
          { category: 'RAM & Storage', key: 'Memory Configuration', value: '12GB LPDDR5X RAM + 256GB UFS 4.0 Storage', confidenceScore: 98 },
        ]
      },
      productAnalysis: {
        create: {
          marketingClaims: JSON.stringify([
            { claim: 'Anti-reflective display eliminates 75% glare', evidence: 'Corning Gorilla Armor significantly cuts ambient reflections in outdoor lab tests', confidence: 97, verdict: 'Best anti-glare screen on any smartphone today' },
            { claim: '7 Years of Major OS & Security Upgrades', evidence: 'Official Samsung contractual pledge through Android 21 (2031)', confidence: 98, verdict: 'Highest longevity commitment in the industry' },
            { claim: '200MP AI Zoom & ProVisual Engine', evidence: '5x and 10x optical-grade shots are razor sharp, 100x zoom remains novelty', confidence: 89, verdict: 'Superb up to 30x zoom' }
          ]),
          missingInformation: JSON.stringify([
            { field: 'Galaxy AI Free Tier Expiration', impact: 'High', whyImportant: 'Footnote indicates certain advanced AI features may transition to paid subscriptions after 2025' },
            { field: 'Fast Charging Brick In Box', impact: 'Medium', whyImportant: '45W charger not included; requires extra purchase' }
          ]),
          hiddenCosts: JSON.stringify([
            { item: 'Samsung Official 45W Power Adapter', estimatedCost: 2999, isRequired: true, note: 'To achieve 0-65% in 30 mins' },
            { item: 'Tempered Glass / Armor Film', estimatedCost: 1299, isRequired: false, note: 'Regular glass screens ruin the anti-reflective coating benefit' },
            { item: 'Potential Post-2025 AI Subscription', estimatedCost: 1800, isRequired: false, note: 'Cloud generative AI features may become paid' }
          ]),
          totalEstimatedRealCost: 136097,
          regretReasons: JSON.stringify([
            { reason: 'Sharp squared-off corner ergonomics can dig into palms during one-handed use', severity: 'Medium', mitigation: 'Use a rounded TPU protective case' },
            { reason: 'Large 232g form factor requires deep pockets', severity: 'Low', mitigation: 'Verify hand-feel in store before purchasing' }
          ]),
          whoShouldNotBuy: JSON.stringify([
            'Users with smaller hands seeking compact pocketable phones',
            'Users who prefer rounded curvy corners and lightweight phones under 190g',
            'People looking for simple point-and-shoot camera settings without complex modes'
          ]),
          productDna: JSON.stringify({
            performance: 96,
            value: 82,
            durability: 92,
            portability: 74,
            innovation: 94,
            repairability: 62,
            risk: 12,
            longTermValue: 96
          }),
          marginalValueScore: 8.9,
          fakeDiscountAnalysis: JSON.stringify({
            isSuspicious: false,
            typicalPrice: 134999,
            explanation: 'Genuine ₹15,000 drop from initial ₹144,999 launch price.',
            confidence: 96
          }),
          contradictions: JSON.stringify([])
        }
      },
      reviewAnalysis: {
        create: {
          sentimentScore: 92,
          positiveThemes: JSON.stringify(['Anti-reflective glass is revolutionary', 'S-Pen versatility', '7 years of updates', 'Phenomenal battery life']),
          negativeThemes: JSON.stringify(['Sharp corners dig into hands', 'No 45W charger in box', 'Heavy weight in pocket']),
          commonComplaints: JSON.stringify(['Shutter lag on moving indoor pets', 'Box only contains a thin cable']),
          commonPraise: JSON.stringify(['Outdoor sunlight visibility is unmatched by any phone', 'Circle to Search is genuinely useful every day']),
          heatingComplaints: 14,
          batteryComplaints: 6,
          performanceComplaints: 3,
          buildComplaints: 8,
          softwareComplaints: 7,
          anomalyScore: 6,
          anomalyExplanation: 'Clean verified reviewer distribution with genuine technical critique.',
          summaryText: 'Widely celebrated as the most complete Android flagship with exceptional outdoor screen legibility and unmatched 7-year software horizon.'
        }
      },
      priceHistory: {
        create: [
          { price: 144999, recordedAt: new Date(Date.now() - 90 * 86400000) },
          { price: 139999, recordedAt: new Date(Date.now() - 60 * 86400000) },
          { price: 134999, recordedAt: new Date(Date.now() - 30 * 86400000) },
          { price: 129999, recordedAt: new Date() },
        ]
      },
      listings: {
        create: [
          { sellerId: sellers[0].id, price: 129999, inStock: true, listingUrl: 'https://samsung.com' },
          { sellerId: sellers[1].id, price: 131999, inStock: true, listingUrl: 'https://amazon.in' },
        ]
      }
    }
  });

  // Product 3: OnePlus 12 5G
  const oneplus12 = await prisma.product.create({
    data: {
      name: 'OnePlus 12 5G (16GB RAM, 512GB, Silky Black)',
      brand: 'OnePlus',
      category: 'Smartphones',
      modelNumber: 'CPH2581',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      currentPrice: 64999,
      originalPrice: 69999,
      rating: 4.6,
      reviewCount: 940,
      buyVerdict: 'BUY',
      verdictReason: 'Outstanding value flagship delivering Snapdragon 8 Gen 3, 100W in-box charging, and 5400 mAh battery at half the price of Ultra flagships.',
      decisionConfidence: 92,
      listingCompletenessScore: 89,
      futureProofScore: 88,
      regretRisk: 'LOW',
      rawDescription: 'OnePlus 12 5G with Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera for Mobile, 2K 120Hz ProXDR Display, and 100W SUPERVOOC charging.',
      specifications: {
        create: [
          { category: 'Performance', key: 'Processor', value: 'Snapdragon 8 Gen 3 Flagship', confidenceScore: 99 },
          { category: 'RAM & Storage', key: 'Configuration', value: '16GB LPDDR5X RAM + 512GB UFS 4.0 Storage', confidenceScore: 99 },
          { category: 'Battery & Charging', key: 'Speed & Capacity', value: '5400 mAh Dual-Cell + 100W SUPERVOOC Charger Included', confidenceScore: 100 },
          { category: 'Display', key: 'Screen Type', value: '6.82-inch 2K 120Hz LTPO AMOLED (4500 nits peak)', confidenceScore: 95 },
          { category: 'Camera', key: 'Hasselblad System', value: '50MP LYT-808 Main + 64MP 3x Periscope + 48MP Ultra-wide', confidenceScore: 94 },
          { category: 'Ingress Protection', key: 'Water Resistance', value: 'IP65 Splash Proof with Aqua Touch', confidenceScore: 90 },
        ]
      },
      productAnalysis: {
        create: {
          marketingClaims: JSON.stringify([
            { claim: '0 to 100% in 26 Minutes with 100W SUPERVOOC', evidence: 'Tested full charge in 27.5 minutes with supplied 100W brick', confidence: 96, verdict: 'Accurate and extremely convenient' },
            { claim: '4500 nits Peak Brightness', evidence: 'Peak is achieved only on 1% window HDR content; sustained outdoor is ~1600 nits', confidence: 85, verdict: 'Promotional peak number, but still exceptionally bright' }
          ]),
          missingInformation: JSON.stringify([
            { field: 'Full Submersion Waterproofing', impact: 'High', whyImportant: 'IP65 only rates against water jets, NOT full submersion like IP68 on iPhone/Samsung' }
          ]),
          hiddenCosts: JSON.stringify([
            { item: 'Protective Case', estimatedCost: 899, isRequired: false, note: 'Phone comes with 100W charger in box; minimal hidden costs' }
          ]),
          totalEstimatedRealCost: 65898,
          regretReasons: JSON.stringify([
            { reason: 'IP65 water resistance instead of complete IP68 submersion protection', severity: 'Medium', mitigation: 'Avoid dropping in swimming pools or bathtubs' }
          ]),
          whoShouldNotBuy: JSON.stringify([
            'Users requiring full underwater submersible IP68 rating',
            'Users seeking flat screen displays (OnePlus 12 has curved edges)'
          ]),
          productDna: JSON.stringify({
            performance: 94,
            value: 94,
            durability: 84,
            portability: 82,
            innovation: 88,
            repairability: 70,
            risk: 15,
            longTermValue: 88
          }),
          marginalValueScore: 9.4,
          fakeDiscountAnalysis: JSON.stringify({
            isSuspicious: false,
            typicalPrice: 66999,
            explanation: 'Stable market price with small bank discount.',
            confidence: 90
          }),
          contradictions: JSON.stringify([])
        }
      },
      reviewAnalysis: {
        create: {
          sentimentScore: 90,
          positiveThemes: JSON.stringify(['100W charger included in the box', 'Stunning 5400 mAh battery life', 'Top-tier performance']),
          negativeThemes: JSON.stringify(['Curved screen edge accidental touches', 'IP65 instead of IP68']),
          commonComplaints: JSON.stringify(['Curved display makes finding good glass protectors tricky']),
          commonPraise: JSON.stringify(['Charges from empty to full in less than half an hour', 'Easily lasts 2 full days of moderate use']),
          heatingComplaints: 12,
          batteryComplaints: 3,
          performanceComplaints: 2,
          buildComplaints: 6,
          softwareComplaints: 10,
          anomalyScore: 7,
          anomalyExplanation: 'Organic community feedback with detailed spec verification.',
          summaryText: 'The undisputed value king of 2024 flagships, packing massive battery, class-leading charging speeds, and in-box charger.'
        }
      },
      priceHistory: {
        create: [
          { price: 69999, recordedAt: new Date(Date.now() - 90 * 86400000) },
          { price: 67999, recordedAt: new Date(Date.now() - 60 * 86400000) },
          { price: 65999, recordedAt: new Date(Date.now() - 30 * 86400000) },
          { price: 64999, recordedAt: new Date() },
        ]
      },
      listings: {
        create: [
          { sellerId: sellers[0].id, price: 64999, inStock: true, listingUrl: 'https://oneplus.in' },
          { sellerId: sellers[1].id, price: 64999, inStock: true, listingUrl: 'https://amazon.in' },
        ]
      }
    }
  });

  // Product 4: Apple MacBook Air M3
  const macbookM3 = await prisma.product.create({
    data: {
      name: 'Apple MacBook Air 15-inch M3 (16GB Unified Memory, 512GB SSD, Midnight)',
      brand: 'Apple',
      category: 'Laptops',
      modelNumber: 'MXD43HN/A',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      currentPrice: 154900,
      originalPrice: 174900,
      rating: 4.9,
      reviewCount: 890,
      buyVerdict: 'BUY',
      verdictReason: 'Remarkable 18-hour real-world battery life, silent fanless aluminum chassis, and dual external monitor support make it the benchmark thin & light laptop.',
      decisionConfidence: 95,
      listingCompletenessScore: 88,
      futureProofScore: 92,
      regretRisk: 'LOW',
      rawDescription: 'Supercharged by M3 with 8-core CPU and 10-core GPU. 15.3-inch Liquid Retina display, MagSafe 3 charging, 1080p FaceTime HD camera, and six-speaker sound system.',
      specifications: {
        create: [
          { category: 'Processor', key: 'CPU & GPU', value: 'Apple M3 Chip (8-core CPU, 10-core GPU, 16-core Neural Engine)', confidenceScore: 100 },
          { category: 'Memory', key: 'Unified RAM', value: '16GB Unified Memory (Soldered / Non-upgradable)', confidenceScore: 100 },
          { category: 'Storage', key: 'Internal Storage', value: '512GB High-Speed NVMe SSD', confidenceScore: 98 },
          { category: 'Display', key: 'Screen Size & Tech', value: '15.3-inch Liquid Retina IPS (2880x1864, 500 nits, P3 Wide Color)', confidenceScore: 98 },
          { category: 'Battery', key: 'Endurance & Charging', value: '66.5 Wh Battery, 35W Dual USB-C Adapter, Up to 18h Web/Video', confidenceScore: 96 },
          { category: 'Design', key: 'Chassis & Weight', value: '1.51 kg All-Aluminum Unibody, Fanless Silent Architecture', confidenceScore: 99 },
        ]
      },
      productAnalysis: {
        create: {
          marketingClaims: JSON.stringify([
            { claim: 'Up to 18 hours battery life', evidence: 'Tested 15.5 hours continuous web browsing and code editing', confidence: 94, verdict: 'Verified real-world all-day endurance' },
            { claim: 'Completely silent fanless design', evidence: '0 dB noise output at all times', confidence: 100, verdict: '100% silent operation under all workloads' }
          ]),
          missingInformation: JSON.stringify([
            { field: 'RAM Upgradeability', impact: 'High', whyImportant: 'Unified memory is hardwired to SoC; cannot be upgraded post-purchase' },
            { field: 'Display Refresh Rate', impact: 'Medium', whyImportant: 'Panel is 60Hz, not 120Hz ProMotion like MacBook Pro' }
          ]),
          hiddenCosts: JSON.stringify([
            { item: 'USB-C Multiport Hub / Dongle (HDMI + USB-A)', estimatedCost: 3499, isRequired: true, note: 'Only 2 Thunderbolt ports and MagSafe are present' },
            { item: 'AppleCare+ 3-Year Protection Plan', estimatedCost: 19900, isRequired: false, note: 'Liquid spill and logic board repairs are otherwise costly' }
          ]),
          totalEstimatedRealCost: 161899,
          regretReasons: JSON.stringify([
            { reason: 'Lack of active cooling causes CPU to throttle under continuous 45+ minute 3D renders', severity: 'Medium', mitigation: 'If doing heavy sustained 3D/8K exports daily, consider MacBook Pro M3 Pro' },
            { reason: '60Hz screen refresh rate rather than 120Hz', severity: 'Low', mitigation: 'Colors and resolution are still top tier' }
          ]),
          whoShouldNotBuy: JSON.stringify([
            'Heavy AAA Windows gamers requiring dedicated NVIDIA RTX GPUs',
            'Engineers running heavy sustained multi-hour machine learning training without cooling fans'
          ]),
          productDna: JSON.stringify({
            performance: 90,
            value: 78,
            durability: 96,
            portability: 92,
            innovation: 90,
            repairability: 40,
            risk: 10,
            longTermValue: 94
          }),
          marginalValueScore: 8.5,
          fakeDiscountAnalysis: JSON.stringify({
            isSuspicious: false,
            typicalPrice: 159900,
            explanation: 'Authentic festive discount of ₹20,000 below MRP.',
            confidence: 95
          }),
          contradictions: JSON.stringify([])
        }
      },
      reviewAnalysis: {
        create: {
          sentimentScore: 94,
          positiveThemes: JSON.stringify(['Incredible battery life', 'Silent fanless operation', 'Spacious vibrant 15.3 inch display', 'Excellent speakers']),
          negativeThemes: JSON.stringify(['No SD card slot', '60Hz refresh rate', 'Midnight color shows fingerprints']),
          commonComplaints: JSON.stringify(['Requires USB-C hub for standard flash drives and HDMI']),
          commonPraise: JSON.stringify(['Can work at coffee shops all day without ever packing a charger', 'Trackpad and keyboard are best in class']),
          heatingComplaints: 8,
          batteryComplaints: 2,
          performanceComplaints: 4,
          buildComplaints: 3,
          softwareComplaints: 2,
          anomalyScore: 5,
          anomalyExplanation: 'Authentic verified reviews praising battery life and build durability.',
          summaryText: 'Regarded as the pinnacle daily productivity laptop for students, developers, and writers seeking silent operation and legendary battery life.'
        }
      },
      priceHistory: {
        create: [
          { price: 174900, recordedAt: new Date(Date.now() - 90 * 86400000) },
          { price: 169900, recordedAt: new Date(Date.now() - 60 * 86400000) },
          { price: 159900, recordedAt: new Date(Date.now() - 30 * 86400000) },
          { price: 154900, recordedAt: new Date() },
        ]
      },
      listings: {
        create: [
          { sellerId: sellers[0].id, price: 154900, inStock: true, listingUrl: 'https://apple.com' },
          { sellerId: sellers[1].id, price: 154900, inStock: true, listingUrl: 'https://amazon.in' },
        ]
      }
    }
  });

  // Product 5: Dell XPS 15 OLED
  const dellXps = await prisma.product.create({
    data: {
      name: 'Dell XPS 15 9530 (Intel Core i9-13900H, 32GB RAM, 1TB SSD, RTX 4070 8GB, 3.5K OLED Touch)',
      brand: 'Dell',
      category: 'Laptops',
      modelNumber: 'XPS9530-9999SLV',
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
      currentPrice: 224990,
      originalPrice: 269990,
      rating: 4.4,
      reviewCount: 480,
      buyVerdict: 'WAIT',
      verdictReason: 'Gorgeous 3.5K OLED touch panel and dedicated RTX 4070 GPU, but runs hot under load and battery life is limited to 5-6 hours.',
      decisionConfidence: 86,
      listingCompletenessScore: 84,
      futureProofScore: 87,
      regretRisk: 'MEDIUM',
      rawDescription: 'Crafted with machined aluminum and carbon fiber. Powered by 13th Gen Intel Core i9, NVIDIA GeForce RTX 4070 Laptop GPU, and breathtaking 3.5K OLED InfinityEdge touch screen.',
      specifications: {
        create: [
          { category: 'Processor', key: 'CPU', value: '13th Gen Intel Core i9-13900H (14-cores, up to 5.4 GHz)', confidenceScore: 98 },
          { category: 'Graphics', key: 'GPU', value: 'NVIDIA GeForce RTX 4070 8GB GDDR6 (40W TGP)', confidenceScore: 97 },
          { category: 'Memory & Storage', key: 'RAM & SSD', value: '32GB DDR5 4800MHz (Upgradeable) + 1TB M.2 PCIe NVMe SSD', confidenceScore: 100 },
          { category: 'Display', key: 'Screen', value: '15.6-inch 3.5K (3456x2160) OLED Touch 400 nits DisplayHDR 500', confidenceScore: 99 },
          { category: 'Battery', key: 'Capacity', value: '86 Wh 6-Cell Battery with 130W Type-C AC Adapter', confidenceScore: 92 },
        ]
      },
      productAnalysis: {
        create: {
          marketingClaims: JSON.stringify([
            { claim: 'Unstoppable Studio-Grade Power', evidence: 'Core i9 handles 4K video editing easily, but RTX 4070 is power-capped at 40W', confidence: 82, verdict: 'Good for creator workflows, capped gaming performance' }
          ]),
          missingInformation: JSON.stringify([
            { field: 'GPU Total Graphics Power (TGP)', impact: 'High', whyImportant: 'Dell restricts RTX 4070 to 40W power limit, delivering lower frame rates than thick gaming laptops' }
          ]),
          hiddenCosts: JSON.stringify([
            { item: 'Premium Laptop Cooling Pad', estimatedCost: 2499, isRequired: true, note: 'High temperatures during long rendering sessions' }
          ]),
          totalEstimatedRealCost: 227489,
          regretReasons: JSON.stringify([
            { reason: 'Battery life drains in ~4.5 hours due to high-power 3.5K OLED and Core i9', severity: 'High', mitigation: 'Always carry the 130W USB-C charger' },
            { reason: 'Fan noise and surface warmth under sustained CPU load', severity: 'Medium', mitigation: 'Use Dell Power Manager in Quiet profile for casual browsing' }
          ]),
          whoShouldNotBuy: JSON.stringify([
            'Road warriors needing 10+ hour disconnected battery life',
            'Competitive esports gamers wanting 140W full-power RTX graphics'
          ]),
          productDna: JSON.stringify({
            performance: 92,
            value: 68,
            durability: 88,
            portability: 74,
            innovation: 85,
            repairability: 78,
            risk: 32,
            longTermValue: 82
          }),
          marginalValueScore: 6.8,
          fakeDiscountAnalysis: JSON.stringify({
            isSuspicious: false,
            typicalPrice: 235000,
            explanation: 'Discount corresponds to mid-lifecycle generation transition.',
            confidence: 88
          }),
          contradictions: JSON.stringify([])
        }
      },
      reviewAnalysis: {
        create: {
          sentimentScore: 78,
          positiveThemes: JSON.stringify(['Stunning 3.5K OLED touch screen', 'Carbon fiber palm rest comfort', 'Upgradable RAM & SSD slots']),
          negativeThemes: JSON.stringify(['Hot chassis under load', 'Mediocre 4.5 hour battery life', 'Power-limited 40W GPU']),
          commonComplaints: JSON.stringify(['Bottom of laptop gets very warm on bare legs', 'Battery drops fast when brightness is high']),
          commonPraise: JSON.stringify(['OLED screen blacks and contrast are unbelievable', 'Speakers sound rich and punchy']),
          heatingComplaints: 52,
          batteryComplaints: 41,
          performanceComplaints: 12,
          buildComplaints: 9,
          softwareComplaints: 14,
          anomalyScore: 11,
          anomalyExplanation: 'Detailed technical reviews emphasizing thermal characteristics.',
          summaryText: 'A gorgeous visual workstation for creative professionals, let down by limited battery endurance and thermal throttling under load.'
        }
      },
      priceHistory: {
        create: [
          { price: 269990, recordedAt: new Date(Date.now() - 90 * 86400000) },
          { price: 249990, recordedAt: new Date(Date.now() - 60 * 86400000) },
          { price: 234990, recordedAt: new Date(Date.now() - 30 * 86400000) },
          { price: 224990, recordedAt: new Date() },
        ]
      },
      listings: {
        create: [
          { sellerId: sellers[0].id, price: 224990, inStock: true, listingUrl: 'https://dell.com' },
          { sellerId: sellers[1].id, price: 229990, inStock: true, listingUrl: 'https://amazon.in' },
        ]
      }
    }
  });

  // Product 6: Sony WH-1000XM5
  const sonyXM5 = await prisma.product.create({
    data: {
      name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones (Silver)',
      brand: 'Sony',
      category: 'Headphones',
      modelNumber: 'WH1000XM5/S',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      currentPrice: 26990,
      originalPrice: 34990,
      rating: 4.6,
      reviewCount: 2300,
      buyVerdict: 'BUY',
      verdictReason: 'Industry-standard active noise cancellation with 8 microphones, 30-hour battery, and featherlight comfort for travel and focus.',
      decisionConfidence: 93,
      listingCompletenessScore: 86,
      futureProofScore: 89,
      regretRisk: 'LOW',
      rawDescription: 'Industry Leading Active Noise Canceling headphones with 2 processors, 8 microphones, Auto NC Optimizer, and up to 30 hours of battery life with quick charging.',
      specifications: {
        create: [
          { category: 'Audio', key: 'Driver Unit', value: '30mm Carbon Fiber Composite Dome', confidenceScore: 98 },
          { category: 'Noise Canceling', key: 'Microphones & Processing', value: '8 Microphones + Integrated Processor V1 & HD Noise Canceling Processor QN1', confidenceScore: 99 },
          { category: 'Battery', key: 'Battery Runtime', value: '30 Hours (NC ON), 40 Hours (NC OFF) + 3 min quick charge gives 3h play', confidenceScore: 98 },
          { category: 'Connectivity', key: 'Bluetooth & Codecs', value: 'Bluetooth 5.2, Multipoint connection, LDAC, AAC, SBC', confidenceScore: 97 },
          { category: 'Weight', key: 'Headphone Weight', value: '250 grams with Soft Fit Leather headband', confidenceScore: 99 },
        ]
      },
      productAnalysis: {
        create: {
          marketingClaims: JSON.stringify([
            { claim: 'Industry-Leading Noise Cancellation', evidence: 'Tested blocks ~85% of high frequency airplane and coffee shop chatter', confidence: 96, verdict: 'Verified benchmark ANC performance' }
          ]),
          missingInformation: JSON.stringify([
            { field: 'Folding Hinge Capability', impact: 'Medium', whyImportant: 'Unlike the XM4, the XM5 does not fold into a compact ball; case is larger' }
          ]),
          hiddenCosts: JSON.stringify([
            { item: 'Replacement Ear Cushion Pads (after 2 yrs)', estimatedCost: 1499, isRequired: false, note: 'Normal synthetic leather wear' }
          ]),
          totalEstimatedRealCost: 28489,
          regretReasons: JSON.stringify([
            { reason: 'Non-folding earcups take up more backpack space in the included case', severity: 'Low', mitigation: 'Store in front pouch of laptop bag' }
          ]),
          whoShouldNotBuy: JSON.stringify([
            'Users who specifically require foldable headphones for tight jacket pockets',
            'Users looking for waterproof gym workout headphones (XM5 has no IPX rating)'
          ]),
          productDna: JSON.stringify({
            performance: 94,
            value: 86,
            durability: 82,
            portability: 78,
            innovation: 92,
            repairability: 60,
            risk: 14,
            longTermValue: 90
          }),
          marginalValueScore: 8.8,
          fakeDiscountAnalysis: JSON.stringify({
            isSuspicious: false,
            typicalPrice: 28990,
            explanation: 'Authentic price drop matching standard seasonal promotions.',
            confidence: 92
          }),
          contradictions: JSON.stringify([])
        }
      },
      reviewAnalysis: {
        create: {
          sentimentScore: 91,
          positiveThemes: JSON.stringify(['Best ANC for flights and offices', 'Crystal clear mic quality', 'Lightweight 250g headband']),
          negativeThemes: JSON.stringify(['Does not fold like XM4', 'No water resistance for gym sweat']),
          commonComplaints: JSON.stringify(['Large carrying case takes more space', 'Earpads can get warm during summer workouts']),
          commonPraise: JSON.stringify(['Mic cancels out vacuum and keyboard noise on Zoom calls', 'Multipoint connection seamlessly swaps between laptop and phone']),
          heatingComplaints: 4,
          batteryComplaints: 2,
          performanceComplaints: 3,
          buildComplaints: 11,
          softwareComplaints: 6,
          anomalyScore: 7,
          anomalyExplanation: 'High consistency and positive verified user feedback across travel and remote work cohorts.',
          summaryText: 'The definitive wireless noise canceling headset for travel and home office, highlighted by peerless microphone clarity and comfortable 30-hour battery life.'
        }
      },
      priceHistory: {
        create: [
          { price: 34990, recordedAt: new Date(Date.now() - 90 * 86400000) },
          { price: 29990, recordedAt: new Date(Date.now() - 60 * 86400000) },
          { price: 27990, recordedAt: new Date(Date.now() - 30 * 86400000) },
          { price: 26990, recordedAt: new Date() },
        ]
      },
      listings: {
        create: [
          { sellerId: sellers[0].id, price: 26990, inStock: true, listingUrl: 'https://sony.co.in' },
          { sellerId: sellers[1].id, price: 26990, inStock: true, listingUrl: 'https://amazon.in' },
        ]
      }
    }
  });

  // Product 7: Apple Watch Ultra 2
  const appleWatchUltra = await prisma.product.create({
    data: {
      name: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium, Orange Ocean Band)',
      brand: 'Apple',
      category: 'Smartwatches',
      modelNumber: 'MRF63HN/A',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      currentPrice: 84900,
      originalPrice: 89900,
      rating: 4.8,
      reviewCount: 620,
      buyVerdict: 'BUY',
      verdictReason: 'Rugged titanium 3000-nit powerhouse with multi-day battery, dual-frequency precision GPS, and dive-ready water resistance up to 100m.',
      decisionConfidence: 94,
      listingCompletenessScore: 90,
      futureProofScore: 94,
      regretRisk: 'LOW',
      rawDescription: 'The ultimate sports and adventure watch with S9 SiP chip, Double Tap gesture, 3000-nit display, up to 72h battery in Low Power Mode, and EN13319 dive certification.',
      specifications: {
        create: [
          { category: 'Display', key: 'Screen & Brightness', value: '49mm Flat Sapphire Crystal Always-On Retina (3000 nits peak)', confidenceScore: 99 },
          { category: 'Processor', key: 'S-Series Chip', value: 'Apple S9 SiP with 4-core Neural Engine and Double Tap', confidenceScore: 99 },
          { category: 'Durability', key: 'Ingress & Dive', value: '100m Water Resistance, WR100, IP6X Dust, EN13319 Scuba Certified to 40m', confidenceScore: 99 },
          { category: 'Battery', key: 'Battery Life', value: '36 Hours Normal Use, Up to 72 Hours Low Power Mode', confidenceScore: 96 },
          { category: 'Sensors', key: 'Health & Location', value: 'Precision Dual-Frequency L1 & L5 GPS, ECG, Blood Oxygen, Depth Gauge, Water Temp', confidenceScore: 98 },
        ]
      },
      productAnalysis: {
        create: {
          marketingClaims: JSON.stringify([
            { claim: '3000-nit display for blinding sunlight visibility', evidence: 'Tested 2x brighter than Apple Watch Series 8; effortlessly visible under direct desert sun', confidence: 98, verdict: 'Proven brightest smartwatch screen' },
            { claim: '36 to 72 hour adventure battery', evidence: 'Consistently lasts 2.5 to 3 days on single charge under mixed GPS and notifications', confidence: 93, verdict: 'Verified multi-day endurance' }
          ]),
          missingInformation: JSON.stringify([
            { field: 'Blood Oxygen Sensor Patent Status', impact: 'Medium', whyImportant: 'Certain US units had blood oxygen disabled due to Masimo patent dispute; verified active in non-US models' }
          ]),
          hiddenCosts: JSON.stringify([
            { item: 'Cellular Carrier Smartwatch Monthly Plan', estimatedCost: 2400, isRequired: false, note: 'Optional for standalone calls without iPhone' }
          ]),
          totalEstimatedRealCost: 87300,
          regretReasons: JSON.stringify([
            { reason: 'Large 49mm titanium case can feel bulky while sleeping or on wrists under 140mm circumference', severity: 'Low', mitigation: 'Try in store with Alpine or Trail loop for secure fit' }
          ]),
          whoShouldNotBuy: JSON.stringify([
            'Android phone users (Apple Watch requires an iPhone to activate and pair)',
            'Users seeking ultra-minimalist slim sleep trackers under 30g'
          ]),
          productDna: JSON.stringify({
            performance: 96,
            value: 75,
            durability: 98,
            portability: 72,
            innovation: 94,
            repairability: 35,
            risk: 10,
            longTermValue: 95
          }),
          marginalValueScore: 8.2,
          fakeDiscountAnalysis: JSON.stringify({
            isSuspicious: false,
            typicalPrice: 86900,
            explanation: 'Genuine standard retailer promotion.',
            confidence: 94
          }),
          contradictions: JSON.stringify([])
        }
      },
      reviewAnalysis: {
        create: {
          sentimentScore: 93,
          positiveThemes: JSON.stringify(['3-day battery is liberating', 'Incredible 3000-nit screen', 'Action button customization', 'Titanium durability']),
          negativeThemes: JSON.stringify(['Expensive price', 'Large 49mm size for small wrists']),
          commonComplaints: JSON.stringify(['Still requires proprietary magnetic puck charger']),
          commonPraise: JSON.stringify(['Finally an Apple Watch you do not have to charge every single night', 'GPS tracking on trail runs is pinpoint accurate']),
          heatingComplaints: 0,
          batteryComplaints: 4,
          performanceComplaints: 1,
          buildComplaints: 2,
          softwareComplaints: 3,
          anomalyScore: 4,
          anomalyExplanation: 'Clean verified athlete and tech enthusiast reviews.',
          summaryText: 'The benchmark luxury adventure smartwatch for iPhone users who want multi-day battery, rugged titanium toughness, and dive-ready water protection.'
        }
      },
      priceHistory: {
        create: [
          { price: 89900, recordedAt: new Date(Date.now() - 90 * 86400000) },
          { price: 87900, recordedAt: new Date(Date.now() - 60 * 86400000) },
          { price: 85900, recordedAt: new Date(Date.now() - 30 * 86400000) },
          { price: 84900, recordedAt: new Date() },
        ]
      },
      listings: {
        create: [
          { sellerId: sellers[0].id, price: 84900, inStock: true, listingUrl: 'https://apple.com' },
          { sellerId: sellers[1].id, price: 84900, inStock: true, listingUrl: 'https://amazon.in' },
        ]
      }
    }
  });

  // Seed sample price alerts and saved products for demo user
  await prisma.savedProduct.createMany({
    data: [
      { userId: demoUser.id, productId: s24Ultra.id },
      { userId: demoUser.id, productId: macbookM3.id },
    ]
  });

  await prisma.priceAlert.createMany({
    data: [
      {
        userId: demoUser.id,
        productId: iphone.id,
        targetPrice: 139900,
        currentPrice: 148900,
        isActive: true,
        isTriggered: false,
      },
      {
        userId: demoUser.id,
        productId: dellXps.id,
        targetPrice: 210000,
        currentPrice: 224990,
        isActive: true,
        isTriggered: false,
      }
    ]
  });

  console.log('✅ Seed completed successfully with 7 flagship products, specifications, rich analysis, and price trends!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
