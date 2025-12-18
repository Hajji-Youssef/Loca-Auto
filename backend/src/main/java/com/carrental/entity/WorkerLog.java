package com.carrental.entity;

import com.carrental.enums.ActionType;
import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "worker_logs")
public class WorkerLog {

	public static Builder builder() { return new Builder(); }
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	private User worker;

	@Enumerated(EnumType.STRING)
	private ActionType actionType;

	private String details;
	private LocalDateTime actionTime;

	public WorkerLog() {}

	public WorkerLog(Long id, User worker, ActionType actionType, String details, LocalDateTime actionTime) {
		this.id = id;
		this.worker = worker;
		this.actionType = actionType;
		this.details = details;
		this.actionTime = actionTime;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public User getWorker() { return worker; }
	public void setWorker(User worker) { this.worker = worker; }

	public ActionType getActionType() { return actionType; }
	public void setActionType(ActionType actionType) { this.actionType = actionType; }

	public String getDetails() { return details; }
	public void setDetails(String details) { this.details = details; }

	public LocalDateTime getActionTime() { return actionTime; }
	public void setActionTime(LocalDateTime actionTime) { this.actionTime = actionTime; }

	public static class Builder {
		private Long id;
		private User worker;
		private ActionType actionType;
		private String details;
		private LocalDateTime actionTime;

		public Builder id(Long id) { this.id = id; return this; }
		public Builder worker(User worker) { this.worker = worker; return this; }
		public Builder actionType(ActionType actionType) { this.actionType = actionType; return this; }
		public Builder details(String details) { this.details = details; return this; }
		public Builder actionTime(LocalDateTime actionTime) { this.actionTime = actionTime; return this; }

		public WorkerLog build() {
			WorkerLog wl = new WorkerLog();
			wl.setId(this.id);
			wl.setWorker(this.worker);
			wl.setActionType(this.actionType);
			wl.setDetails(this.details);
			wl.setActionTime(this.actionTime);
			return wl;
		}
	}
} 

