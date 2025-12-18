package com.carrental.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carrental.dto.request.LoginRequest;
import com.carrental.dto.request.RegisterRequest;
import com.carrental.dto.response.AuthResponse;
import com.carrental.security.SecurityUtils;
import com.carrental.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Validated @RequestBody RegisterRequest request) {
		AuthResponse response = authService.register(request);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Validated @RequestBody LoginRequest request) {
		AuthResponse response = authService.login(request);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout() {
		Long userId = SecurityUtils.getCurrentUserId();
		if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		authService.logout(userId);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/me")
	public ResponseEntity<com.carrental.dto.response.UserResponse> me() {
		Long userId = SecurityUtils.getCurrentUserId();
		if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		return ResponseEntity.ok(authService.getCurrentUser(userId));
	}
}

