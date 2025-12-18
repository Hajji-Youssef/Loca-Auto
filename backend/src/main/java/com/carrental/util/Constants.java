package com.carrental.util;

public class Constants {
	// JWT
	public static final String JWT_SECRET = "change-this-secret-in-production";
	public static final long JWT_EXPIRATION = 86_400_000L; // 24 hours

	// File Upload
	public static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
	public static final String[] ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/jpg"};

	// Request Auto-Accept
	public static final int REQUEST_AUTO_ACCEPT_MINUTES = 15;

	// Online Status
	public static final int INACTIVE_THRESHOLD_MINUTES = 2;
	public static final int LOGGED_OUT_THRESHOLD_MINUTES = 30;

	// Pagination
	public static final int DEFAULT_PAGE_SIZE = 20;
}

