package com.carrental.repository;

import com.carrental.entity.Request;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
	List<Request> findByRequestStatusAndCreatedAtBefore(com.carrental.enums.RequestStatus status, LocalDateTime cutoff);
	List<Request> findByUserId(Long userId);
}
