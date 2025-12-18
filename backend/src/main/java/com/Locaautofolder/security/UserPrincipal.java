package com.carrental.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.carrental.entity.User;
import com.carrental.enums.Role;

public class UserPrincipal implements UserDetails {

	private final Long userId;
	private final String username;
	private final String password;
	private final Role role;

	public UserPrincipal(Long userId, String username, String password, Role role) {
		this.userId = userId;
		this.username = username;
		this.password = password;
		this.role = role;
	}

	public static UserPrincipal fromUser(User user) {
		return new UserPrincipal(user.getId(), user.getUsername(), user.getPasswordHash(), user.getRole());
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}

	@Override
	public String getPassword() { return password; }

	@Override
	public String getUsername() { return username; }

	@Override
	public boolean isAccountNonExpired() { return true; }

	@Override
	public boolean isAccountNonLocked() { return true; }

	@Override
	public boolean isCredentialsNonExpired() { return true; }

	@Override
	public boolean isEnabled() { return true; }

	public Long getUserId() { return userId; }
}
