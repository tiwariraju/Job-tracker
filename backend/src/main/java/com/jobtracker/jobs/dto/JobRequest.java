package com.jobtracker.jobs.dto;

import com.jobtracker.jobs.model.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class JobRequest {

    @NotBlank(message = "companyName is required")
    private String companyName;

    @NotBlank(message = "role is required")
    private String role;

    @NotNull(message = "status is required")
    private JobStatus status;

    @NotNull(message = "appliedDate is required")
    private LocalDate appliedDate;

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDate appliedDate) {
        this.appliedDate = appliedDate;
    }
}

