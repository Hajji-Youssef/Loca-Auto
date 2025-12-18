package com.carrental.controller;

import com.carrental.dto.response.UserResponse;
import com.carrental.security.SecurityUtils;
import com.carrental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping("/me")
	public ResponseEntity<UserResponse> me() {
		Long userId = SecurityUtils.getCurrentUserId();
		if (userId == null) {
			return ResponseEntity.status(401).build();
		}
		UserResponse resp = userService.getUserById(userId);
		return ResponseEntity.ok(resp);
	}
}
