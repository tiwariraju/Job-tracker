package com.jobtracker.jobs.repository;

import com.jobtracker.jobs.model.Job;
import com.jobtracker.jobs.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for ORM-based MySQL operations on {@link Job}.
 * Custom @Query methods optimize read paths for search, filtering, and aggregation.
 */
public interface JobRepository extends JpaRepository<Job, Long> {

    /**
     * Optimized query: filter by status with applied date ordering (uses idx_jobs_status).
     */
    List<Job> findByStatusOrderByAppliedDateDesc(JobStatus status);

    /**
     * Optimized MySQL search across company name and role (uses idx_jobs_company_name).
     */
    @Query("""
            SELECT j FROM Job j
            WHERE LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(j.role) LIKE LOWER(CONCAT('%', :keyword, '%'))
            ORDER BY j.appliedDate DESC
            """)
    List<Job> searchByKeyword(@Param("keyword") String keyword);

    /**
     * Aggregated counts grouped by status for dashboard stats.
     */
    @Query("SELECT j.status, COUNT(j) FROM Job j GROUP BY j.status")
    List<Object[]> countGroupByStatus();
}
