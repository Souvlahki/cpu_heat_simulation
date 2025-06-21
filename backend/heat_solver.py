import numpy as np
from integrater import get_total_energy_consumed
from interpolater import interpolate_grid


def get_neighbors_temperature(grid, point, boundary_temp):
    """
    Get temperatures of 6-connected (face-adjacent) neighbors in 3D.
    If a neighbor is out-of-bounds, use the boundary temperature.
    """

    x, y, z = point
    neighbors = []
    nx, ny, nz = grid.shape
    for dx, dy, dz in [
        (-1, 0, 0),
        (1, 0, 0),
        (0, -1, 0),
        (0, 1, 0),
        (0, 0, -1),
        (0, 0, 1),
    ]:
        ix, iy, iz = x + dx, y + dy, z + dz
        if 0 <= ix < nx and 0 <= iy < ny and 0 <= iz < nz:
            neighbors.append(grid[ix, iy, iz])
        else:
            neighbors.append(boundary_temp)
    return neighbors


def calculate_heat(cell_temp, neighbor_temps, time_step, thermal_diffusivity):
    delta = sum(n - cell_temp for n in neighbor_temps)
    return cell_temp + time_step * thermal_diffusivity * delta


def apply_cooling(grid, ambient_temp=20.0, rate=0.005):
    return grid - rate * (grid - ambient_temp)


def inject_cpu_heat(grid, power, center_size):
    nx, ny, nz = grid.shape
    cx, cy, cz = nx // 2, ny // 2, nz // 2
    start = cx - center_size // 2
    end = cx + center_size // 2
    grid[start:end, start:end, start:end] += power
    return grid


def heat_transfer(grid, time_step, thermal_diffusivity, boundary_temp):
    new_grid = grid.copy()
    nx, ny, nz = grid.shape
    for i in range(nx):
        for j in range(ny):
            for k in range(nz):
                neighbors = get_neighbors_temperature(grid, (i, j, k), boundary_temp)
                new_grid[i, j, k] = calculate_heat(
                    grid[i, j, k], neighbors, time_step, thermal_diffusivity
                )
    return new_grid


def get_grid():
    resolution = 30
    starting_temp = 20.0
    return np.full(
        (resolution, resolution, resolution), starting_temp, dtype=np.float64
    )


main_grid = get_grid()


def heat_simulation(tdp, cpu_util_percent, grid=main_grid):
    grid = get_grid()
    time_step = 1.0
    simulation_steps = 500
    center_region_size = 10
    power_history = []
    power = (cpu_util_percent / 100.0) * tdp
    scaling_factor = 0.09
    generated_heat = power * scaling_factor
    thermal_diffusivity = 1.11e-2
    boundary_temp = 20
    cooling_rate = 0.005

    for _ in range(simulation_steps):
        power_history.append(power)
        grid = inject_cpu_heat(grid, generated_heat, center_region_size)
        grid = heat_transfer(grid, time_step, thermal_diffusivity, boundary_temp)
        grid = apply_cooling(grid, ambient_temp=boundary_temp, rate=cooling_rate)

    interpolator = interpolate_grid(grid)
    energy = get_total_energy_consumed(power_history, time_step)
    return grid, interpolator, energy
