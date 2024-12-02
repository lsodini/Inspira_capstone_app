package LucaSodini.Inspira.exceptions;

import java.io.IOException;

public class InvalidLineException extends IOException {
    public InvalidLineException(String message) {
        super(message);
    }
}
