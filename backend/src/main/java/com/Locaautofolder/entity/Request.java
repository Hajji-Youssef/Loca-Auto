package com.carrental.entity;

import com.carrental.enums.RequestStatus;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "requests")
public class Request {

	public static Builder builder() { return new Builder(); }
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private User user;

	@ManyToOne
	private Car car;

	private LocalDateTime startDate;
	private LocalDateTime endDate;

	@Enumerated(EnumType.STRING)
	private RequestStatus requestStatus;

	private LocalDateTime createdAt;

	public Request() {}

	public Request(Long id, User user, Car car, LocalDateTime startDate, LocalDateTime endDate, RequestStatus requestStatus, LocalDateTime createdAt) {
		this.id = id;
		this.user = user;
		this.car = car;
		this.startDate = startDate;
		this.endDate = endDate;
		this.requestStatus = requestStatus;
		this.createdAt = createdAt;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public User getUser() { return user; }
	public void setUser(User user) { this.user = user; }

	public Car getCar() { return car; }
	public void setCar(Car car) { this.car = car; }

	public LocalDateTime getStartDate() { return startDate; }
	public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

	public LocalDateTime getEndDate() { return endDate; }
	public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

	public RequestStatus getRequestStatus() { return requestStatus; }
	public void setRequestStatus(RequestStatus requestStatus) { this.requestStatus = requestStatus; }

	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

	public static class Builder {
		private Long id;
		private User user;
		private Car car;
		private LocalDateTime startDate;
		private LocalDateTime endDate;
		private RequestStatus requestStatus;
		private LocalDateTime createdAt;

		public Builder id(Long id) { this.id = id; return this; }
		public Builder user(User user) { this.user = user; return this; }
		public Builder car(Car car) { this.car = car; return this; }
		public Builder startDate(LocalDateTime startDate) { this.startDate = startDate; return this; }
		public Builder endDate(LocalDateTime endDate) { this.endDate = endDate; return this; }
		public Builder requestStatus(RequestStatus requestStatus) { this.requestStatus = requestStatus; return this; }
		public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

		public Request build() {
			Request r = new Request();
			r.setId(this.id);
			r.setUser(this.user);
			r.setCar(this.car);
			r.setStartDate(this.startDate);
			r.setEndDate(this.endDate);
			r.setRequestStatus(this.requestStatus);
			r.setCreatedAt(this.createdAt);
			return r;
		}
	}
} 
