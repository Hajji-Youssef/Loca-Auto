package com.carrental.dto.mapper;

import com.carrental.dto.response.CarDetailResponse;
import com.carrental.dto.response.CarResponse;
import com.carrental.entity.Car;
import com.carrental.entity.CarImage;

import java.util.List;
import java.util.stream.Collectors;

public class CarMapper {

	public static CarResponse toResponse(Car car, String mainImageUrl) {
		CarResponse r = new CarResponse();
		r.setId(car.getId());
		r.setMake(car.getMake());
		r.setModel(car.getModel());
		r.setYear(car.getYear());
		r.setPricePerDay(car.getPricePerDay());
		r.setIsForRent(car.getIsForRent());
		r.setIsAvailable(car.getIsAvailable());
		r.setMainImageUrl(mainImageUrl);
		return r;
	}

	public static CarDetailResponse toDetailResponse(Car car, List<CarImage> images, List<java.time.LocalDate> unavailableDates) {
		CarDetailResponse r = new CarDetailResponse();
		r.setId(car.getId());
		r.setMake(car.getMake());
		r.setModel(car.getModel());
		r.setYear(car.getYear());
		r.setPricePerDay(car.getPricePerDay());
		r.setIsForRent(car.getIsForRent());
		r.setIsAvailable(car.getIsAvailable());
		r.setImages(images.stream().map(CarImage::getImageUrl).collect(Collectors.toList()));
		r.setUnavailableDates(unavailableDates);
		return r;
	}
}

