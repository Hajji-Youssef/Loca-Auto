package com.carrental.controller;

import com.carrental.dto.request.ReservationRequest;
import com.carrental.dto.response.RequestResponse;
import com.carrental.security.SecurityUtils;
import com.carrental.service.RequestServiceImpl;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestServiceImpl requestService;

    @PostMapping
    public ResponseEntity<RequestResponse> create(@RequestBody ReservationRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        RequestResponse resp = requestService.createRequest(userId, request);
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<RequestResponse>> myRequests() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(requestService.getMyRequests(userId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<RequestResponse>> pending() {
        return ResponseEntity.ok(requestService.getPendingRequests());
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable Long id) {
        Long workerId = SecurityUtils.getCurrentUserId();
        requestService.acceptRequest(id, workerId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/decline")
    public ResponseEntity<?> decline(@PathVariable Long id, @RequestBody(required = false) String reason) {
        Long workerId = SecurityUtils.getCurrentUserId();
        requestService.declineRequest(id, workerId, reason);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        requestService.cancelRequest(id, userId);
        return ResponseEntity.ok().build();
    }
}
