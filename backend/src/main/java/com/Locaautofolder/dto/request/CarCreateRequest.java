package com.carrental.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public class CarCreateRequest {
    @NotBlank
    private String make;

    @NotBlank
    private String model;

    @NotNull
    @Positive
    private Integer year;

    @NotNull
    @PositiveOrZero
    private Double pricePerDay;

    @NotNull
    private Boolean isForRent;

    public CarCreateRequest() {}

    public CarCreateRequest(String make, String model, Integer year, Double pricePerDay, Boolean isForRent) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.pricePerDay = pricePerDay;
        this.isForRent = isForRent;
    }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Double getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(Double pricePerDay) { this.pricePerDay = pricePerDay; }

        public Boolean getIsForRent() { return isForRent; }
        public void setIsForRent(Boolean isForRent) { this.isForRent = isForRent; }
    }
