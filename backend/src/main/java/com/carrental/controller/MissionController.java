package com.carrental.controller;

import com.carrental.dto.request.MissionRequest;
import com.carrental.dto.response.MissionResponse;
import com.carrental.security.SecurityUtils;
import com.carrental.service.MissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/missions")
public class MissionController {

	@Autowired
	private MissionService missionService;

	@PostMapping
	public ResponseEntity<MissionResponse> create(@RequestBody MissionRequest request) {
		Long workerId = SecurityUtils.getCurrentUserId();
		MissionResponse resp = missionService.createMission(request, workerId);
		return new ResponseEntity<>(resp, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<MissionResponse>> active() {
		return ResponseEntity.ok(missionService.getActiveMissions());
	}

	@GetMapping("/my")
	public ResponseEntity<List<MissionResponse>> my() {
		Long workerId = SecurityUtils.getCurrentUserId();
		return ResponseEntity.ok(missionService.getMyMissions(workerId));
	}

	@GetMapping("/car/{carId}")
	public ResponseEntity<List<MissionResponse>> byCar(@PathVariable Long carId) {
		return ResponseEntity.ok(missionService.getMissionsByCarId(carId));
	}

	@PutMapping("/{id}")
	public ResponseEntity<MissionResponse> update(@PathVariable Long id, @RequestBody String missionText) {
		return ResponseEntity.ok(missionService.updateMission(id, missionText));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> complete(@PathVariable Long id) {
		Long workerId = SecurityUtils.getCurrentUserId();
		missionService.completeMission(id, workerId);
		return ResponseEntity.ok().build();
	}
}

