package com.carrental.repository;

import com.carrental.entity.Mission;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {
	List<Mission> findByFinishDateIsNull();
	List<Mission> findByWorkerId(Long workerId);
	List<Mission> findByCarId(Long carId);
}

