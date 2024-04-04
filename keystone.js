import { config } from '@keystone-6/core';
import express from 'express';
import dotenv from 'dotenv';

import { lists } from './schema';
import { storage } from './storage';
import { withAuth, session } from './auth/auth';

import sendEmail from './routes/sendEmail';
import validateRecaptcha from './routes/validateRecaptcha';

dotenv.config();

const { PORT, MAX_FILE_SIZE, DATABASE_URL, CORS_FRONTEND_ORIGIN } = process.env;

const corsFrontendOriginArray = CORS_FRONTEND_ORIGIN.split(',');

export default withAuth(
  config({
    server: {
      port: PORT,
      maxFileSize: MAX_FILE_SIZE,
      cors: { origin: [corsFrontendOriginArray], credentials: true },
      extendExpressApp: (app, commonContext) => {
        app.use(express.json());
        app.post('/api/email', sendEmail);
        // Denna ska bort när vi gått över till S3-Bucket
        app.use('/public', express.static('public'));

        app.get('/signin', (req, res) => res.redirect('/sign-in'));
        app.post('/api/validate-recaptcha', validateRecaptcha);
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
      publicPages: ['/validate-token', '/forgot-password', '/sign-in'],
    },
  })
);
