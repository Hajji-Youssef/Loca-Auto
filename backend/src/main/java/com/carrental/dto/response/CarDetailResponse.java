package com.carrental.dto.response;

import java.time.LocalDate;
import java.util.List;

public class CarDetailResponse {
	private Long id;
	private String make;
	private String model;
	private Integer year;
	private Double pricePerDay;
	private Boolean isForRent;
	private Boolean isAvailable;
	private List<String> images;
	private List<LocalDate> unavailableDates;

	public CarDetailResponse() {}

	public CarDetailResponse(Long id, String make, String model, Integer year, Double pricePerDay, Boolean isForRent, Boolean isAvailable, List<String> images, List<LocalDate> unavailableDates) {
		this.id = id;
		this.make = make;
		this.model = model;
		this.year = year;
		this.pricePerDay = pricePerDay;
		this.isForRent = isForRent;
		this.isAvailable = isAvailable;
		this.images = images;
		this.unavailableDates = unavailableDates;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

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

	public Boolean getIsAvailable() { return isAvailable; }
	public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

	public List<String> getImages() { return images; }
	public void setImages(List<String> images) { this.images = images; }

	public List<LocalDate> getUnavailableDates() { return unavailableDates; }
	public void setUnavailableDates(List<LocalDate> unavailableDates) { this.unavailableDates = unavailableDates; }
} 

