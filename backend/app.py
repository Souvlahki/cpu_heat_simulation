import asyncio

import numpy as np
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from heat_solver import apply_cooling, heat_transfer, inject_cpu_heat
from integrater import get_total_power
from interpolater import get_interp_data
from optimizer import get_optimal_cooling

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def print_grid_slice(grid, slice_z=0):
    """
    Prints a 2D slice of the 3D grid to the console for debugging.
    """
    print(f"--- Grid Slice at Z = {slice_z} ---")
    slice_data = grid[:, :, slice_z]  # Get the 2D plane at the specified z-index
    for y in range(slice_data.shape[1]):
        row_str = ""
        for x in range(slice_data.shape[0]):
            temp = slice_data[x, y]
            if temp > 60:
                char = "#"  # Hottest
            elif temp > 40:
                char = "O"  # Hot
            elif temp > 25:
                char = "o"  # Warm
            elif temp > 20:
                char = "."  # Slightly warm
            else:
                char = " "  # Cold
            row_str += char + " "
        print(row_str)
    print("-" * (slice_data.shape[0] * 2 + 3))


@app.get("/")
async def start():
    return {"message": "its working"}


@app.websocket("/ws/simulation")
async def websocket_simulation(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_json()

        cpu_util = data["cpu_util"]
        cpu_name = data["cpu_name"]
        cooling_rate = data["cooling_rate"]

        cpu_list = {
            "Intel Core i9-14900K": 125,
            "Intel Core i5-13600K": 125,
            "AMD Ryzen 9 7950X": 170,
            "AMD Ryzen 7 7700X": 105,
            "AMD Ryzen 5 7600X": 105,
        }

        tdp = cpu_list.get(cpu_name)

        if tdp is None:
            await websocket.send_json({"error": "CPU not found"})
            await websocket.close()
            return

        # -------------- Initilization ---------------------

        grid = np.full((20, 20, 40), 20.0)
        power = (cpu_util / 100.0) * tdp
        scaling_factor = 0.1
        generated_heat = power * scaling_factor

        simulation_steps = 100
        center_size = 10
        time_step = 1
        boundary_temp = 20.0
        thermal_diffusivity = 60e-6 

        power_history = []
        average_temp = []

        for step in range(simulation_steps):
            power_history.append(power)

            grid = inject_cpu_heat(grid, generated_heat, center_size)
            grid = heat_transfer(grid, time_step, thermal_diffusivity, boundary_temp)
            grid = apply_cooling(grid, ambient_temp=boundary_temp, rate=cooling_rate)

            average_temp.append(np.mean(grid))

            await websocket.send_json(
                {
                    "grid": grid.tolist(),
                    "average_temp": np.mean(grid),
                }
            )


            step += time_step

        total_power = get_total_power(power_history, time_step, simulation_steps)

        interp_average_temp, x_interp = get_interp_data(
            average_temp, np.arange(0, simulation_steps, 1)
        )

        await websocket.send_json(
            {
                "interp_average": interp_average_temp.tolist(),
                "total_power": total_power,
                "grid": grid.tolist(),
                "average_temp": np.mean(grid),
                "time": x_interp.tolist(),
            }
        )

        if np.isclose(np.mean(grid), 65) or np.mean(grid) > 65.0:

            await websocket.send_json(
                {
                    "optimized_cooling_rate": "loading",
                }
            )

            optimized_cooling_rate = get_optimal_cooling(cpu_util, tdp)

            await websocket.send_json(
                {"optimized_cooling_rate": optimized_cooling_rate}
            )

        await websocket.close()

    except Exception as e:
        await websocket.send_json({"error": str(e)})
        await websocket.close()
