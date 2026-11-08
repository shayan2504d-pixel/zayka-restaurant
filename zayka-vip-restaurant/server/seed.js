const db = require('./db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  console.log('🌱 Starting ZAYKA VIP Database Seeder...');
  await db.initSchema();

  // 1. Settings
  const defaultSettings = [
    { key: 'restaurant_name', value: 'ZAYKA Restaurant' },
    { key: 'tagline', value: 'Where Royal Flavor Meets VIP Luxury' },
    { key: 'phone', value: '+92 300 1234567' },
    { key: 'whatsapp', value: '+92 300 1234567' },
    { key: 'email', value: 'vip@zaykarestaurant.com' },
    { key: 'address', value: 'Plot 42, Royal Boulevard, Block 5, Clifton, Karachi' },
    { key: 'currency', value: 'Rs.' },
    { key: 'delivery_fee', value: '150' },
    { key: 'free_delivery_min', value: '2000' },
    { key: 'tax_rate', value: '5' },
    { key: 'opening_hours', value: 'Monday - Sunday: 12:00 PM - 02:00 AM' }
  ];

  for (const s of defaultSettings) {
    await db.query(`INSERT INTO settings(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value`, [s.key,s.value]);
  }

  // 2. Users (Admin & Demo Customer)
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const customerPasswordHash = bcrypt.hashSync('customer123', 10);

  const adminId = 'usr_admin_zayka';
  const customerId = 'usr_customer_demo';

  await db.query(`INSERT INTO users(id,name,email,phone,password_hash,role,provider,avatar,address) VALUES($1,$2,$3,$4,$5,'admin','local',$6,$7) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,email=EXCLUDED.email,phone=EXCLUDED.phone,password_hash=EXCLUDED.password_hash,role=EXCLUDED.role,provider=EXCLUDED.provider,avatar=EXCLUDED.avatar,address=EXCLUDED.address`,
    [adminId,'Zayka Grand Admin','admin@zayka.com','+923001234567',adminPasswordHash,'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150','Headquarters, VIP Boulevard']);
  await db.query(`INSERT INTO users(id,name,email,phone,password_hash,role,provider,avatar,address) VALUES($1,$2,$3,$4,$5,'customer','local',$6,$7) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,email=EXCLUDED.email,phone=EXCLUDED.phone,password_hash=EXCLUDED.password_hash,role=EXCLUDED.role,provider=EXCLUDED.provider,avatar=EXCLUDED.avatar,address=EXCLUDED.address`,
    [customerId,'Syed Hamza Ali','customer@zayka.com','+923219876543',customerPasswordHash,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150','Suite 402, Al-Razi Heights, Clifton, Karachi']);

  // 3. Categories
  const categories = [
    { id: 'cat_burgers', name: 'Gourmet Burgers', slug: 'burgers', icon: 'Flame', sort_order: 1 },
    { id: 'cat_pizza', name: 'Artisan Pizzas', slug: 'pizza', icon: 'Pizza', sort_order: 2 },
    { id: 'cat_bbq', name: 'Royal BBQ & Grills', slug: 'bbq', icon: 'Beef', sort_order: 3 },
    { id: 'cat_chicken', name: 'Specialty Chicken', slug: 'chicken', icon: 'Drumstick', sort_order: 4 },
    { id: 'cat_pasta', name: 'Tuscan Pasta', slug: 'pasta', icon: 'UtensilsCrossed', sort_order: 5 },
    { id: 'cat_rice', name: 'Dum Biryani & Rice', slug: 'rice', icon: 'Sparkles', sort_order: 6 },
    { id: 'cat_sandwiches', name: 'Club Sandwiches', slug: 'sandwiches', icon: 'Sandwich', sort_order: 7 },
    { id: 'cat_salads', name: 'Fresh Greens & Soups', slug: 'salads', icon: 'Salad', sort_order: 8 },
    { id: 'cat_desserts', name: 'Royal Desserts', slug: 'desserts', icon: 'Cake', sort_order: 9 },
    { id: 'cat_icecream', name: 'Artisanal Ice Cream', slug: 'ice-cream', icon: 'IceCream', sort_order: 10 },
    { id: 'cat_drinks', name: 'Craft Mocktails & Drinks', slug: 'drinks', icon: 'Wine', sort_order: 11 }
  ];

  for (const c of categories) {
    await db.query(`INSERT INTO categories(id,name,slug,icon,sort_order) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,slug=EXCLUDED.slug,icon=EXCLUDED.icon,sort_order=EXCLUDED.sort_order`, [c.id,c.name,c.slug,c.icon,c.sort_order]);
  }

  // 4. Products
  const products = [
    // Burgers
    {
      id: 'prod_burg_1',
      name: 'The Emperor Gold Wagyu Burger',
      description: 'Double prime aged Angus beef patty, smoked provolone cheese, caramelized bourbon onions, truffle aioli, topped on an artisanal 24k gold-dusted brioche bun.',
      price: 1850,
      discount_price: 1599,
      category_id: 'cat_burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 0,
      spicy_level: 1,
      tags: 'Bestseller,Chef Signature'
    },
    {
      id: 'prod_burg_2',
      name: 'Smoky Chipotle Crunch Burger',
      description: 'Crispy fried tender chicken thigh dipped in smoky chipotle glaze, cheddar melt, iceberg lettuce, pickled jalapeños, and secret spicy ranch.',
      price: 1150,
      discount_price: 990,
      category_id: 'cat_burgers',
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 2,
      tags: 'Crispy,Spicy'
    },
    {
      id: 'prod_burg_3',
      name: 'Zayka Signature Smash Burger',
      description: 'Two ultra-smashed beef patties with lace edges, double American cheese, dill pickles, diced shallots, and house thousand island on a butter-toasted potato bun.',
      price: 1350,
      discount_price: null,
      category_id: 'cat_burgers',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 0,
      spicy_level: 0,
      tags: 'Popular'
    },

    // Pizzas
    {
      id: 'prod_piz_1',
      name: 'Truffle Burrata & Wild Mushroom Pizza',
      description: 'Wood-fired sourdough crust, creamy white truffle base, portobello and shiitake mushrooms, fresh artisan burrata cheese, microgreens, and olive oil drizzle.',
      price: 2450,
      discount_price: 2190,
      category_id: 'cat_pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 0,
      spicy_level: 0,
      tags: 'VIP Exclusive,Woodfired'
    },
    {
      id: 'prod_piz_2',
      name: 'Royal Tikka Supreme Pizza',
      description: 'Charcoal grilled chicken tikka cubes, fiery marinara sauce, mozzarella and gouda blend, bell peppers, red onions, black olives, and garlic cilantro dust.',
      price: 1950,
      discount_price: 1750,
      category_id: 'cat_pizza',
      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 2,
      tags: 'Crowd Favorite'
    },
    {
      id: 'prod_piz_3',
      name: 'Firehouse Pepperoni Delight',
      description: 'Handcrafted sourdough, generous layers of premium beef pepperoni, smoked hot honey drizzle, fresh mozzarella, and crushed red chili flakes.',
      price: 2100,
      discount_price: null,
      category_id: 'cat_pizza',
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 1,
      tags: 'Classic'
    },

    // BBQ & Grills
    {
      id: 'prod_bbq_1',
      name: 'Sultan Char-Broiled Mutton Chops',
      description: 'Mutton rib chops marinated for 24 hours in raw papaya, roasted whole spices, Greek yogurt, and saffron, char-grilled over aromatic babool coals.',
      price: 2890,
      discount_price: 2590,
      category_id: 'cat_bbq',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 0,
      spicy_level: 2,
      tags: 'Royal Special'
    },
    {
      id: 'prod_bbq_2',
      name: 'Malai Reshmi Boti Platter',
      description: 'Melt-in-mouth chicken cubes infused with heavy cream, white pepper, ground cardamom, and cashews, served with mint chutney and hot butter naan.',
      price: 1650,
      discount_price: 1450,
      category_id: 'cat_bbq',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 0,
      tags: 'Tender,Mild'
    },
    {
      id: 'prod_bbq_3',
      name: 'Kasturi Seekh Kabab',
      description: 'Finely minced beef blended with aromatic fenugreek leaves (kasuri methi), coriander roots, marrow fat, and skewered to juicy perfection.',
      price: 1490,
      discount_price: null,
      category_id: 'cat_bbq',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 2,
      tags: 'Traditional'
    },

    // Chicken Special
    {
      id: 'prod_chk_1',
      name: 'Imperial Butter Chicken Makhani',
      description: 'Tandoor-roasted chicken pieces simmered in a velvety sauce of San Marzano tomatoes, pure butter, rich cream, and fenugreek. Served with garlic kulcha.',
      price: 1850,
      discount_price: 1690,
      category_id: 'cat_chicken',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 0,
      spicy_level: 1,
      tags: 'House Signature'
    },
    {
      id: 'prod_chk_2',
      name: 'Peshawari Shinwari Karahi',
      description: 'Tender bone-in farm chicken cooked in fresh sheep tail fat with ripe tomatoes, ginger juliennes, coarse black pepper, and whole green chilies.',
      price: 1950,
      discount_price: null,
      category_id: 'cat_chicken',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 2,
      tags: 'Authentic Shinwari'
    },

    // Pasta
    {
      id: 'prod_pas_1',
      name: 'Parmesan Wheel Fettuccine Alfredo',
      description: 'Handmade fresh egg fettuccine tossed in a 24-month aged Parmigiano Reggiano reduction with cultured European butter, fresh cracked pepper, and grilled chicken breast.',
      price: 1750,
      discount_price: 1550,
      category_id: 'cat_pasta',
      image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 0,
      spicy_level: 0,
      tags: 'Italian Classic'
    },
    {
      id: 'prod_pas_2',
      name: 'Spicy Arrabbiata Penne with Prawns',
      description: 'Bronze-die cut penne rigate coated in slow-simmered spicy garlic tomato sugo, fresh basil, and succulent jumbo grilled prawns.',
      price: 2150,
      discount_price: null,
      category_id: 'cat_pasta',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 3,
      tags: 'Seafood,Spicy'
    },

    // Rice & Biryani
    {
      id: 'prod_ric_1',
      name: 'Zayka Royal Mutton Dum Biryani',
      description: 'Long-grain aged basmati rice layered with prime baby mutton, organic saffron milk, kewra essence, caramelized fried shallots, and baked under a sealed dough purdah.',
      price: 1950,
      discount_price: 1790,
      category_id: 'cat_rice',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 0,
      spicy_level: 2,
      tags: 'Legendary'
    },
    {
      id: 'prod_ric_2',
      name: 'Hyderabadi Zafrani Chicken Biryani',
      description: 'Fragrant basmati rice infused with whole cinnamon, cloves, green cardamoms, and tender chicken cooked in spicy brown onion gravy. Served with cucumber zeera raita.',
      price: 1390,
      discount_price: 1250,
      category_id: 'cat_rice',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 2,
      tags: 'Authentic'
    },

    // Sandwiches
    {
      id: 'prod_snd_1',
      name: 'VIP Tri-Decker Club Sandwich',
      description: 'Triple-decker toasted brioche bread packed with herb roasted chicken breast, crispy beef bacon, fried egg, aged cheddar, lettuce, tomatoes, and Dijon mayo. Served with crinkle fries.',
      price: 1190,
      discount_price: 990,
      category_id: 'cat_sandwiches',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 0,
      tags: 'Hearty'
    },

    // Salads
    {
      id: 'prod_sal_1',
      name: 'Mediterranean Burrata & Fig Salad',
      description: 'Fresh artisanal burrata, wild arugula, caramelized mission figs, candied walnuts, pomegranate jewels, and aged balsamic glaze.',
      price: 1450,
      discount_price: null,
      category_id: 'cat_salads',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 0,
      tags: 'Healthy,Gourmet'
    },

    // Desserts
    {
      id: 'prod_des_1',
      name: 'Molten Belgian Chocolate Lava Cake',
      description: 'Warm Valrhona 70% dark chocolate fondant with a flowing molten core, dusted with powdered sugar, paired with vanilla bean gelato.',
      price: 950,
      discount_price: 850,
      category_id: 'cat_desserts',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 1,
      spicy_level: 0,
      tags: 'Decadent,Warm'
    },
    {
      id: 'prod_des_2',
      name: 'New York Baked Lotus Cheesecake',
      description: 'Dense and velvety cream cheese filling on a spiced Biscoff speculoos crumb base, crowned with warm melted Lotus spread and crushed biscuits.',
      price: 890,
      discount_price: 790,
      category_id: 'cat_desserts',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 1,
      spicy_level: 0,
      tags: 'Signature'
    },
    {
      id: 'prod_des_3',
      name: 'Royal Shahi Tukda Saffron Delight',
      description: 'Ghee-fried golden brioche soaked in saffron cardamom syrup, submerged in thick slow-simmered rabri, garnished with silver vark and crushed pistachios.',
      price: 750,
      discount_price: null,
      category_id: 'cat_desserts',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 1,
      spicy_level: 0,
      tags: 'Traditional Royal'
    },

    // Ice Cream
    {
      id: 'prod_ice_1',
      name: 'Artisan Madagascar Vanilla Bean Gelato',
      description: 'Churned with fresh whole milk and double cream, loaded with specks of hand-scraped bourbon vanilla beans from Madagascar.',
      price: 550,
      discount_price: 490,
      category_id: 'cat_icecream',
      image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 1,
      spicy_level: 0,
      tags: 'Classic'
    },
    {
      id: 'prod_ice_2',
      name: 'Belgian Dark Chocolate Fudge Gelato',
      description: 'Deep, rich 72% cocoa dark chocolate gelato swirled with gooey house-made chocolate fudge and dark chocolate shavings.',
      price: 590,
      discount_price: null,
      category_id: 'cat_icecream',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 1,
      spicy_level: 0,
      tags: 'Rich Cocoa'
    },
    {
      id: 'prod_ice_3',
      name: 'Fresh Alfonso Strawberry Swirl',
      description: 'Velvety strawberry cream prepared with farm-fresh organic strawberries, layered with strawberry compote reduction.',
      price: 520,
      discount_price: null,
      category_id: 'cat_icecream',
      image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 1,
      spicy_level: 0,
      tags: 'Fruity'
    },
    {
      id: 'prod_ice_4',
      name: 'The Grand Royal VIP Sundae',
      description: 'Triple scoops of Madagascar Vanilla, Dark Chocolate, and Salted Caramel, topped with hot fudge, roasted almonds, brownie chunks, whipped cream, and Maraschino cherry.',
      price: 1190,
      discount_price: 990,
      category_id: 'cat_icecream',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 1,
      spicy_level: 0,
      tags: 'VIP Spectacular'
    },

    // Drinks
    {
      id: 'prod_drk_1',
      name: 'Royal Saffron Rose Lemonade',
      description: 'Sparkling fresh lemon extract, infused with aromatic Persian rose water, wild mountain honey, and strands of Kashmiri saffron.',
      price: 490,
      discount_price: 420,
      category_id: 'cat_drinks',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
      is_available: 1,
      is_special: 1,
      is_dessert: 0,
      spicy_level: 0,
      tags: 'Refreshing'
    },
    {
      id: 'prod_drk_2',
      name: 'Mint Mojito Breeze',
      description: 'Fresh muddled garden mint, tangy Tahitian lime wedges, raw cane sugar syrup, and chilled effervescent soda over crushed ice.',
      price: 450,
      discount_price: null,
      category_id: 'cat_drinks',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 0,
      tags: 'Chilled'
    },
    {
      id: 'prod_drk_3',
      name: 'Artisan Cold Brew Coffee',
      description: 'Single-origin Arabica beans steeped for 18 hours in cold water, poured over ice with a splash of sweet vanilla foam.',
      price: 590,
      discount_price: null,
      category_id: 'cat_drinks',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&q=80',
      is_available: 1,
      is_special: 0,
      is_dessert: 0,
      spicy_level: 0,
      tags: 'Specialty Coffee'
    }
  ];

  for (const p of products) {
    await db.query(`INSERT INTO products(id,name,description,price,discount_price,category_id,image,is_available,is_special,is_dessert,spicy_level,tags) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,description=EXCLUDED.description,price=EXCLUDED.price,discount_price=EXCLUDED.discount_price,category_id=EXCLUDED.category_id,image=EXCLUDED.image,is_available=EXCLUDED.is_available,is_special=EXCLUDED.is_special,is_dessert=EXCLUDED.is_dessert,spicy_level=EXCLUDED.spicy_level,tags=EXCLUDED.tags`,
      [p.id,p.name,p.description,p.price,p.discount_price,p.category_id,p.image,p.is_available,p.is_special,p.is_dessert,p.spicy_level,p.tags]);
  }

  // 5. Deals & Combos
  const deals = [
    {
      id: 'deal_royal_fam',
      title: 'Grand Royal Family Banquet',
      description: 'A lavish feast crafted for royalty: 1 Sultan Char-Broiled Mutton Chops + 1 Imperial Butter Chicken Makhani + 1 Zayka Royal Mutton Dum Biryani + 4 Hot Butter Naan + 1 Grand VIP Sundae + 1.5L Royal Chilled Drink.',
      items_included: 'Mutton Chops, Butter Chicken, Mutton Dum Biryani, 4 Naans, Grand VIP Sundae, 1.5L Beverage',
      original_price: 8990,
      deal_price: 6999,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      badge: 'Save 22%',
      is_active: 1
    },
    {
      id: 'deal_burg_combo',
      title: 'Ultimate Wagyu Burger Combo',
      description: 'The Emperor Gold Wagyu Burger + Crispy Truffle Parmesan Fries + Creamy Garlic Dip + Mint Mojito Breeze.',
      items_included: 'Gold Wagyu Burger, Truffle Fries, Garlic Dip, Mint Mojito',
      original_price: 2790,
      deal_price: 2199,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
      badge: 'Bestseller Combo',
      is_active: 1
    },
    {
      id: 'deal_pizza_party',
      title: 'Artisan Duo Pizza Feast',
      description: 'Any 2 Artisan Large Pizzas (Truffle Burrata / Royal Tikka / Pepperoni) + 1 Garlic Cheesy Bread + 2 Drinks.',
      items_included: '2 Large Artisan Pizzas, Cheesy Garlic Bread, 2 Chilled Drinks',
      original_price: 5200,
      deal_price: 4199,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
      badge: 'Save Rs. 1000',
      is_active: 1
    },
    {
      id: 'deal_sweet_tooth',
      title: 'Royal Sweet Tooth Euphoria',
      description: 'Warm Molten Belgian Chocolate Lava Cake + New York Lotus Cheesecake + 2 Scoops Artisan Gelato.',
      items_included: 'Molten Lava Cake, Lotus Cheesecake, 2 Scoops Gelato',
      original_price: 2390,
      deal_price: 1850,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
      badge: 'Dessert Lovers',
      is_active: 1
    }
  ];

  for (const d of deals) {
    await db.query(`INSERT INTO deals(id,title,description,items_included,original_price,deal_price,image,badge,is_active) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,description=EXCLUDED.description,items_included=EXCLUDED.items_included,original_price=EXCLUDED.original_price,deal_price=EXCLUDED.deal_price,image=EXCLUDED.image,badge=EXCLUDED.badge,is_active=EXCLUDED.is_active`,
      [d.id,d.title,d.description,d.items_included,d.original_price,d.deal_price,d.image,d.badge,d.is_active]);
  }

  // 6. Sample Reviews
  const reviews = [
    {
      id: 'rev_1',
      user_id: customerId,
      customer_name: 'Syed Hamza Ali',
      rating: 5,
      comment: 'The Gold Wagyu burger and Mutton Chops were an absolute revelation! The ambiance is unmatched in the city. Truly a VIP dining experience.',
      is_approved: 1
    },
    {
      id: 'rev_2',
      user_id: null,
      customer_name: 'Ayesha Siddiqui',
      rating: 5,
      comment: 'Ordered online for our anniversary dinner. The packaging was royal velvet box quality, food arrived piping hot within 35 minutes, and the Molten Lava cake was divine!',
      is_approved: 1
    },
    {
      id: 'rev_3',
      user_id: null,
      customer_name: 'Dr. Tariq Mansoor',
      rating: 5,
      comment: 'Held a corporate banquet at ZAYKA VIP lounge. Outstanding hospitality, authentic flavors, and seamless table booking system.',
      is_approved: 1
    },
    {
      id: 'rev_4',
      user_id: null,
      customer_name: 'Fatima Noor',
      rating: 5,
      comment: 'Best Artisanal Ice Cream in town! The Madagascar Vanilla and Dark Chocolate fudge are out of this world.',
      is_approved: 1
    }
  ];

  for (const r of reviews) {
    await db.query(`INSERT INTO reviews(id,user_id,customer_name,rating,comment,is_approved) VALUES($1,$2,$3,$4,$5,$6)
      ON CONFLICT(id) DO UPDATE SET user_id=EXCLUDED.user_id,customer_name=EXCLUDED.customer_name,rating=EXCLUDED.rating,comment=EXCLUDED.comment,is_approved=EXCLUDED.is_approved`,
      [r.id,r.user_id,r.customer_name,r.rating,r.comment,r.is_approved]);
  }

  // 7. Sample Orders
  const sampleOrder1Id = 'ord_demo_101';
  await db.query(`INSERT INTO orders(id,order_number,user_id,customer_name,customer_email,customer_phone,order_type,address,payment_method,payment_status,subtotal,discount,delivery_fee,total_amount,status,notes)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    ON CONFLICT(id) DO UPDATE SET status=EXCLUDED.status,notes=EXCLUDED.notes`,
    [
    sampleOrder1Id,
    'ZYK-10942',
    customerId,
    'Syed Hamza Ali',
    'customer@zayka.com',
    '+923219876543',
    'delivery',
    'Suite 402, Al-Razi Heights, Clifton, Karachi',
    'cod',
    'pending',
    3789,
    200,
    150,
    3739,
    'preparing',
    'Please ring the bell twice and bring extra garlic dip.'
  ]);

  await db.query(`INSERT INTO order_items(id,order_id,product_id,product_name,price,quantity,instructions) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO NOTHING`,
    [uuidv4(),sampleOrder1Id,'prod_burg_1','The Emperor Gold Wagyu Burger',1599,1,'Medium well, extra napkins']);
  await db.query(`INSERT INTO order_items(id,order_id,product_id,product_name,price,quantity,instructions) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO NOTHING`,
    [uuidv4(),sampleOrder1Id,'deal_sweet_tooth','Royal Sweet Tooth Euphoria',1850,1,'Warm up the brownie']);

  // Sample Past Completed Order
  const sampleOrder2Id = 'ord_demo_102';
  await db.query(`INSERT INTO orders(id,order_number,user_id,customer_name,customer_email,customer_phone,order_type,address,payment_method,payment_status,subtotal,discount,delivery_fee,total_amount,status,notes)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    ON CONFLICT(id) DO UPDATE SET status=EXCLUDED.status,notes=EXCLUDED.notes`,
    [
    sampleOrder2Id,
    'ZYK-10885',
    customerId,
    'Syed Hamza Ali',
    'customer@zayka.com',
    '+923219876543',
    'delivery',
    'Suite 402, Al-Razi Heights, Clifton, Karachi',
    'card',
    'paid',
    2450,
    0,
    150,
    2600,
    'delivered',
    'Delivered successfully.'
  ]);
  await db.query(`INSERT INTO order_items(id,order_id,product_id,product_name,price,quantity,instructions) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO NOTHING`,
    [uuidv4(),sampleOrder2Id,'prod_piz_1','Truffle Burrata & Wild Mushroom Pizza',2450,1,'Extra crispy crust']);

  // 8. Sample Table Reservation
  await db.query(`INSERT INTO reservations(id,reservation_code,user_id,customer_name,customer_email,customer_phone,guests_count,reservation_date,reservation_time,seating_area,special_requests,status)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT(id) DO UPDATE SET status=EXCLUDED.status`, [
    'res_demo_1',
    'RES-7821',
    customerId,
    'Syed Hamza Ali',
    'customer@zayka.com',
    '+923219876543',
    4,
    '2026-10-05',
    '20:30',
    'Royal VIP Lounge',
    'Anniversary celebration table with flowers decoration.',
    'confirmed'
  ]);

  console.log('✅ ZAYKA VIP Database successfully seeded with:');
  console.log('   - 1 Admin user (admin@zayka.com / admin123)');
  console.log('   - 1 Demo customer (customer@zayka.com / customer123)');
  console.log('   - 11 Categories');
  console.log('   - 25 Luxury Gourmet Dishes & Desserts');
  console.log('   - 4 Signature Deals');
  console.log('   - Sample Orders, Reviews & Reservations');
}

seed()
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => db.end());
