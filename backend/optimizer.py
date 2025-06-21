import numpy as np
from heat_solver import apply_cooling, heat_transfer, inject_cpu_heat
from scipy import optimize


def optimize_cooling(grid_func, tdp, cpu_util, target_max_temp):
    def objective(rate):
        grid = grid_func()
        time_step = 1.0
        steps = 200
        power = (cpu_util / 100.0) * tdp
        scaling_factor = 0.09
        generated_heat = power * scaling_factor
        boundary_temp = 20
        thermal_diffusivity = 1.11e-2
        for _ in range(steps):
            grid = inject_cpu_heat(grid, generated_heat, 10)
            grid = heat_transfer(grid, time_step, thermal_diffusivity, boundary_temp)
            grid = apply_cooling(grid, ambient_temp=boundary_temp, rate=rate[0])
        return np.max(grid) - target_max_temp

    result = optimize.minimize(objective, x0=[0.01], bounds=[(0.001, 0.1)])
    return result.x[0]
