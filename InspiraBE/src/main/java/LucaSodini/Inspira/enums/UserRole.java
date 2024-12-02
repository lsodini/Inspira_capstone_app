package LucaSodini.Inspira.enums;

public enum UserRole {
    ARTIST("ARTIST"),
    BUYER("BUYER"),
    ADMIN("ADMIN");

    private final String authority;

    UserRole(String authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return authority;
    }
}
