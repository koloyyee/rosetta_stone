package co.loyyee.sync_countdown.auth;

public record ResultResponse<T>(String message, T data , boolean success) {
}
