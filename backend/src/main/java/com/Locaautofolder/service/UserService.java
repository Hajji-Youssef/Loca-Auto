package com.carrental.service;

import com.carrental.dto.response.UserResponse;
import com.carrental.entity.User;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	public UserResponse getUserById(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
