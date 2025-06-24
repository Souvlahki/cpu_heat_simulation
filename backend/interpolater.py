import numpy as np
from scipy.interpolate import RegularGridInterpolator


def interpolate_grid(grid, output_resolution=60):
    resolution = grid.shape[0]

    # 1. Define original coordinate grid
    x = y = z = np.linspace(0, resolution - 1, resolution)
    interpolator = RegularGridInterpolator((x, y, z), grid, method="linear")

    # 2. Create finer grid of target points to interpolate to
    xi = yi = zi = np.linspace(0, resolution - 1, output_resolution)
    X, Y, Z = np.meshgrid(xi, yi, zi, indexing="ij")
    interp_coords = np.stack([X.ravel(), Y.ravel(), Z.ravel()], axis=-1)

    # 3. Interpolate
    interp_values = interpolator(interp_coords)
    interpolated_grid = interp_values.reshape(
        (output_resolution, output_resolution, output_resolution)
    )

    return interpolated_grid
