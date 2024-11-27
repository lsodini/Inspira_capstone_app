package LucaSodini.Inspira.tools;

import kong.unirest.core.HttpResponse;
import kong.unirest.core.JsonNode;
import kong.unirest.core.Unirest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import LucaSodini.Inspira.entities.User;

@Component
public class MailGunSender {

    private final String apiKey;
    private final String domain;

    public MailGunSender(@Value("${mailgun.apikey}") String apiKey,
                         @Value("${mailgun.domain}") String domain) {
        this.apiKey = apiKey;
        this.domain = domain;
    }

    public void sendRegistrationEmail(User recipient) {
        String subject = "Benvenuto su Inspira!";
        String message = "Ciao " + recipient.getName() + ",\n\n" +
                "Grazie per esserti registrato su Inspira. Siamo felici di averti con noi!\n" +
                "Esplora, connettiti e lasciati ispirare dagli altri utenti.\n\n" +
                "Cordiali saluti,\nIl Team di Inspira";

        sendEmail(recipient.getEmail(), subject, message);
    }
    public void sendBecomeArtistEmail(User recipient) {
        String subject = "Congratulazioni, sei diventato un artista su Inspira!";
        String message = "Ciao " + recipient.getName() + ",\n\n" +
                "Congratulazioni! Ora sei ufficialmente un artista su Inspira. " +
                "Puoi iniziare a caricare i tuoi artwork e condividerli con la community.\n\n" +
                "Cordiali saluti,\nIl Team di Inspira";

        sendEmail(recipient.getEmail(), subject, message);
    }

    public void sendFollowNotification(User recipient, User follower) {
        String subject = "Hai un nuovo follower su Inspira!";
        String message = "Ciao " + recipient.getName() + ",\n\n" +
                follower.getName() + " " + follower.getSurname() +
                " ha iniziato a seguirti su Inspira.\n" +
                "Visita il suo profilo e scopri di più!\n\n" +
                "Cordiali saluti,\nIl Team di Inspira";

        sendEmail(recipient.getEmail(), subject, message);
    }

    // Email personalizzata per promozioni, eventi, ecc.
    public void sendCustomEmail(User recipient, String subject, String message) {
        sendEmail(recipient.getEmail(), subject, message);
    }

    // Metodo privato per inviare email generiche
    private void sendEmail(String to, String subject, String message) {
        try {
            HttpResponse<JsonNode> response = Unirest.post("https://api.mailgun.net/v3/" + this.domain + "/messages")
                    .basicAuth("api", this.apiKey)
                    .queryString("from", "Inspira Team <no-reply@" + this.domain + ">")
                    .queryString("to", to)
                    .queryString("subject", subject)
                    .queryString("text", message)
                    .asJson();

            if (response.getStatus() != 200) {
                throw new RuntimeException("Errore durante l'invio dell'email: " + response.getBody().toString());
            }

            System.out.println("Email inviata con successo a " + to);
        } catch (Exception e) {
            System.err.println("Errore nell'invio dell'email: " + e.getMessage());
        }
    }
}
