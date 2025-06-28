import numpy as np
from scipy.interpolate import interp1d


def get_interp_data(y_data, x_data, output_resolution=60):
    interp_func = interp1d(x_data, y_data, kind="linear")
    x_interp = np.linspace(x_data[0], x_data[-1], output_resolution)

    y_interp = interp_func(x_interp)

    return y_interp, x_interp
