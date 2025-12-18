package com.carrental.controller;

import com.carrental.dto.request.CarCreateRequest;
import com.carrental.service.CarService;
import com.carrental.entity.Car;
import com.carrental.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	@Autowired
	private CarService carService;

	@Autowired
	private ImageService imageService;

	@PostMapping("/cars")
	public ResponseEntity<?> createCar(@RequestBody CarCreateRequest req) {
		// minimal create
		Car car = Car.builder()
				.make(req.getMake())
				.model(req.getModel())
				.year(req.getYear())
				.pricePerDay(req.getPricePerDay())
				.isForRent(req.getIsForRent())
				.isAvailable(true)
				.build();
		car = carService.createCar(car);
		return new ResponseEntity<>(car, HttpStatus.CREATED);
	}

	@PutMapping("/cars/{id}")
	public ResponseEntity<?> updateCar(@PathVariable Long id, @RequestBody CarCreateRequest req) {
		Car car = Car.builder()
				.make(req.getMake())
				.model(req.getModel())
				.year(req.getYear())
				.pricePerDay(req.getPricePerDay())
				.isForRent(req.getIsForRent())
				.build();
		car = carService.updateCar(id, car);
		return ResponseEntity.ok(car);
	}

	@DeleteMapping("/cars/{id}")
	public ResponseEntity<?> deleteCar(@PathVariable Long id) {
		carService.deleteCar(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/cars/{id}/images")
	public ResponseEntity<?> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
		String url = imageService.uploadImage(id, file);
		return ResponseEntity.ok(java.util.Map.of("imageUrl", url));
	}

	@DeleteMapping("/images/{id}")
	public ResponseEntity<?> deleteImage(@PathVariable Long id) {
		imageService.deleteImage(id);
		return ResponseEntity.ok().build();
	}
}

