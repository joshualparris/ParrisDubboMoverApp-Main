import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import express from 'express';
import { createDocument, getDocumentById, listDocuments } from '../db/queries.documents';
import { extractTextFromFile } from '../services/documentTextExtractor';

const uploadDir = path.resolve(__dirname, '../../uploads');
const upload = multer({ dest: uploadDir });
const router = Router();

// POST /api/documents/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    const title = req.body.title || file.originalname;
    const user_id = 1; // For now, always user 1
    const content_text = await extractTextFromFile(file.path, file.mimetype, file.originalname);
    const now = new Date().toISOString();
    const doc = await createDocument({
      user_id,
      title,
      original_filename: file.originalname,
      source_path: file.path,
      content_text,
      uploaded_at: now,
      updated_at: now,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: 'Upload failed' });
  }
});

// GET /api/documents
router.get('/', async (req, res) => {
  const search = req.query.search as string | undefined;
  const docs = await listDocuments({ search });
  res.json(docs);
});

// GET /api/documents/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const doc = await getDocumentById(id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json(doc);
});

// GET /api/documents/download/:filename - download a document file with original filename
router.get('/download/:filename', async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', filename);
  // Find the document by source_path
  const db = require('../db/index').getDb();
  const doc = db.prepare('SELECT * FROM documents WHERE source_path LIKE ?').get(`%${filename}`);
  const originalName = doc?.original_filename || filename;
  res.download(filePath, originalName, err => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

export default router;
