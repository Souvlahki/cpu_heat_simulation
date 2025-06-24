# from copy import deepcopy

# import numpy as np
# from heat_solver import apply_cooling, heat_transfer, inject_cpu_heat
# from scipy import optimize


# def optimize_cooling(req_grid, tdp, cpu_util, target_max_temp=70.0):
#     def objective(rate):
#         grid = req_grid.copy()  
#         time_step = 1.0
#         steps = 200

#         power = (cpu_util / 100.0) * tdp
#         scaling_factor = 0.09
#         generated_heat = power * scaling_factor
#         center_region_size = 10

#         boundary_temp = 20.0
#         thermal_diffusivity = 1.11e-2

#         for _ in range(steps):
#             grid = inject_cpu_heat(grid, generated_heat, center_region_size)
#             grid = heat_transfer(grid, time_step, thermal_diffusivity, boundary_temp)
#             grid = apply_cooling(grid, ambient_temp=boundary_temp, rate=rate[0])

#         max_temp = np.max(grid)
#         return abs(max_temp - target_max_temp)

#     result = optimize.minimize(objective, x0=[0.01], bounds=[(0.001, 0.1)])

#     if result.success:
#         return result.x[0]
#     else:
#         raise RuntimeError(f"Cooling optimization failed: {result.message}")
