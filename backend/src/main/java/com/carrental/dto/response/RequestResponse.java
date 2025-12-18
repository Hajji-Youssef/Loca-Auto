package com.carrental.dto.response;

import com.carrental.enums.RequestStatus;
import java.time.LocalDateTime;

public class RequestResponse {
    private Long id;
    private Long userId;
    private String username;
    private Long carId;
    private String carMake;
    private String carModel;
    private RequestStatus requestStatus;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;

    public RequestResponse() {}

    public RequestResponse(Long id, Long userId, String username, Long carId, String carMake, String carModel, RequestStatus requestStatus, LocalDateTime startDate, LocalDateTime endDate, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.carId = carId;
        this.carMake = carMake;
        this.carModel = carModel;
        this.requestStatus = requestStatus;
        this.startDate = startDate;
        this.endDate = endDate;
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

    public RequestStatus getRequestStatus() { return requestStatus; }
    public void setRequestStatus(RequestStatus requestStatus) { this.requestStatus = requestStatus; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 
