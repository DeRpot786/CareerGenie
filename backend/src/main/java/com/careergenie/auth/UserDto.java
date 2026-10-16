package com.careergenie.auth;

public record UserDto(Long id, String email, String role, boolean active) {}
