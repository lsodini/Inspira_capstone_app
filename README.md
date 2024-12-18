# Inspira

![Logo di Inspira](InspiraFE/inspira/public/images/Inspira-Brand.png)


Inspira è una social media web app dedicata all'arte, progettata per offrire agli utenti uno spazio dove possono condividere i propri pensieri, le opere d'arte, e informarsi sul mondo artistico. Questa applicazione combina un frontend sviluppato in React con un backend costruito con Java Spring e utilizza PostgreSQL come database.

## ✨ Caratteristiche Principali

- **Condivisione di Contenuti**: Gli utenti possono pubblicare i propri pensieri e le loro opere d'arte.
- **Esplorazione**: Possibilità di scoprire opere e contenuti condivisi da altri utenti.
- **Notizie sull'Arte**: Accesso a news e informazioni sul mondo artistico, recuperate tramite **News API**.
- **Interazione**: Gli utenti possono commentare e apprezzare i post.
- **Gestione Artwork**: Oltre ai post, gli utenti possono caricare artwork che in futuro potranno essere venduti.

## 🌐 Struttura del Progetto

### Frontend
- Framework: **React**
- Librerie principali:
  - **React Router**: Per la gestione della navigazione.
  - **Async/Await con Fetch API**: Per le richieste HTTP al backend, con gestione degli errori tramite `try` e `catch`.
  - **Bootstrap** e **CSS**: Per lo stile e il layout delle componenti.
  - Sviluppato utilizzando **VS Code**.

### Backend
- Framework: **Spring Boot**
- Moduli principali:
  - **Spring Web**: Per creare API RESTful.
  - **Spring Data JPA**: Per la gestione dei dati.
  - **Spring Security**: Per l'autenticazione e l'autorizzazione.
- Sviluppato utilizzando **IntelliJ IDEA**.

### Database
- **PostgreSQL**: Utilizzato per la memorizzazione dei dati.
- Modello dati:
  - Tabelle principali: `Users`, `Posts`, `Comments`, `Likes`, `Artworks`.

### Integrazioni Estese
- **News API**: Utilizzata per recuperare notizie e informazioni aggiornate sul mondo dell'arte.
- **Cloudinary**: Per la gestione e l'hosting delle immagini caricate dagli utenti.
- **Mailgun**: Per l'invio di email (ad esempio, per il recupero password).

## 🛠️ Requisiti

### Software Necessario
- **Node.js** (v16 o superiore) e npm/yarn
- **Java** (versione 11 o superiore)
- **PostgreSQL** (versione 12 o superiore)

### Configurazione del Backend
1. Clona il repository.
2. Configura il file `application.properties` in `src/main/resources/` come segue:

```properties
spring.application.name=Inspira
spring.config.import=file:env.properties

#Server Config
server.port=${SERVER_PORT}

#DB Config
spring.datasource.username=${POSTGRES_USERNAME}
spring.datasource.password=${POSTGRES_PASSWORD}
spring.datasource.url=${POSTGRES_URL}
spring.datasource.driver=org.postgresql.Driver

#Hibernate Config
spring.jpa.hibernate.ddl-auto=update

#JWT Config
jwt.secret=${JWT_SECRET}

# Configurazione Mailgun
mailgun.apikey=${MAILGUN_APIKEY}
mailgun.domain=${MAILGUN_DOMAIN}

# Configurazione Cloudinary
cloudinary.name=${CLOUDINARY_NAME}
cloudinary.key=${CLOUDINARY_KEY}
cloudinary.secret=${CLOUDINARY_SECRET}

# Configurazione upload file
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

3. Assicurati che il file `env.properties` contenga le variabili d'ambiente richieste.
4. Avvia il backend con il comando:

```bash
./mvnw spring-boot:run
```

### Configurazione del Frontend
1. Accedi alla directory del frontend chiamata inspiraFE e al suo interno accedi alla directory del progetto "inspira".
2. Installa le dipendenze:

```bash
npm install
```

3. Avvia l'applicazione React:

```bash
npm start
```

## 🔍 Come Usare Inspira

1. **Registrazione e Login**: Gli utenti possono registrarsi e accedere alla piattaforma.
2. **Creazione di Post**: Condividi pensieri o carica opere d'arte.
3. **Interazione**: Lascia un "mi piace" o commenta i post degli altri.
4. **Esplora**: Scopri contenuti di altri utenti e rimani aggiornato sulle novità artistiche.
5. **Artwork**: Carica opere d'arte per condividerle con la community e, in futuro, metterle in vendita.

## 🎨 Contributi

Siamo aperti ai contributi! Segui questi passi per contribuire:
1. Fai un fork del repository.
2. Crea un branch per le tue modifiche:

```bash
git checkout -b feature/nome-feature
```

3. Committa le modifiche e apri una pull request.

## 📢 Contatti
Per qualsiasi domanda o suggerimento, contattami a [lucasodini5@gmail.com](mailto:lucasodini5@gmail.com).

---

Grazie per aver scelto Inspira per condividere la tua passione per l'arte! 🌟

