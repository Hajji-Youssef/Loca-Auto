package com.carrental.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "cars")
public class Car {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String make;
	private String model;
	private Integer year;
	private Double pricePerDay;
	private Boolean isForRent;
	private Boolean isAvailable;

	public Car() {}

	public Car(Long id, String make, String model, Integer year, Double pricePerDay, Boolean isForRent, Boolean isAvailable) {
		this.id = id;
		this.make = make;
		this.model = model;
		this.year = year;
		this.pricePerDay = pricePerDay;
		this.isForRent = isForRent;
		this.isAvailable = isAvailable;
	}

    public Long getId() {
        return id;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public Integer getYear() {
        return year;
    }

    public Double getPricePerDay() {
        return pricePerDay;
    }

    public Boolean getForRent() {
        return isForRent;
    }

    public Boolean getAvailable() {
        return isAvailable;
    }

    public Boolean getIsForRent() {
        return isForRent;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsForRent(Boolean isForRent) {
        this.isForRent = isForRent;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void setPricePerDay(Double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public void setForRent(Boolean forRent) {
        isForRent = forRent;
    }

    public void setAvailable(Boolean available) {
        isAvailable = available;
    }

	public static Builder builder() { return new Builder(); }

	public static class Builder {
		private Long id;
		private String make;
		private String model;
		private Integer year;
		private Double pricePerDay;
		private Boolean isForRent;
		private Boolean isAvailable;

		public Builder id(Long id) { this.id = id; return this; }
		public Builder make(String make) { this.make = make; return this; }
		public Builder model(String model) { this.model = model; return this; }
		public Builder year(Integer year) { this.year = year; return this; }
		public Builder pricePerDay(Double pricePerDay) { this.pricePerDay = pricePerDay; return this; }
		public Builder isForRent(Boolean isForRent) { this.isForRent = isForRent; return this; }
		public Builder isAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; return this; }

		public Car build() {
			Car c = new Car();
			c.setId(this.id);
			c.setMake(this.make);
			c.setModel(this.model);
			c.setYear(this.year);
			c.setPricePerDay(this.pricePerDay);
			c.setIsForRent(this.isForRent);
			c.setIsAvailable(this.isAvailable);
			return c;
		}
	}
}
