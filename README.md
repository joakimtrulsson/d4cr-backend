# D4CR Keystone Server Installations Guide

## Konfigurera miljövariabler

- Skapa en .env-fil med nedanstående variabler och ange dina egna värden.

```
PORT=3000
MAX_FILE_SIZE = 10
BASE_URL = 'http://localhost:${PORT}/'
API_URL = '${BASE_URL}api/graphql'
CORS_FRONTEND_ORIGIN="http://localhost:4000,http://localhost:3001/"

# Session
SESSION_SECRET="myultrasecretstringmyultrasecretstring"
SESSION_MAX_AGE=2592000

# Database
DATABASE_URL="postgres://username@localhost:5432/db_name"

# Media
MEDIA_URL="${BASE_URL}public/media"
IMAGE_URL="${BASE_URL}public/images"

# Mail
EMAIL_SECURE=false
EMAIL_USERNAME=yourusername
EMAIL_PASSWORD=yourpassword
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=465
EMAIL_FROM=send@d4cr.com

# reCaptcha
RECAPTCHA_SITE_SECRET=yoursitesecret

```

## Mailtrap

- Gå till Mailtrap och skapa ett konto om du inte redan har ett.
- Efter att du har loggat in, skapa en ny inkorg genom att klicka på "Add Inbox" (Lägg till inkorg) och följ instruktionerna för att konfigurera den.
- När inkorgen är skapad, klicka på den för att få tillgång till dess inställningar.
- I inställningarna kommer du att hitta SMTP-serverinformation som du behöver för att fylla i din .env-fil. Notera användarnamn, lösenord, host och port.
- Återgå till din .env-fil och fyll i följande fält under "Mail":

```
   EMAIL_USERNAME: Ditt Mailtrap-användarnamn
   EMAIL_PASSWORD: Ditt Mailtrap-lösenord
   EMAIL_HOST: SMTP-host som tillhandahålls av Mailtrap
   EMAIL_PORT: SMTP-port som tillhandahålls av Mailtrap
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
