from scipy import integrate


def get_total_energy_consumed(power_history, time_step):
    return integrate.trapz(power_history, dx=time_step)
