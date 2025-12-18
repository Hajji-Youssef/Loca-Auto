package com.carrental.entity;

import com.carrental.enums.OnlineStatus;
import com.carrental.enums.Role;
import jakarta.persistence.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

	public static Builder builder() { return new Builder(); }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String username;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String passwordHash;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role;

	@Enumerated(EnumType.STRING)
	private OnlineStatus onlineStatus;

	private LocalDateTime lastActivity;

	public User() {}

	public User(Long id, String username, String email, String passwordHash, Role role, OnlineStatus onlineStatus, LocalDateTime lastActivity) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.passwordHash = passwordHash;
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

	public String getPasswordHash() { return passwordHash; }
	public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

	public Role getRole() { return role; }
	public void setRole(Role role) { this.role = role; }

	public OnlineStatus getOnlineStatus() { return onlineStatus; }
	public void setOnlineStatus(OnlineStatus onlineStatus) { this.onlineStatus = onlineStatus; }

	public LocalDateTime getLastActivity() { return lastActivity; }
	public void setLastActivity(LocalDateTime lastActivity) { this.lastActivity = lastActivity; }

	public static class Builder {
		private Long id;
		private String username;
		private String email;
		private String passwordHash;
		private Role role;
		private OnlineStatus onlineStatus;
		private LocalDateTime lastActivity;

		public Builder id(Long id) { this.id = id; return this; }
		public Builder username(String username) { this.username = username; return this; }
		public Builder email(String email) { this.email = email; return this; }
		public Builder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
		public Builder role(Role role) { this.role = role; return this; }
		public Builder onlineStatus(OnlineStatus onlineStatus) { this.onlineStatus = onlineStatus; return this; }
		public Builder lastActivity(LocalDateTime lastActivity) { this.lastActivity = lastActivity; return this; }

		public User build() {
			User u = new User();
			u.setId(this.id);
			u.setUsername(this.username);
			u.setEmail(this.email);
			u.setPasswordHash(this.passwordHash);
			u.setRole(this.role);
			u.setOnlineStatus(this.onlineStatus);
			u.setLastActivity(this.lastActivity);
			return u;
		}
	}
} 
