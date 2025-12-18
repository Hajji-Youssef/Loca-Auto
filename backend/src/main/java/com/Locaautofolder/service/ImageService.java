package com.carrental.service;

import com.carrental.entity.Car;
import com.carrental.entity.CarImage;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.CarImageRepository;
import com.carrental.repository.CarRepository;
import com.carrental.util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {

	private final Path uploadDir = Paths.get("uploads/cars");

	@Autowired
	private CarRepository carRepository;

	@Autowired
	private CarImageRepository carImageRepository;

	public String uploadImage(Long carId, MultipartFile file) {
		Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));
		if (!ValidationUtil.isValidImageFile(file)) {
			throw new IllegalArgumentException("Invalid image file");
		}
		try {
			Files.createDirectories(uploadDir);
			String ext = file.getOriginalFilename();
			String filename = UUID.randomUUID() + "_" + (ext == null ? "img" : ext.replaceAll("\\s+", ""));
			Path dest = uploadDir.resolve(filename);
			Files.copy(file.getInputStream(), dest);
			String url = "/uploads/cars/" + filename;
			CarImage img = CarImage.builder().car(car).imageUrl(url).build();
			carImageRepository.save(img);
			return url;
		} catch (IOException e) {
			throw new RuntimeException("Failed to store file", e);
		}
	}

	public void deleteImage(Long imageId) {
		CarImage img = carImageRepository.findById(imageId).orElseThrow(() -> new ResourceNotFoundException("Image not found"));
		String url = img.getImageUrl();
		try {
			Path p = uploadDir.resolve(Paths.get(url).getFileName());
			Files.deleteIfExists(p);
		} catch (Exception ignored) {}
		carImageRepository.delete(img);
	}
}

