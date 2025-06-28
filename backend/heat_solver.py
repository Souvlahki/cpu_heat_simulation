import itertools

def get_neighbors_temperature(grid, point, boundary_temp):
    """
    (CHANGED)
    Get temperatures of 26-connected (face, edge, and corner-adjacent) neighbors.
    This creates a more uniform, spherical heat spread.
    """
    x, y, z = point
    neighbors = []
    nx, ny, nz = grid.shape

    # Generate all combinations for a 3x3x3 cube around the point
    for dx, dy, dz in itertools.product([-1, 0, 1], repeat=3):
        # Skip the center point itself (0,0,0)
        if dx == 0 and dy == 0 and dz == 0:
            continue

        ix, iy, iz = x + dx, y + dy, z + dz
        if 0 <= ix < nx and 0 <= iy < ny and 0 <= iz < nz:
            neighbors.append(grid[ix, iy, iz])
        else:
            # If neighbor is out of bounds, use the fixed boundary temperature
            neighbors.append(boundary_temp)

    return neighbors


def calculate_heat(cell_temp, neighbor_temps, time_step, thermal_diffusivity):
    """
    (CHANGED)
    Calculates the new temperature using the discrete 3D Laplacian for
    a 26-connected neighborhood.
    """
    # The key change is here: we subtract 26 * cell_temp because we sum 26 neighbors.
    laplacian = sum(neighbor_temps) - 26 * cell_temp

    # The rest of the formula for the Forward-Time Central-Space (FTCS) method is the same
    new_temp = cell_temp + time_step * thermal_diffusivity * laplacian

    return new_temp


def heat_transfer(grid, time_step, thermal_diffusivity, boundary_temp):
    """
    (CHANGED)
    Performs one full step of heat diffusion across the entire grid using the 26-neighbor method.
    """
    # Create a copy of the grid to store the new values. This is crucial to avoid
    # using already-updated values in the calculation for the same time step.
    new_grid = grid.copy()
    nx, ny, nz = grid.shape

    # Iterate over every cell in the grid
    for i in range(nx):
        for j in range(ny):
            for k in range(nz):
                # Call the new function to get all 26 neighbors
                neighbors = get_neighbors_temperature(grid, (i, j, k), boundary_temp)

                # Call the new calculation function
                new_grid[i, j, k] = calculate_heat(
                    grid[i, j, k], neighbors, time_step, thermal_diffusivity
                )
    return new_grid


# --- HELPER FUNCTIONS (Unchanged) ---


def apply_cooling(grid, ambient_temp=20.0, rate=0.005):
    """Applies a simple cooling effect to every cell."""
    return grid - rate * (grid - ambient_temp)


def inject_cpu_heat(grid, power, center_size):
    """Adds heat to the center of the grid to simulate a CPU core."""
    new_grid = grid.copy()
    nx, ny, nz = grid.shape
    # Center coordinates
    cx, cy, cz = nx // 2, ny // 2, 0  # Heat source at the bottom center

    # Define the 3D slice for the heat source
    x_start, x_end = cx - center_size // 2, cx + center_size // 2
    y_start, y_end = cy - center_size // 2, cy + center_size // 2
    z_start, z_end = cz, cz + center_size  # Make the source a few layers deep

    new_grid[x_start:x_end, y_start:y_end, z_start:z_end] += power
    return new_grid
