package com.carrental.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DateUtil {

	public static List<LocalDate> getDatesBetween(LocalDate start, LocalDate end) {
		List<LocalDate> result = new ArrayList<>();
		LocalDate cur = start;
		while (!cur.isAfter(end)) {
			result.add(cur);
			cur = cur.plusDays(1);
		}
		return result;
	}

	public static boolean isDateInFuture(LocalDateTime date) {
		return date.isAfter(LocalDateTime.now());
	}

	public static boolean isDateRangeValid(LocalDateTime start, LocalDateTime end) {
		return start != null && end != null && start.isBefore(end) && isDateInFuture(start) && isDateInFuture(end);
	}
}

