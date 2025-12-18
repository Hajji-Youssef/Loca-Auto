package com.carrental.service;

import com.carrental.dto.response.CarDetailResponse;
import com.carrental.dto.response.CarResponse;
import com.carrental.entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface CarService {
    Page<CarResponse> getAllCars(Pageable pageable);

    CarDetailResponse getCarById(Long carId);

    List<LocalDate> getAvailableDates(Long carId, LocalDate start, LocalDate end);

    Car createCar(Car car);

    Car updateCar(Long id, Car data);

    void deleteCar(Long id);
}
