package com.jobtracker.jobs.controller;

import com.jobtracker.jobs.dto.JobRequest;
import com.jobtracker.jobs.dto.JobResponse;
import com.jobtracker.jobs.dto.JobStatsResponse;
import com.jobtracker.jobs.dto.StatusUpdateRequest;
import com.jobtracker.jobs.model.JobStatus;
import com.jobtracker.jobs.service.JobService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * RESTful API controller exposing job application CRUD and query endpoints.
 * Input validation via @Valid + Bean Validation; errors handled by @ControllerAdvice.
 */
@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<JobResponse> create(@Valid @RequestBody JobRequest request) {
        JobResponse created = jobService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public List<JobResponse> getAll() {
        return jobService.getAll();
    }

    /** Literal paths must be declared before /{id} to avoid path-variable shadowing. */
    @GetMapping("/search")
    public List<JobResponse> search(@RequestParam @NotBlank(message = "keyword is required") String keyword) {
        return jobService.search(keyword);
    }

    @GetMapping("/stats")
    public JobStatsResponse getStats() {
        return jobService.getStats();
    }

    @GetMapping("/status/{status}")
    public List<JobResponse> getByStatus(@PathVariable JobStatus status) {
        return jobService.getByStatus(status);
    }

    @GetMapping("/{id}")
    public JobResponse getById(@PathVariable Long id) {
        return jobService.getById(id);
    }

    @PutMapping("/{id}")
    public JobResponse update(@PathVariable Long id, @Valid @RequestBody JobRequest request) {
        return jobService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public JobResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        return jobService.updateStatus(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        jobService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
