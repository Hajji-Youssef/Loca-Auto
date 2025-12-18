package com.carrental.service;

import com.carrental.dto.request.LoginRequest;
import com.carrental.dto.request.RegisterRequest;
import com.carrental.dto.response.AuthResponse;
import com.carrental.dto.response.UserResponse;
import com.carrental.entity.User;
import com.carrental.enums.OnlineStatus;
import com.carrental.enums.Role;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.UnauthorizedException;
import com.carrental.repository.UserRepository;
import com.carrental.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	public AuthResponse register(RegisterRequest request) {
		if (userRepository.findByUsername(request.getUsername()).isPresent()) {
			throw new BadRequestException("Username already exists");
		}
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new BadRequestException("Email already exists");
		}

		User user = User.builder()
				.username(request.getUsername())
				.email(request.getEmail())
				.passwordHash(passwordEncoder.encode(request.getPassword()))
				.role(Role.USER)
				.onlineStatus(OnlineStatus.LOGGED_OUT)
				.lastActivity(LocalDateTime.now())
				.build();

		user = userRepository.save(user);

		String token = jwtTokenProvider.generateToken(user);
		UserResponse userResp = toUserResponse(user);
		return new AuthResponse(token, "Bearer", userResp);
	}

	public AuthResponse login(LoginRequest request) {
		User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UnauthorizedException("User not found"));
		if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
			throw new UnauthorizedException("Invalid credentials");
		}

		user.setOnlineStatus(OnlineStatus.ACTIVE);
		user.setLastActivity(LocalDateTime.now());
		userRepository.save(user);

		String token = jwtTokenProvider.generateToken(user);
		return new AuthResponse(token, "Bearer", toUserResponse(user));
	}

	public void logout(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new BadRequestException("User not found"));
		user.setOnlineStatus(OnlineStatus.LOGGED_OUT);
		user.setLastActivity(LocalDateTime.now());
		userRepository.save(user);
	}

	public UserResponse getCurrentUser(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new BadRequestException("User not found"));
		return toUserResponse(user);
	}

	private UserResponse toUserResponse(User user) {
		UserResponse r = new UserResponse();
		r.setId(user.getId());
		r.setUsername(user.getUsername());
		r.setEmail(user.getEmail());
		r.setRole(user.getRole());
		r.setOnlineStatus(user.getOnlineStatus());
		r.setLastActivity(user.getLastActivity());
		return r;
	}
}

