package com.carrental.repository;

import com.carrental.entity.CarImage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarImageRepository extends JpaRepository<CarImage, Long> {
	List<CarImage> findByCarId(Long carId);
}
