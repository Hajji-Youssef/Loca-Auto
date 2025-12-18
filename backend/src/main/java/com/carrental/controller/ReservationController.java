package com.carrental.controller;

import com.carrental.dto.response.ReservationResponse;
import com.carrental.security.SecurityUtils;
import com.carrental.service.ReservationService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

	@Autowired
	private ReservationService reservationService;

	@GetMapping("/my")
	public ResponseEntity<List<ReservationResponse>> myReservations() {
		Long userId = SecurityUtils.getCurrentUserId();
		return ResponseEntity.ok(reservationService.getMyReservations(userId));
	}
}
