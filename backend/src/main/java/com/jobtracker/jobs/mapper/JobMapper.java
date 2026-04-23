package com.jobtracker.jobs.mapper;

import com.jobtracker.jobs.dto.JobRequest;
import com.jobtracker.jobs.dto.JobResponse;
import com.jobtracker.jobs.model.Job;

public final class JobMapper {
    private JobMapper() {
    }

    public static Job toEntity(JobRequest req) {
        Job job = new Job();
        job.setCompanyName(req.getCompanyName());
        job.setRole(req.getRole());
        job.setStatus(req.getStatus());
        job.setAppliedDate(req.getAppliedDate());
        return job;
    }

    public static void updateEntity(Job job, JobRequest req) {
        // Centralized mapping keeps Controller/Service clean and consistent.
        job.setCompanyName(req.getCompanyName());
        job.setRole(req.getRole());
        job.setStatus(req.getStatus());
        job.setAppliedDate(req.getAppliedDate());
    }

    public static JobResponse toResponse(Job job) {
        JobResponse res = new JobResponse();
        res.setId(job.getId());
        res.setCompanyName(job.getCompanyName());
        res.setRole(job.getRole());
        res.setStatus(job.getStatus());
        res.setAppliedDate(job.getAppliedDate());
        return res;
    }
}

