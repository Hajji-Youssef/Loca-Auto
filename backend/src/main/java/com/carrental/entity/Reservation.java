package com.carrental.entity;

import com.carrental.enums.PaymentStatus;
import com.carrental.enums.ReservationStatus;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "reservations")
public class Reservation {

	public static Builder builder() { return new Builder(); }
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private User user;

	@ManyToOne
	private Car car;

	@ManyToOne
	private User worker;

	private LocalDateTime startDate;
	private LocalDateTime endDate;

	@Enumerated(EnumType.STRING)
	private ReservationStatus status;

	@Enumerated(EnumType.STRING)
	private PaymentStatus paymentStatus;

	private LocalDateTime createdAt;

	public Reservation() {}

	public Reservation(Long id, User user, Car car, User worker, LocalDateTime startDate, LocalDateTime endDate, ReservationStatus status, PaymentStatus paymentStatus, LocalDateTime createdAt) {
		this.id = id;
		this.user = user;
		this.car = car;
		this.worker = worker;
		this.startDate = startDate;
		this.endDate = endDate;
		this.status = status;
		this.paymentStatus = paymentStatus;
		this.createdAt = createdAt;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public User getUser() { return user; }
	public void setUser(User user) { this.user = user; }

	public Car getCar() { return car; }
	public void setCar(Car car) { this.car = car; }

	public User getWorker() { return worker; }
	public void setWorker(User worker) { this.worker = worker; }

	public LocalDateTime getStartDate() { return startDate; }
	public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

	public LocalDateTime getEndDate() { return endDate; }
	public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

	public ReservationStatus getStatus() { return status; }
	public void setStatus(ReservationStatus status) { this.status = status; }

	public PaymentStatus getPaymentStatus() { return paymentStatus; }
	public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

	public static class Builder {
		private Long id;
		private User user;
		private Car car;
		private User worker;
		private LocalDateTime startDate;
		private LocalDateTime endDate;
		private ReservationStatus status;
		private PaymentStatus paymentStatus;
		private LocalDateTime createdAt;

		public Builder id(Long id) { this.id = id; return this; }
		public Builder user(User user) { this.user = user; return this; }
		public Builder car(Car car) { this.car = car; return this; }
		public Builder worker(User worker) { this.worker = worker; return this; }
		public Builder startDate(LocalDateTime startDate) { this.startDate = startDate; return this; }
		public Builder endDate(LocalDateTime endDate) { this.endDate = endDate; return this; }
		public Builder status(ReservationStatus status) { this.status = status; return this; }
		public Builder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
		public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

		public Reservation build() {
			Reservation r = new Reservation();
			r.setId(this.id);
			r.setUser(this.user);
			r.setCar(this.car);
			r.setWorker(this.worker);
			r.setStartDate(this.startDate);
			r.setEndDate(this.endDate);
			r.setStatus(this.status);
			r.setPaymentStatus(this.paymentStatus);
			r.setCreatedAt(this.createdAt);
			return r;
		}
	}
} 
