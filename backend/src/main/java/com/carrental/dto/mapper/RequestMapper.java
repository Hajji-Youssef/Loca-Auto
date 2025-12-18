package com.carrental.dto.mapper;

import com.carrental.dto.response.RequestResponse;
import com.carrental.entity.Request;

import java.util.List;
import java.util.stream.Collectors;

public class RequestMapper {
	public static RequestResponse toResponse(Request r) {
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

	public static List<RequestResponse> toResponseList(List<Request> list) {
		return list.stream().map(RequestMapper::toResponse).collect(Collectors.toList());
	}
}
