import { Logger } from 'logging_middleware';

export interface MaintenanceTask {
  id: string;
  name: string;
  cost: number;
  priority: number; // Value/Benefit
}

export class SchedulerService {
  constructor(private logger: Logger) {}

  /**
   * Optimized Vehicle Maintenance Scheduling using Dynamic Programming (0/1 Knapsack)
   * Time Complexity: O(n * budget)
   */
  public getOptimalSchedule(tasks: MaintenanceTask[], budget: number): { selectedTasks: MaintenanceTask[], totalPriority: number } {
    this.logger.log('backend', 'info', 'service', `Calculating optimal maintenance schedule for budget: ${budget}`);
    
    const n = tasks.length;
    const dp = Array.from({ length: n + 1 }, () => Array(budget + 1).fill(0));

    // Build DP table
    for (let i = 1; i <= n; i++) {
      const task = tasks[i - 1];
      for (let w = 0; w <= budget; w++) {
        if (task.cost <= w) {
          dp[i][w] = Math.max(
            task.priority + dp[i - 1][w - task.cost],
            dp[i - 1][w]
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
    }

    // Trace back selected tasks
    const selectedTasks: MaintenanceTask[] = [];
    let w = budget;
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selectedTasks.push(tasks[i - 1]);
        w -= tasks[i - 1].cost;
      }
    }

    const totalPriority = dp[n][budget];
    this.logger.log('backend', 'info', 'service', `Optimal schedule found. Tasks: ${selectedTasks.length}, Total Value: ${totalPriority}`);
    
    return { selectedTasks, totalPriority };
  }
}
