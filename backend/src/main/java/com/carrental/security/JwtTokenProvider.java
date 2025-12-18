package com.carrental.security;

import com.carrental.entity.User;
import com.carrental.util.Constants;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

	private final Key key = Keys.hmacShaKeyFor(Constants.JWT_SECRET.getBytes(StandardCharsets.UTF_8));

	public String generateToken(User user) {
		Claims claims = Jwts.claims();
		claims.put("userId", user.getId());
		claims.put("username", user.getUsername());
		claims.put("role", user.getRole().name());

		Date now = new Date();
		Date expiry = new Date(now.getTime() + Constants.JWT_EXPIRATION);

		return Jwts.builder()
				.setClaims(claims)
				.setIssuedAt(now)
				.setExpiration(expiry)
				.signWith(key, SignatureAlgorithm.HS512)
				.compact();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return true;
		} catch (JwtException | IllegalArgumentException ex) {
			return false;
		}
	}

	public Long getUserIdFromToken(String token) {
		Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
		Object idObj = claims.get("userId");
		if (idObj instanceof Integer) {
			return ((Integer) idObj).longValue();
		} else if (idObj instanceof Long) {
			return (Long) idObj;
		} else if (idObj instanceof String) {
			return Long.parseLong((String) idObj);
		}
		return null;
	}
}

