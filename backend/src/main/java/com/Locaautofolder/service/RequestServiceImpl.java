package com.carrental.service;

import com.carrental.dto.request.ReservationRequest;
import com.carrental.dto.response.RequestResponse;
import com.carrental.entity.Request;
import com.carrental.entity.Reservation;
import com.carrental.entity.User;
import com.carrental.enums.RequestStatus;
import com.carrental.enums.ReservationStatus;
import com.carrental.enums.PaymentStatus;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.CarRepository;
import com.carrental.repository.RequestRepository;
import com.carrental.repository.ReservationRepository;
import com.carrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestServiceImpl {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public RequestResponse createRequest(Long userId, ReservationRequest req) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var car = carRepository.findById(req.getCarId()).orElseThrow(() -> new ResourceNotFoundException("Car not found"));

        if (!Boolean.TRUE.equals(car.getIsForRent())) {
            throw new BadRequestException("Car is not for rent");
        }

        // Basic overlap check: check existing reservations for the car
        List<Reservation> overlaps = reservationRepository.findByCarIdAndStatus(car.getId(), ReservationStatus.ACTIVE);
        // naive overlap check omitted for brevity

        Request request = Request.builder()
                .user(user)
                .car(car)
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .requestStatus(RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        request = requestRepository.save(request);
        return toResponse(request);
    }

    public List<RequestResponse> getMyRequests(Long userId) {
        return requestRepository.findByUserId(userId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public RequestResponse getRequestById(Long requestId) {
        Request r = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        return toResponse(r);
    }

    public List<RequestResponse> getPendingRequests() {
        return requestRepository.findAll().stream().filter(r -> r.getRequestStatus() == RequestStatus.PENDING).map(this::toResponse).collect(Collectors.toList());
    }

    public Reservation acceptRequest(Long requestId, Long workerId) {
        Request r = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (r.getRequestStatus() != RequestStatus.PENDING) throw new BadRequestException("Request already processed");
        r.setRequestStatus(RequestStatus.ACCEPTED);
        requestRepository.save(r);

        Reservation res = Reservation.builder()
                .user(r.getUser())
                .car(r.getCar())
                .worker(workerId != null ? userRepository.findById(workerId).orElse(null) : null)
                .startDate(r.getStartDate())
                .endDate(r.getEndDate())
                .status(ReservationStatus.ACTIVE)
                .paymentStatus(PaymentStatus.UNPAID)
                .createdAt(LocalDateTime.now())
                .build();

        return reservationRepository.save(res);
    }

    public void declineRequest(Long requestId, Long workerId, String reason) {
        Request r = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (r.getRequestStatus() != RequestStatus.PENDING) throw new BadRequestException("Request already processed");
        r.setRequestStatus(RequestStatus.DECLINED);
        requestRepository.save(r);
        // log reason if needed
    }

    public void autoAcceptOldRequests() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(15);
        List<Request> old = requestRepository.findByRequestStatusAndCreatedAtBefore(RequestStatus.PENDING, cutoff);
        for (Request r : old) {
            acceptRequest(r.getId(), null);
        }
    }

    public void cancelRequest(Long requestId, Long userId) {
        Request r = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (!r.getUser().getId().equals(userId)) throw new BadRequestException("Not authorized");
        if (r.getRequestStatus() != RequestStatus.PENDING) throw new BadRequestException("Cannot cancel processed request");
        requestRepository.delete(r);
    }

    private RequestResponse toResponse(Request r) {
        RequestResponse resp = new RequestResponse();
        resp.setId(r.getId());
        resp.setUserId(r.getUser().getId());
        resp.setUsername(r.getUser().getUsername());
        resp.setCarId(r.getCar().getId());
        resp.setCarMake(r.getCar().getMake());
        resp.setCarModel(r.getCar().getModel());
        resp.setRequestStatus(r.getRequestStatus());
        resp.setStartDate(r.getStartDate());
        resp.setEndDate(r.getEndDate());
        resp.setCreatedAt(r.getCreatedAt());
        return resp;
    }
}
