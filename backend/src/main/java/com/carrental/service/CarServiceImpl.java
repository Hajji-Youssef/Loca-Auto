package com.carrental.service;

import com.carrental.dto.response.CarDetailResponse;
import com.carrental.dto.response.CarResponse;
import com.carrental.dto.mapper.CarMapper;
import com.carrental.entity.Car;
import com.carrental.entity.CarImage;
import com.carrental.entity.Reservation;
import com.carrental.entity.Mission;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.CarImageRepository;
import com.carrental.repository.CarRepository;
import com.carrental.repository.MissionRepository;
import com.carrental.repository.ReservationRepository;
import com.carrental.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarServiceImpl implements CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CarImageRepository carImageRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private MissionRepository missionRepository;

    public Page<CarResponse> getAllCars(Pageable pageable) {
        Page<Car> page = carRepository.findAll(pageable);
        List<CarResponse> list = page.getContent().stream().map(c -> {
            List<CarImage> imgs = carImageRepository.findByCarId(c.getId());
            String main = imgs.isEmpty() ? null : imgs.get(0).getImageUrl();
            return CarMapper.toResponse(c, main);
        }).collect(Collectors.toList());
        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    public CarDetailResponse getCarById(Long carId) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        List<CarImage> images = carImageRepository.findByCarId(carId);
        // gather unavailable dates from active reservations and missions
        List<LocalDate> unavailable = new ArrayList<>();
        List<Reservation> reservations = reservationRepository.findByCarIdAndStatus(carId, com.carrental.enums.ReservationStatus.ACTIVE);
        for (Reservation r : reservations) {
            LocalDate start = r.getStartDate().toLocalDate();
            LocalDate end = r.getEndDate().toLocalDate();
            unavailable.addAll(DateUtil.getDatesBetween(start, end));
        }
        List<Mission> missions = missionRepository.findByCarId(carId);
        for (Mission m : missions) {
            if (m.getFinishDate() == null) {
                LocalDate start = m.getStartDate().toLocalDate();
                // assume ongoing mission - mark until today
                LocalDate end = LocalDate.now(ZoneId.systemDefault());
                unavailable.addAll(DateUtil.getDatesBetween(start, end));
            } else {
                unavailable.addAll(DateUtil.getDatesBetween(m.getStartDate().toLocalDate(), m.getFinishDate().toLocalDate()));
            }
        }
        // deduplicate
        List<LocalDate> unique = unavailable.stream().distinct().collect(Collectors.toList());
        return CarMapper.toDetailResponse(car, images, unique);
    }

    public List<LocalDate> getAvailableDates(Long carId, LocalDate start, LocalDate end) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        List<LocalDate> all = DateUtil.getDatesBetween(start, end);
        List<LocalDate> occupied = new ArrayList<>();
        List<Reservation> reservations = reservationRepository.findByCarIdAndStatus(carId, com.carrental.enums.ReservationStatus.ACTIVE);
        for (Reservation r : reservations) {
            occupied.addAll(DateUtil.getDatesBetween(r.getStartDate().toLocalDate(), r.getEndDate().toLocalDate()));
        }
        List<Mission> missions = missionRepository.findByCarId(carId);
        for (Mission m : missions) {
            LocalDate ms = m.getStartDate().toLocalDate();
            LocalDate me = m.getFinishDate() == null ? LocalDate.now(ZoneId.systemDefault()) : m.getFinishDate().toLocalDate();
            occupied.addAll(DateUtil.getDatesBetween(ms, me));
        }
        return all.stream().filter(d -> !occupied.contains(d)).collect(Collectors.toList());
    }

    public Car createCar(Car car) {
        return carRepository.save(car);
    }

    public Car updateCar(Long id, Car data) {
        Car car = carRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        car.setMake(data.getMake());
        car.setModel(data.getModel());
        car.setYear(data.getYear());
        car.setPricePerDay(data.getPricePerDay());
        car.setIsForRent(data.getIsForRent());
        car.setIsAvailable(data.getIsAvailable());
        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }
}
