package com.carrental.service;

import com.carrental.dto.request.MissionRequest;
import com.carrental.dto.response.MissionResponse;
import com.carrental.entity.Car;
import com.carrental.entity.Mission;
import com.carrental.entity.User;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.CarRepository;
import com.carrental.repository.MissionRepository;
import com.carrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MissionService {

	@Autowired
	private MissionRepository missionRepository;

	@Autowired
	private CarRepository carRepository;

	@Autowired
	private UserRepository userRepository;

	public MissionResponse createMission(MissionRequest request, Long workerId) {
		Car car = carRepository.findById(request.getCarId()).orElseThrow(() -> new ResourceNotFoundException("Car not found"));
		User worker = userRepository.findById(workerId).orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
		Mission m = Mission.builder().car(car).worker(worker).missionText(request.getMissionText()).startDate(LocalDateTime.now()).createdAt(LocalDateTime.now()).build();
		m = missionRepository.save(m);
		car.setIsAvailable(false);
		carRepository.save(car);
		return toResponse(m);
	}

	public List<MissionResponse> getActiveMissions() {
		return missionRepository.findByFinishDateIsNull().stream().map(this::toResponse).collect(Collectors.toList());
	}

	public List<MissionResponse> getMyMissions(Long workerId) {
		return missionRepository.findByWorkerId(workerId).stream().filter(m -> m.getFinishDate() == null).map(this::toResponse).collect(Collectors.toList());
	}

	public List<MissionResponse> getMissionsByCarId(Long carId) {
		return missionRepository.findByCarId(carId).stream().filter(m -> m.getFinishDate() == null).map(this::toResponse).collect(Collectors.toList());
	}

	public void completeMission(Long missionId, Long workerId) {
		Mission m = missionRepository.findById(missionId).orElseThrow(() -> new ResourceNotFoundException("Mission not found"));
		Car car = m.getCar();
		car.setIsAvailable(true);
		carRepository.save(car);
		missionRepository.delete(m);
	}

	public MissionResponse updateMission(Long missionId, String newText) {
		Mission m = missionRepository.findById(missionId).orElseThrow(() -> new ResourceNotFoundException("Mission not found"));
		m.setMissionText(newText);
		missionRepository.save(m);
		return toResponse(m);
	}

	public void deleteMission(Long missionId) {
		Mission m = missionRepository.findById(missionId).orElseThrow(() -> new ResourceNotFoundException("Mission not found"));
		Car car = m.getCar();
		boolean hasOtherActive = missionRepository.findByCarId(car.getId()).stream().anyMatch(ms -> ms.getId() != missionId && ms.getFinishDate() == null);
		if (!hasOtherActive) {
			car.setIsAvailable(true);
			carRepository.save(car);
		}
		missionRepository.delete(m);
	}

	private MissionResponse toResponse(Mission m) {
		MissionResponse resp = new MissionResponse();
		resp.setId(m.getId());
		resp.setCarId(m.getCar().getId());
		resp.setCarMake(m.getCar().getMake());
		resp.setCarModel(m.getCar().getModel());
		resp.setWorkerId(m.getWorker().getId());
		resp.setWorkerUsername(m.getWorker().getUsername());
		resp.setMissionText(m.getMissionText());
		resp.setStartDate(m.getStartDate());
		resp.setFinishDate(m.getFinishDate());
		resp.setCreatedAt(m.getCreatedAt());
		return resp;
	}
}
