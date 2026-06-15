package com.jobtracker.jobs.service;

import com.jobtracker.jobs.dto.JobRequest;
import com.jobtracker.jobs.dto.JobResponse;
import com.jobtracker.jobs.dto.JobStatsResponse;
import com.jobtracker.jobs.dto.StatusUpdateRequest;
import com.jobtracker.jobs.model.JobStatus;

import java.util.List;

public interface JobService {
    JobResponse create(JobRequest request);

    List<JobResponse> getAll();

    JobResponse getById(Long id);

    JobResponse update(Long id, JobRequest request);

    void delete(Long id);

    List<JobResponse> getByStatus(JobStatus status);

    List<JobResponse> search(String keyword);

    JobStatsResponse getStats();

    JobResponse updateStatus(Long id, StatusUpdateRequest request);
}
