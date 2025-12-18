package com.carrental.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MissionRequest {
    @NotNull
    private Long carId;

    @NotBlank
    private String missionText;

    public MissionRequest() {}

    public MissionRequest(Long carId, String missionText) {
        this.carId = carId;
        this.missionText = missionText;
    }

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }

    public String getMissionText() { return missionText; }
    public void setMissionText(String missionText) { this.missionText = missionText; }
} 
