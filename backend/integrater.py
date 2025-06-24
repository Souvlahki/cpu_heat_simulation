from scipy import integrate


def get_total_energy(power_history, time_step, time):
    return (
        integrate.trapezoid(power_history, dx=time_step) / time
    )  # convert back to watts
