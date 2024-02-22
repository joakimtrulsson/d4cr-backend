import { config } from '@keystone-6/core';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import { lists } from './schema';
import { storage } from './storage';
import { withAuth, session } from './auth/auth';

import sendEmail from './routes/emailRoutes';

dotenv.config();

const { PORT, MAX_FILE_SIZE, DATABASE_URL } = process.env;

export default withAuth(
  config({
    server: {
      port: PORT,
      maxFileSize: MAX_FILE_SIZE,
      cors: { origin: ['*'], credentials: true },
      extendExpressApp: (app, commonContext) => {
        if (process.env.NODE_ENV === 'development') {
          app.use(morgan('dev'));
        }
        app.use(express.json());
        app.use('/public', express.static('public'));
        app.post('/api/email', sendEmail);
      },
    },
    db: {
      provider: 'postgresql',
      url: DATABASE_URL,
      idField: { kind: 'uuid' },
      // shadowDatabaseUrl: 'postgres://dbuser:dbpass@localhost:5432/shadowdb'
    },
    lists,
    session,
    storage,
    ui: {
      publicPages: ['public'],
    },
  })
);
