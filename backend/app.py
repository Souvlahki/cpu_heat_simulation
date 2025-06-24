import numpy as np
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from heat_solver import apply_cooling, heat_transfer, inject_cpu_heat
from integrater import get_total_energy
from interpolater import interpolate_grid

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development only)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


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

        grid = np.full((20, 20, 20), 20.0)
        power = (cpu_util / 100.0) * tdp
        scaling_factor = 0.03
        generated_heat = power * scaling_factor

        simulation_steps = 300
        center_size = 10
        time_step = 0.1 
        boundary_temp = 20.0
        thermal_diffusivity = 1.11e-2
        cooling_rate = 0.005

        power_history = []

        for step in range(simulation_steps):
            power_history.append(power)

            grid = inject_cpu_heat(grid, generated_heat, center_size)
            grid = heat_transfer(grid, time_step, thermal_diffusivity, boundary_temp)
            grid = apply_cooling(grid, ambient_temp=boundary_temp, rate=cooling_rate)

            # interpolated_grid = interpolate_grid(grid, output_resolution=40)

            # total_energy = get_total_energy(power_history, time_step)

            await websocket.send_json(
                {"grid": grid.tolist(), "average_temp": np.mean(grid)}
            )

            step += time_step

        await websocket.close()

    except Exception as e:
        await websocket.send_json({"error": str(e)})
        await websocket.close()
