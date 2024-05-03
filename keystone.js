/* eslint-disable quotes */
import dotenv from 'dotenv';
import { config } from '@keystone-6/core';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

import { lists } from './schema.js';
import { storage } from './storage.js';
import { withAuth, session } from './auth/auth.js';

import sendEmail from './routes/sendEmail.js';
import validateRecaptcha from './routes/validateRecaptcha.js';

dotenv.config();

const { PORT, MAX_FILE_SIZE, DATABASE_URL, CORS_FRONTEND_ORIGIN } = process.env;

const corsFrontendOriginArray = CORS_FRONTEND_ORIGIN.split(',');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuter
  limit: 20000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});

const sendEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

const isDevelopment = process.env.NODE_ENV === 'development';

export default withAuth(
  config({
    server: {
      port: PORT,
      maxFileSize: MAX_FILE_SIZE,
      cors: { origin: [corsFrontendOriginArray], credentials: true },
      extendExpressApp: (app, commonContext) => {
        // app.use(
        //   helmet.contentSecurityPolicy({
        //     directives: {
        //       ...helmet.contentSecurityPolicy.getDefaultDirectives(),

        //       'default-src': ["'self'", "'unsafe-eval'"],
        //       'img-src': [
        //         "'self'",
        //         'data:',
        //         `https://${process.env.BUCKETEER_BUCKET_NAME}.s3.${process.env.BUCKETEER_AWS_REGION}.amazonaws.com`,
        //       ],
        //       'script-src': isDevelopment ? ["'self'", "'unsafe-eval'"] : ["'self'"],
        //     },
        //   })
        // );

        app.use(apiLimiter);

        app.use(express.json());
        app.post('/api/email', sendEmailLimiter, sendEmail);

        app.use('/public', express.static('public'));

        app.get('/signin', signInLimiter, (req, res) => res.redirect('/sign-in'));
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
