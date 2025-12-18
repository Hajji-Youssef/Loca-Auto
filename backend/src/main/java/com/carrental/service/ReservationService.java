package com.carrental.service;

import com.carrental.dto.response.ReservationResponse;
import com.carrental.entity.Reservation;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

	@Autowired
	private ReservationRepository reservationRepository;

	public List<ReservationResponse> getMyReservations(Long userId) {
		return reservationRepository.findByUserId(userId).stream().map(this::toResponse).collect(Collectors.toList());
	}

	public Reservation getReservationById(Long id) {
		return reservationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
	}

	private ReservationResponse toResponse(Reservation r) {
		ReservationResponse resp = new ReservationResponse();
		resp.setId(r.getId());
		resp.setUserId(r.getUser().getId());
		resp.setUsername(r.getUser().getUsername());
		resp.setCarId(r.getCar().getId());
		resp.setCarMake(r.getCar().getMake());
		resp.setCarModel(r.getCar().getModel());
		resp.setStartDate(r.getStartDate());
		resp.setEndDate(r.getEndDate());
		resp.setStatus(r.getStatus());
		resp.setPaymentStatus(r.getPaymentStatus());
		resp.setCreatedAt(r.getCreatedAt());
		if (r.getWorker() != null) {
			resp.setWorkerId(r.getWorker().getId());
			resp.setWorkerUsername(r.getWorker().getUsername());
		}
		return resp;
	}
}

