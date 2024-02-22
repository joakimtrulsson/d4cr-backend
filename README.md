# D4CR Keystone Server Installations Guide

## Konfigurera miljövariabler

- Skapa en .env-fil i /backend med nedanstående variabler och ange dina egna värden.

```
NODE_ENV=development
PORT=3000

MAX_FILE_SIZE = 10
BASE_URL = 'http://localhost:${PORT}/'
API_URL = '${BASE_URL}api/graphql'

# Session
SESSION_SECRET="myultrasecretstringmyultrasecretstring"
SESSION_MAX_AGE=2592000

# Database
DATABASE_URL="postgres://username@localhost:5432/db_name"

# Media
MEDIA_URL="${BASE_URL}public/media"
IMAGE_URL="${BASE_URL}public/images"

# Mail
## Development (Mailtrap)
EMAIL_USERNAME_DEV=yourusername
EMAIL_PASSWORD_DEV=yourpassword
EMAIL_HOST_DEV=sandbox.smtp.mailtrap.io
EMAIL_PORT_DEV=465

EMAIL_FROM=send@d4cr.com

## Production
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=

```

## Mailtrap

- Gå till Mailtrap och skapa ett konto om du inte redan har ett.
- Efter att du har loggat in, skapa en ny inkorg genom att klicka på "Add Inbox" (Lägg till inkorg) och följ instruktionerna för att konfigurera den.
- När inkorgen är skapad, klicka på den för att få tillgång till dess inställningar.
- I inställningarna kommer du att hitta SMTP-serverinformation som du behöver för att fylla i din .env-fil. Notera användarnamn, lösenord, host och port.
- Återgå till din .env-fil och fyll i följande fält under "Mail - Development (Mailtrap)":

```
   EMAIL_USERNAME_DEV: Ditt Mailtrap-användarnamn
   EMAIL_PASSWORD_DEV: Ditt Mailtrap-lösenord
   EMAIL_HOST_DEV: SMTP-host som tillhandahålls av Mailtrap
   EMAIL_PORT_DEV: SMTP-port som tillhandahålls av Mailtrap
```

## Postman

- Importera "postman_collection.json" till din Postman app.
- Denna fil innehåller en samling av fördefinierade API-förfrågningar som du kan använda för att interagera med.

## Skapa en Postgres databas lokalt

- Följ dessa steg för att skapa en Postgres-databas lokalt:
- Installera Postgres via [Download Postgres](https://postgresapp.com/downloads.html) om du inte redan har det.
- Skapa en ny databas via GUI.
- Uppdatera DATABASE_URL i .env.

## Start Keystone Js

- Använd följande kommando för att installera och starta din Keystone JS-server:

```
cd /backend
npm install
npm run dev

```

### Problem att lösa.

- När News hämtas som tillhör ett visst Chapter inkluderas även nyheter som inte är kopplade till något Chapter. Det förväntade beteendet är att endast nyheter som är associerade med det specifika Chapter ska hämtas. För att komma runt problemet just nu, får ni kontrollera om relatedChapters är falsy(!relatedChapters).

- När News hämtas som tillhör ett visst Chapter och en viss News Category inkluderas även nyheter som inte är kopplade till något Chapter. Det förväntade beteendet är att endast nyheter som är associerade med det specifika Chapter och NewsCategory ska hämtas. För att komma runt problemet just nu, får ni kontrollera om relatedChapters är falsy(!relatedChapters).
