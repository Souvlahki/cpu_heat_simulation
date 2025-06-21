import numpy as np
from scipy.interpolate import interp2d


def interpolate_grid(grid):
    resolution = grid.shape[0]
    x = y = z = np.linspace(0, resolution - 1, resolution)
    interpolator = interp2d((x, y, z), grid)
    return interpolator
