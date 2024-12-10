package LucaSodini.Inspira.payloads;

import LucaSodini.Inspira.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserDTO(
        @NotEmpty(message = "Lo username è obbligatorio!")
        @Size(min = 2, max = 40, message = "Lo username deve essere compreso tra 2 e 40 caratteri!")
        String username,
        @NotEmpty(message = "L'email è obbligatoria!")
        @Email(message = "L'email inserita non è un'email valida!")
        String email,
        @NotEmpty(message = "password vuota")
        @Size(min = 4, message = "La password deve avere almeno 4 caratteri!")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", message = "La password non segue i criteri comuni")
        String password,
        @NotEmpty(message = "Il nome è obbligatorio!")
        @Size(min = 2, max = 40, message = "Il nome deve essere compreso tra 2 e 40 caratteri!")
        String name,
        @NotEmpty(message = "il cognome è obbligatorio!")
        @Size(min = 2, max = 40, message = "Il cognome deve essere compreso tra 2 e 40 caratteri!")
        String surname,

        String bio,
        UserRole role
) {
}