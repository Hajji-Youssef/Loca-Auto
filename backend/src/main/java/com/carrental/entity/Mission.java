package com.carrental.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "missions")
public class Mission {

	public static Builder builder() { return new Builder(); }
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private Car car;

	@ManyToOne
	private User worker;

	private String missionText;
	private LocalDateTime startDate;
	private LocalDateTime finishDate;
	private LocalDateTime createdAt;

	public Mission() {}

	public Mission(Long id, Car car, User worker, String missionText, LocalDateTime startDate, LocalDateTime finishDate, LocalDateTime createdAt) {
		this.id = id;
		this.car = car;
		this.worker = worker;
		this.missionText = missionText;
		this.startDate = startDate;
		this.finishDate = finishDate;
		this.createdAt = createdAt;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public Car getCar() { return car; }
	public void setCar(Car car) { this.car = car; }

	public User getWorker() { return worker; }
	public void setWorker(User worker) { this.worker = worker; }

	public String getMissionText() { return missionText; }
	public void setMissionText(String missionText) { this.missionText = missionText; }

	public LocalDateTime getStartDate() { return startDate; }
	public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

	public LocalDateTime getFinishDate() { return finishDate; }
	public void setFinishDate(LocalDateTime finishDate) { this.finishDate = finishDate; }

	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

	public static class Builder {
		private Long id;
		private Car car;
		private User worker;
		private String missionText;
		private LocalDateTime startDate;
		private LocalDateTime finishDate;
		private LocalDateTime createdAt;

		public Builder id(Long id) { this.id = id; return this; }
		public Builder car(Car car) { this.car = car; return this; }
		public Builder worker(User worker) { this.worker = worker; return this; }
		public Builder missionText(String missionText) { this.missionText = missionText; return this; }
		public Builder startDate(LocalDateTime startDate) { this.startDate = startDate; return this; }
		public Builder finishDate(LocalDateTime finishDate) { this.finishDate = finishDate; return this; }
		public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

		public Mission build() {
			Mission m = new Mission();
			m.setId(this.id);
			m.setCar(this.car);
			m.setWorker(this.worker);
			m.setMissionText(this.missionText);
			m.setStartDate(this.startDate);
			m.setFinishDate(this.finishDate);
			m.setCreatedAt(this.createdAt);
			return m;
		}
	}
} 

