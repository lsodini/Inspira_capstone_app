package LucaSodini.Inspira.enums;

public enum UserRole {
    ARTIST("ROLE_ARTIST"),
    BUYER("ROLE_BUYER"),
    ADMIN("ROLE_ADMIN");

    private final String authority;

    UserRole(String authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return authority;
    }
}
