package com.carrental.dto.response;

import com.carrental.enums.OnlineStatus;
import com.carrental.enums.Role;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private OnlineStatus onlineStatus;
    private LocalDateTime lastActivity;

    public UserResponse() {}

    public UserResponse(Long id, String username, String email, Role role, OnlineStatus onlineStatus, LocalDateTime lastActivity) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.onlineStatus = onlineStatus;
        this.lastActivity = lastActivity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public OnlineStatus getOnlineStatus() { return onlineStatus; }
    public void setOnlineStatus(OnlineStatus onlineStatus) { this.onlineStatus = onlineStatus; }

    public LocalDateTime getLastActivity() { return lastActivity; }
    public void setLastActivity(LocalDateTime lastActivity) { this.lastActivity = lastActivity; }
} 
