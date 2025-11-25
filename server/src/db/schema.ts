import type Database from 'better-sqlite3';

export function createTables(db: InstanceType<typeof Database>) {
  db.exec(`PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS domains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      original_filename TEXT,
      source_path TEXT,
      content_text TEXT,
      uploaded_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      address TEXT NOT NULL,
      type TEXT NOT NULL,
      rent_weekly REAL,
      status TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS job_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      employer TEXT NOT NULL,
      role TEXT,
      hours_per_week REAL,
      pay_rate_hourly REAL,
      status TEXT,
      pros TEXT,
      cons TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS childcare_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT,
      min_age_months INTEGER,
      max_age_months INTEGER,
      daily_fee REAL,
      status TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      provider_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      location TEXT,
      start_datetime TEXT NOT NULL,
      end_datetime TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(provider_id) REFERENCES providers(id)
    );
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS trip_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      vehicle TEXT NOT NULL,
      driver_name TEXT NOT NULL,
      passengers TEXT,
      cargo_notes TEXT,
      misc_notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(trip_id) REFERENCES trips(id)
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      domain_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL,
      priority INTEGER NOT NULL,
      due_date TEXT,
      origin_doc_id INTEGER,
      related_property_id INTEGER,
      related_job_id INTEGER,
      related_provider_id INTEGER,
      related_childcare_id INTEGER,
      related_trip_id INTEGER,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(domain_id) REFERENCES domains(id),
      FOREIGN KEY(origin_doc_id) REFERENCES documents(id),
      FOREIGN KEY(related_property_id) REFERENCES properties(id),
      FOREIGN KEY(related_job_id) REFERENCES job_options(id),
      FOREIGN KEY(related_provider_id) REFERENCES providers(id),
      FOREIGN KEY(related_childcare_id) REFERENCES childcare_options(id),
      FOREIGN KEY(related_trip_id) REFERENCES trips(id)
    );
    CREATE TABLE IF NOT EXISTS work_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT,
      category TEXT,
      icon_emoji TEXT,
      related_task_id INTEGER,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(related_task_id) REFERENCES tasks(id)
    );
      CREATE TABLE IF NOT EXISTS compliance_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        subject_type TEXT NOT NULL,
        subject_name TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        due_date TEXT,
        completed_date TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
      -- Packing module
      CREATE TABLE IF NOT EXISTS packing_areas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        location_description TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS packing_boxes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        area_id INTEGER NOT NULL,
        label TEXT NOT NULL,
        box_type TEXT,
        weight_kg REAL,
        status TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(area_id) REFERENCES packing_areas(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS packing_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        box_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        fragile INTEGER DEFAULT 0,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(box_id) REFERENCES packing_boxes(id) ON DELETE CASCADE
      );

      -- Community module
      CREATE TABLE IF NOT EXISTS community_places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        address TEXT,
        category TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS community_visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        place_id INTEGER NOT NULL,
        visited_at TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(place_id) REFERENCES community_places(id) ON DELETE CASCADE
      );
  `);
}

export function seedBaseData(db: InstanceType<typeof Database>) {
  // Seed user
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const now = new Date().toISOString();
    db.prepare('INSERT INTO users (name, email, created_at, updated_at) VALUES (?, ?, ?, ?)')
      .run('Josh Parris', null, now, now);
  }
  // Seed domains
  const domainCount = db.prepare('SELECT COUNT(*) as count FROM domains').get().count;
  if (domainCount === 0) {
    const now = new Date().toISOString();
    const domains = [
      { name: 'Housing & Rentals', slug: 'housing' },
      { name: 'Kristy’s Work & Career', slug: 'kristy_work' },
      { name: 'Childcare & Schooling', slug: 'childcare_schooling' },
      { name: 'Health & MS / Neurology', slug: 'health_ms' },
      { name: 'Josh’s Work at DCS', slug: 'dcs_work' },
      { name: 'NDIS & Therapies (Sylvie)', slug: 'ndis_therapies' },
      { name: 'Licensing, Rego & WWCC', slug: 'licensing_rego' },
      { name: 'Utilities & Services', slug: 'utilities_services' },
      { name: 'Packing, Logistics & Travel', slug: 'packing_logistics' },
      { name: 'Church & Community', slug: 'church_community' },
      { name: 'What Should I Do Next', slug: 'next_actions' },
    ];
    for (const d of domains) {
      db.prepare('INSERT INTO domains (name, slug, created_at, updated_at) VALUES (?, ?, ?, ?)')
        .run(d.name, d.slug, now, now);
    }
  }
  // Optionally seed Bendigo property
  const propCount = db.prepare('SELECT COUNT(*) as count FROM properties').get().count;
  if (propCount === 0) {
    const now = new Date().toISOString();
    db.prepare('INSERT INTO properties (user_id, address, type, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(1, '53 Buckland St, Bendigo VIC', 'bendigo_home', 'owned', now, now);
  }

  // Seed some packing areas/boxes/items
  const areaCount = db.prepare('SELECT COUNT(*) as count FROM packing_areas').get().count;
  if (areaCount === 0) {
    const now = new Date().toISOString();
    const areaStmt = db.prepare('INSERT INTO packing_areas (user_id, name, location_description, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)');
    const boxStmt = db.prepare('INSERT INTO packing_boxes (area_id, label, box_type, weight_kg, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const itemStmt = db.prepare('INSERT INTO packing_items (box_id, name, quantity, fragile, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const r = areaStmt.run(1, 'Lounge', 'Downstairs lounge', 'Main living area boxes', now, now);
    const areaId = r.lastInsertRowid as number;
    const b1 = boxStmt.run(areaId, 'Box A - Books', 'cardboard', 10, 'packed', 'Heavy with books', now, now);
    const box1Id = b1.lastInsertRowid as number;
    itemStmt.run(box1Id, 'Hardcover books', 12, 0, null, now, now);
    itemStmt.run(box1Id, 'Magazines', 5, 0, null, now, now);
    const b2 = boxStmt.run(areaId, 'Box B - Kitchen', 'cardboard', 8, 'packed', null, now, now);
    const box2Id = b2.lastInsertRowid as number;
    itemStmt.run(box2Id, 'Plates', 8, 1, 'Wrap individually', now, now);
  }

  // Seed community places
  const cpCount = db.prepare('SELECT COUNT(*) as count FROM community_places').get().count;
  if (cpCount === 0) {
    const now = new Date().toISOString();
    db.prepare('INSERT INTO community_places (user_id, name, address, category, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(1, 'Local Church', '123 Church St', 'religion', null, now, now);
    db.prepare('INSERT INTO community_places (user_id, name, address, category, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(1, 'Community Centre', '45 Main Rd', 'community', null, now, now);
  }
}
