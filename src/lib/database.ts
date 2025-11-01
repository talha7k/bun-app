import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create database
const dbPath = process.env.NODE_ENV === 'production' 
  ? path.join(dataDir, 'data.sqlite') 
  : path.join(dataDir, 'data.sqlite');

const db = new Database(dbPath);

// Create tables
const createTables = () => {
  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add updated_at column to existing categories table if it doesn't exist
  try {
    db.exec(`ALTER TABLE categories ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`);
  } catch (error) {
    // Column might already exist, ignore error
  }

  // Menu items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price TEXT NOT NULL,
      image_url TEXT,
      category_id INTEGER,
      popular BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `);

  // Tags table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Menu items tags junction table
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_item_tags (
      menu_item_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (menu_item_id, tag_id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items (id),
      FOREIGN KEY (tag_id) REFERENCES tags (id)
    )
  `);

  // Menu item images table
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_item_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_item_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items (id) ON DELETE CASCADE
    )
  `);

  // Locations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      hours TEXT,
      description TEXT,
      features TEXT,
      coordinates_lat REAL,
      coordinates_lng REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Location images table
  db.exec(`
    CREATE TABLE IF NOT EXISTS location_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      is_primary BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
    )
  `);

  // Users table for authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables checked/created successfully');
};

// Insert initial data
const insertInitialData = () => {
  // Check if data already exists
  const existingCategories = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
  if (existingCategories.count > 0) {
    console.log('Database already contains data, skipping initialization');
    return;
  }

  // Insert categories
  const categories = [
    { name: 'Appetizers', icon: '🥗' },
    { name: 'Main Courses', icon: '🍽️' },
    { name: 'Desserts', icon: '🍰' },
    { name: 'Beverages', icon: '🍷' }
  ];

  const insertCategory = db.prepare("INSERT OR IGNORE INTO categories (name, icon) VALUES (?, ?)");
  categories.forEach(category => {
    insertCategory.run(category.name, category.icon);
  });

  // Insert tags
  const tags = ['Vegetarian', 'Gluten-Free', 'Seafood', 'Healthy', 'Beef', 'Classic', 'Poultry', 'Coffee', 'Wine', 'Cocktails', 'Dairy-Free'];
  
  const insertTag = db.prepare("INSERT OR IGNORE INTO tags (name) VALUES (?)");
  tags.forEach(tag => {
    insertTag.run(tag);
  });

  // Insert sample menu items
  const menuItems = [
    {
      name: 'Truffle Bruschetta',
      description: 'Toasted artisan bread with truffle spread, cherry tomatoes, and fresh basil',
      price: 'SAR 14',
      image_url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=300&fit=crop',
      category_name: 'Appetizers',
      popular: true,
      tags: ['Vegetarian', 'Gluten-Free Option']
    },
    {
      name: 'Grilled Salmon',
      description: 'Atlantic salmon with lemon butter sauce, asparagus, and wild rice',
      price: 'SAR 32',
      image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      category_name: 'Main Courses',
      popular: true,
      tags: ['Seafood', 'Gluten-Free', 'Healthy']
    },
    {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
      price: 'SAR 12',
      image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
      category_name: 'Desserts',
      popular: true,
      tags: ['Vegetarian', 'Classic']
    }
  ];

  const insertMenuItem = db.prepare(`
    INSERT OR IGNORE INTO menu_items (name, description, price, image_url, category_id, popular) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const getCategoryId = db.prepare("SELECT id FROM categories WHERE name = ?");
  const getTagId = db.prepare("SELECT id FROM tags WHERE name = ?");
  const insertMenuItemTag = db.prepare("INSERT OR IGNORE INTO menu_item_tags (menu_item_id, tag_id) VALUES (?, ?)");

  menuItems.forEach(item => {
    const category = getCategoryId.get(item.category_name) as { id: number } | undefined;
    if (category) {
      const result = insertMenuItem.run(
        item.name, 
        item.description, 
        item.price, 
        item.image_url, 
        category.id, 
        item.popular ? 1 : 0
      );
      
      if (result.lastInsertRowid) {
        // Insert tags
        item.tags.forEach(tagName => {
          const tag = getTagId.get(tagName) as { id: number } | undefined;
          if (tag) {
            insertMenuItemTag.run(result.lastInsertRowid as number, tag.id);
          }
        });
      }
    }
  });

  // Insert admin user
  const existingUsers = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (existingUsers.count === 0) {
    const insertUser = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    // Note: In production, you should hash passwords. For now, storing as plain text as requested.
    insertUser.run('talha7k@gmail.com', 'Scret123!@#');
    console.log('Admin user created successfully');
  }

  console.log('Initial data inserted successfully');
};

// Initialize database for serverless functions
let initialized = false;

const initializeDatabase = () => {
  if (!initialized) {
    createTables();
    insertInitialData();
    initialized = true;
  }
};

// Initialize when imported
initializeDatabase();

export default db;