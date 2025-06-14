export const PasswordEnum = Object.freeze({
    SALT_GENERATED: String(process.env.SALT_GENERATED),
    MIN_PASSWORD_LENGTH : 6,
    SECRET_KEY: String(process.env.SECRET_KEY),
});
