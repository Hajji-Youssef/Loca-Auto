package com.carrental.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SupabaseService {

    @Value("https://mhloawudyrscwbokdmhb.supabase.co")
    private String url;

    @Value("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obG9hd3VkeXJzY3dib2tkbWhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTYwNTY0MywiZXhwIjoyMDgxMTgxNjQzfQ.YHCImcMOP2gp_szbPTo3zDtpGnj4Cc6Myp5z1xiHiKo")
    private String serviceRoleKey;

    public boolean isConfigured() {
        return url != null && !url.isEmpty() && serviceRoleKey != null && !serviceRoleKey.isEmpty();
    }

    public String getUrl() { return url;}
}
