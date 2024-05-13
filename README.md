# D4CR Keystone Server Installations Guide

## Konfigurera miljövariabler

- Skapa en .env-fil med nedanstående variabler och ange dina egna värden.

```
PORT=3000

MAX_FILE_SIZE = 10
BASE_URL = 'https://localhost:${PORT}/'
NEXT_PUBLIC_BASE_URL = 'http://localhost:${PORT}/'
API_URL = '${BASE_URL}api/graphql'
CORS_FRONTEND_ORIGIN="http://localhost:3001,http://localhost:3001/"

# Session
SESSION_SECRET="AC84999C253C5F579114176142392AC84999C253C5F579114176142392"
SESSION_MAX_AGE=2592000

# Database
DATABASE_URL="postgres://postgres@localhost:5432/d4cr_db"

# Media
MEDIA_URL="https://bucketeer-1f163294-7339-4eb0-af5c-400b0ce7209a.s3.eu-west-1.amazonaws.com/public/media"
IMAGE_URL="https://bucketeer-1f163294-7339-4eb0-af5c-400b0ce7209a.s3.eu-west-1.amazonaws.com/public/images"

# Mail
EMAIL_USERNAME=48baced3ac2193
EMAIL_PASSWORD=6330846f88ef93
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=465
EMAIL_SECURE=false
EMAIL_FROM=send@d4cr.com

# reCaptcha
RECAPTCHA_SITE_SECRET="Yoursecret"

# Bucketeer
BUCKETEER_BUCKET_NAME="bucketname"
BUCKETEER_AWS_REGION="eu-west-1"
BUCKETEER_AWS_ACCESS_KEY_ID="Accesskey"
BUCKETEER_AWS_SECRET_ACCESS_KEY="Secretkey"
```

## Skapa en Postgres databas lokalt

- Följ dessa steg för att skapa en Postgres-databas lokalt:
- Installera Postgres via [Download Postgres](https://postgresapp.com/downloads.html) om du inte redan har det.
- Skapa en ny databas via GUI.
- Uppdatera DATABASE_URL i .env.

## Start Keystone Js

- Använd följande kommando för att installera och starta din Keystone JS-server:

```
npm install
npm run dev

```
