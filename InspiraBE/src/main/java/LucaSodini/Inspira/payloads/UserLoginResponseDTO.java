package LucaSodini.Inspira.payloads;

public record UserLoginResponseDTO(
        String accessToken,
        long userId,
        String username,
        String avatarUrl
) {
}
