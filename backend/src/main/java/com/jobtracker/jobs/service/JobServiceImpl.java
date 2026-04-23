package com.jobtracker.jobs.service;

import com.jobtracker.jobs.dto.JobRequest;
import com.jobtracker.jobs.dto.JobResponse;
import com.jobtracker.jobs.exception.ResourceNotFoundException;
import com.jobtracker.jobs.mapper.JobMapper;
import com.jobtracker.jobs.model.Job;
import com.jobtracker.jobs.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        // job is managed in a transaction; changes will be flushed automatically.
        return JobMapper.toResponse(job);
    }

    @Override
    public void delete(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }
}

