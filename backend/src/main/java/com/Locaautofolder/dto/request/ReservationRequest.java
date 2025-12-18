package com.carrental.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;


public class ReservationRequest {
    @NotNull
    private Long carId;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;

    public ReservationRequest() {}

    public ReservationRequest(Long carId, LocalDateTime startDate, LocalDateTime endDate) {
        this.carId = carId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
} 
