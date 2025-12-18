package com.carrental.dto.response;

import java.time.LocalDateTime;

public class MissionResponse {
	private Long id;
	private Long carId;
	private String carMake;
	private String carModel;
	private Long workerId;
	private String workerUsername;
	private String missionText;
	private LocalDateTime startDate;
	private LocalDateTime finishDate;
	private LocalDateTime createdAt;

	public MissionResponse() {}

	public MissionResponse(Long id, Long carId, String carMake, String carModel, Long workerId, String workerUsername, String missionText, LocalDateTime startDate, LocalDateTime finishDate, LocalDateTime createdAt) {
		this.id = id;
		this.carId = carId;
		this.carMake = carMake;
		this.carModel = carModel;
		this.workerId = workerId;
		this.workerUsername = workerUsername;
		this.missionText = missionText;
		this.startDate = startDate;
		this.finishDate = finishDate;
		this.createdAt = createdAt;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public Long getCarId() { return carId; }
	public void setCarId(Long carId) { this.carId = carId; }

	public String getCarMake() { return carMake; }
	public void setCarMake(String carMake) { this.carMake = carMake; }

	public String getCarModel() { return carModel; }
	public void setCarModel(String carModel) { this.carModel = carModel; }

	public Long getWorkerId() { return workerId; }
	public void setWorkerId(Long workerId) { this.workerId = workerId; }

	public String getWorkerUsername() { return workerUsername; }
	public void setWorkerUsername(String workerUsername) { this.workerUsername = workerUsername; }

	public String getMissionText() { return missionText; }
	public void setMissionText(String missionText) { this.missionText = missionText; }

	public LocalDateTime getStartDate() { return startDate; }
	public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

	public LocalDateTime getFinishDate() { return finishDate; }
	public void setFinishDate(LocalDateTime finishDate) { this.finishDate = finishDate; }

	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 

