package com.jobtracker.jobs.dto;

import java.util.Map;

/**
 * Aggregated job application counts returned by GET /jobs/stats.
 */
public class JobStatsResponse {

    private long total;
    private Map<String, Long> byStatus;

    public JobStatsResponse() {
    }

    public JobStatsResponse(long total, Map<String, Long> byStatus) {
        this.total = total;
        this.byStatus = byStatus;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public Map<String, Long> getByStatus() {
        return byStatus;
    }

    public void setByStatus(Map<String, Long> byStatus) {
        this.byStatus = byStatus;
    }
}
