// API Logger - stores API calls in memory
interface ApiLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  status?: number;
  duration?: number;
  requestBody?: any;
  responseBody?: any;
  error?: string;
  headers?: Record<string, string>;
}

class ApiLogger {
  private logs: ApiLog[] = [];
  private maxLogs = 100; // Keep last 100 logs

  log(entry: ApiLog) {
    this.logs.unshift(entry); // Add to beginning
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  getLogs(limit?: number): ApiLog[] {
    return limit ? this.logs.slice(0, limit) : this.logs;
  }

  clear() {
    this.logs = [];
  }

  getStats() {
    const stats = {
      totalCalls: this.logs.length,
      byMethod: {} as Record<string, number>,
      byPath: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      errors: this.logs.filter(log => log.error || (log.status && log.status >= 400)).length,
      avgDuration: 0,
    };

    let totalDuration = 0;
    let durationCount = 0;

    this.logs.forEach(log => {
      // Count by method
      stats.byMethod[log.method] = (stats.byMethod[log.method] || 0) + 1;

      // Count by path
      stats.byPath[log.path] = (stats.byPath[log.path] || 0) + 1;

      // Count by status
      if (log.status) {
        const statusGroup = `${Math.floor(log.status / 100)}xx`;
        stats.byStatus[statusGroup] = (stats.byStatus[statusGroup] || 0) + 1;
      }

      // Calculate average duration
      if (log.duration) {
        totalDuration += log.duration;
        durationCount++;
      }
    });

    if (durationCount > 0) {
      stats.avgDuration = Math.round(totalDuration / durationCount);
    }

    return stats;
  }
}

// Export singleton instance
export const apiLogger = new ApiLogger();
