package com.carrental.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "car_images")
public class CarImage {

	public static Builder builder() { return new Builder(); }
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String imageUrl;

	@ManyToOne
	private Car car;

	public CarImage() {}

	public CarImage(Long id, String imageUrl, Car car) {
		this.id = id;
		this.imageUrl = imageUrl;
		this.car = car;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getImageUrl() { return imageUrl; }
	public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

	public Car getCar() { return car; }
	public void setCar(Car car) { this.car = car; }

	public static class Builder {
		private Long id;
		private String imageUrl;
		private Car car;

		public Builder id(Long id) { this.id = id; return this; }
		public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
		public Builder car(Car car) { this.car = car; return this; }

		public CarImage build() {
			CarImage ci = new CarImage();
			ci.setId(this.id);
			ci.setImageUrl(this.imageUrl);
			ci.setCar(this.car);
			return ci;
		}
	}
} 
