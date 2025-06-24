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
    """
    Calculates the new temperature of a cell based on its neighbors using
    the forward-in-time, central-in-space (FTCS) method for the 3D heat equation.
    """
    # The term in the parenthesis is the discrete 3D Laplacian:
    # (Sum of neighbors) - 6 * (cell_temp)
    laplacian = sum(neighbor_temps) - 6 * cell_temp

    new_temp = cell_temp + time_step * thermal_diffusivity * laplacian

    return new_temp


def apply_cooling(grid, ambient_temp=20.0, rate=0.005):
    return grid - rate * (grid - ambient_temp)


def inject_cpu_heat(grid, power, center_size):
    new_grid = grid.copy()
    nx, ny, nz = grid.shape
    cx, cy, cz = nx // 2, ny // 2, nz // 2
    start = cx - center_size // 2
    end = cx + center_size // 2
    new_grid[start:end, start:end, start:end] += power
    return new_grid


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
