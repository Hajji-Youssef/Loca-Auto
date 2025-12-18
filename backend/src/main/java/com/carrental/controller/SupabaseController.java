package com.carrental.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carrental.service.SupabaseService;

@RestController
@RequestMapping("/api/supabase")
public class SupabaseController {

    @Autowired
    private SupabaseService supabaseService;

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        boolean ok = supabaseService.isConfigured();
        return ResponseEntity.ok(Map.of("configured", ok, "url", supabaseService.getUrl()));
    }
}
