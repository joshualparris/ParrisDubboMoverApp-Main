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
}
