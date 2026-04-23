package com.jobtracker.jobs.service;

import com.jobtracker.jobs.dto.JobRequest;
import com.jobtracker.jobs.dto.JobResponse;

import java.util.List;

public interface JobService {
    JobResponse create(JobRequest request);

    List<JobResponse> getAll();

    JobResponse getById(Long id);

    JobResponse update(Long id, JobRequest request);

    void delete(Long id);
}

