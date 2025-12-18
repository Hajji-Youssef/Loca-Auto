package com.carrental.dto.response;

import com.carrental.enums.PaymentStatus;
import com.carrental.enums.ReservationStatus;
import java.time.LocalDateTime;

public class ReservationResponse {
	private Long id;
	private Long userId;
	private String username;
	private Long carId;
	private String carMake;
	private String carModel;
	private Long workerId;
	private String workerUsername;
	private LocalDateTime startDate;
	private LocalDateTime endDate;
	private ReservationStatus status;
	private PaymentStatus paymentStatus;
	private LocalDateTime createdAt;

	public ReservationResponse() {}

	public ReservationResponse(Long id, Long userId, String username, Long carId, String carMake, String carModel, Long workerId, String workerUsername, LocalDateTime startDate, LocalDateTime endDate, ReservationStatus status, PaymentStatus paymentStatus, LocalDateTime createdAt) {
		this.id = id;
		this.userId = userId;
		this.username = username;
		this.carId = carId;
		this.carMake = carMake;
		this.carModel = carModel;
		this.workerId = workerId;
		this.workerUsername = workerUsername;
		this.startDate = startDate;
		this.endDate = endDate;
		this.status = status;
		this.paymentStatus = paymentStatus;
		this.createdAt = createdAt;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public Long getUserId() { return userId; }
	public void setUserId(Long userId) { this.userId = userId; }

	public String getUsername() { return username; }
	public void setUsername(String username) { this.username = username; }

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

	public LocalDateTime getStartDate() { return startDate; }
	public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

	public LocalDateTime getEndDate() { return endDate; }
	public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

	public ReservationStatus getStatus() { return status; }
	public void setStatus(ReservationStatus status) { this.status = status; }

	public PaymentStatus getPaymentStatus() { return paymentStatus; }
	public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 

