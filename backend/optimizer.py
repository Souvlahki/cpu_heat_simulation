import numpy as np
from heat_solver import apply_cooling, heat_transfer, inject_cpu_heat
from scipy.optimize import minimize_scalar


def get_optimal_cooling(cpu_util, tdp, target_temp=40.0):
    power = (cpu_util / 100.0) * tdp
    scaling_factor = 0.09
    generated_heat = power * scaling_factor

    center_size = 10
    time_step = 1
    simulation_steps = 100
    boundary_temp = 20.0
    thermal_diffusivity = 60e-6

    def simulate_with_cooling(cooling_rate):
        grid = np.full((20, 20, 40), 20.0)
        for _ in range(simulation_steps):
            grid = inject_cpu_heat(grid, generated_heat, center_size)
            grid = heat_transfer(grid, time_step, thermal_diffusivity, boundary_temp)
            grid = apply_cooling(grid, ambient_temp=boundary_temp, rate=cooling_rate)
        return np.mean(grid)

    # Objective: Penalize results above the target temp
    def objective(cooling_rate):
        avg_temp = simulate_with_cooling(cooling_rate)
        penalty = max(0, avg_temp - target_temp)  # only penalize above target
        return penalty

    # Minimize the penalty (ideally to zero)
    result = minimize_scalar(objective, bounds=(0.001, 0.1), method="bounded")

    return result.x # cooling rate
