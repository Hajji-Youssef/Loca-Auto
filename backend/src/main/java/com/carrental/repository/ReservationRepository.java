package com.carrental.repository;

import com.carrental.entity.Reservation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	List<Reservation> findByUserId(Long userId);
	List<Reservation> findByCarIdAndStatus(Long carId, com.carrental.enums.ReservationStatus status);
}
