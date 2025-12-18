package com.carrental.dto.response;

public class CarResponse {
	private Long id;
	private String make;
	private String model;
	private Integer year;
	private Double pricePerDay;
	private Boolean isForRent;
	private Boolean isAvailable;
	private String mainImageUrl;

	public CarResponse() {}

	public CarResponse(Long id, String make, String model, Integer year, Double pricePerDay, Boolean isForRent, Boolean isAvailable, String mainImageUrl) {
		this.id = id;
		this.make = make;
		this.model = model;
		this.year = year;
		this.pricePerDay = pricePerDay;
		this.isForRent = isForRent;
		this.isAvailable = isAvailable;
		this.mainImageUrl = mainImageUrl;
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

	public String getMainImageUrl() { return mainImageUrl; }
	public void setMainImageUrl(String mainImageUrl) { this.mainImageUrl = mainImageUrl; }
} 

