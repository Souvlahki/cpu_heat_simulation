import numpy as np
from fastapi import FastAPI
from heat_solver import heat_simulation
from optimizer import optimize_cooling
from pydantic import BaseModel

app = FastAPI()


class Request(BaseModel):
    grid: np.ndarray
    cpu_util: int
    cpu_name: str


@app.get("/api/simulation")
async def heat_simulation(request: Request):
    # cpu_list = [{"name": "", "tdp": ""}]
    grid, interpolater, energy = heat_simulation()
