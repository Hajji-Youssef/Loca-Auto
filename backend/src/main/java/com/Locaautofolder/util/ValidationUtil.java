package com.carrental.util;

import java.util.regex.Pattern;
import org.springframework.web.multipart.MultipartFile;

public class ValidationUtil {

	private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

	public static boolean isValidEmail(String email) {
		return email != null && EMAIL_PATTERN.matcher(email).matches();
	}

	public static boolean isValidPassword(String password) {
		return password != null && password.length() >= 6;
	}

	public static boolean isValidImageFile(MultipartFile file) {
		if (file == null || file.isEmpty()) return false;
		String ct = file.getContentType();
		if (ct == null) return false;
		boolean allowed = ct.equals("image/jpeg") || ct.equals("image/png") || ct.equals("image/jpg");
		return allowed && file.getSize() <= Constants.MAX_FILE_SIZE;
	}
}
