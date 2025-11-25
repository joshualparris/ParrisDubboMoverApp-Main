import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health';
import domainsRouter from './routes/domains';
import tasksRouter from './routes/tasks';
import documentsRouter from './routes/documents';
import comparisonRoutes from './routes/comparison';
import tripsRouter from './routes/trips';
import providersRouter from './routes/providers';
import appointmentsRouter from './routes/appointments';
import nextActionsRouter from './routes/next-actions';
import complianceItemsRouter from './routes/compliance-items';
import './db';

import workLinksRouter from './routes/work-links';
import propertiesRouter from './routes/properties';
import jobOptionsRouter from './routes/jobOptions';
import childcareOptionsRouter from './routes/childcareOptions';
import packingRouter from './routes/packing';
import communityRouter from './routes/community';
import path from 'path';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Mount API routes under /api
app.use('/api', healthRouter);
app.use('/api/domains', domainsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/documents', documentsRouter);
app.use('/api', comparisonRoutes);
app.use('/api/trips', tripsRouter);
app.use('/api/providers', providersRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/next-actions', nextActionsRouter);

app.use('/api/compliance-items', complianceItemsRouter);

app.use('/api/work-links', workLinksRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/job-options', jobOptionsRouter);
app.use('/api/childcare-options', childcareOptionsRouter);
app.use('/api/packing', packingRouter);
app.use('/api/community', communityRouter);

// Default homepage route
app.get('/', (req, res) => {
	res.send('<h1>PDM Server is running</h1><p>This is the backend API. Visit your client app at <a href="http://localhost:3000">localhost:3000</a>.</p>');
});

// Serve static frontend in production
const clientDist = path.join(__dirname, '../../client/dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

export default app;
