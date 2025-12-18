package com.carrental.controller;

import com.carrental.dto.response.CarDetailResponse;
import com.carrental.service.CarService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cars")
public class CarController {

	@Autowired
	private CarService carService;

	@GetMapping
	public ResponseEntity<?> list(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
		Pageable pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(carService.getAllCars(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<CarDetailResponse> get(@PathVariable Long id) {
		return ResponseEntity.ok(carService.getCarById(id));
	}

	@GetMapping("/{id}/availability")
	public ResponseEntity<List<LocalDate>> availability(@PathVariable Long id,
														@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
														@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
		return ResponseEntity.ok(carService.getAvailableDates(id, startDate, endDate));
	}
}

