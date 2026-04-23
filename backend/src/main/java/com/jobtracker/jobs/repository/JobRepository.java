package com.jobtracker.jobs.repository;

import com.jobtracker.jobs.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}

