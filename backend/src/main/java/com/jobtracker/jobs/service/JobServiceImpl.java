package com.jobtracker.jobs.service;

import com.jobtracker.jobs.dto.JobRequest;
import com.jobtracker.jobs.dto.JobResponse;
import com.jobtracker.jobs.dto.JobStatsResponse;
import com.jobtracker.jobs.dto.StatusUpdateRequest;
import com.jobtracker.jobs.exception.ResourceNotFoundException;
import com.jobtracker.jobs.mapper.JobMapper;
import com.jobtracker.jobs.model.Job;
import com.jobtracker.jobs.model.JobStatus;
import com.jobtracker.jobs.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Business logic layer backed by Hibernate/JPA repository operations.
 */
@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    public JobServiceImpl(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Override
    public JobResponse create(JobRequest request) {
        Job saved = jobRepository.save(JobMapper.toEntity(request));
        return JobMapper.toResponse(saved);
    }

    @Override
    public List<JobResponse> getAll() {
        return jobRepository.findAll()
                .stream()
                .map(JobMapper::toResponse)
                .toList();
    }

    @Override
    public JobResponse getById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return JobMapper.toResponse(job);
    }

    @Transactional
    @Override
    public JobResponse update(Long id, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        JobMapper.updateEntity(job, request);
        return JobMapper.toResponse(job);
    }

    @Override
    public void delete(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }

    @Override
    public List<JobResponse> getByStatus(JobStatus status) {
        return jobRepository.findByStatusOrderByAppliedDateDesc(status)
                .stream()
                .map(JobMapper::toResponse)
                .toList();
    }

    @Override
    public List<JobResponse> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAll();
        }
        return jobRepository.searchByKeyword(keyword.trim())
                .stream()
                .map(JobMapper::toResponse)
                .toList();
    }

    @Override
    public JobStatsResponse getStats() {
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (JobStatus status : JobStatus.values()) {
            byStatus.put(status.name(), 0L);
        }

        for (Object[] row : jobRepository.countGroupByStatus()) {
            JobStatus status = (JobStatus) row[0];
            Long count = (Long) row[1];
            byStatus.put(status.name(), count);
        }

        long total = jobRepository.count();
        return new JobStatsResponse(total, byStatus);
    }

    @Transactional
    @Override
    public JobResponse updateStatus(Long id, StatusUpdateRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        job.setStatus(request.getStatus());
        return JobMapper.toResponse(job);
    }
}
