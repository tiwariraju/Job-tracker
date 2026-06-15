package com.jobtracker.jobs.dto;

import com.jobtracker.jobs.model.JobStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Partial update payload for PATCH /jobs/{id}/status.
 * Validated via @Valid + Bean Validation at the controller layer.
 */
public class StatusUpdateRequest {

    @NotNull(message = "status is required")
    private JobStatus status;

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }
}
