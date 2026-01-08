from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PUT", "OPTIONS"], # Ensure DELETE is here
    allow_headers=["*"],)

# This defines what a "Todo" looks like (just a piece of text)
class Todo(BaseModel):
    item: str

# This is our temporary "database" (a simple Python list)
todo_db = []

# 1. The "GET" route: Sends the list of todos to the frontend
@app.get("/api/todos")
def get_todos():
    return todo_db

@app.get("/api/todos/{index}")
def get_todo(index: int):
    if 0 <= index < len(todo_db):
        return todo_db[index]
    return {"error": "Invalid index"}

# 2. The "POST" route: Receives a new todo from the frontend
@app.post("/api/todos")
def add_todo(todo: Todo):
    todo_db.append(todo.item)
    return {"message": "Added successfully"}

@app.delete("/api/todos/{index}")
async def delete_todo(index: int):
    if 0 <= index < len(todo_db):
        todo_db.pop(index)
        return {"message": "Deleted"}
    return {"error": "Invalid index"}

@app.put("/api/todos/{index}")
async def update_todo(index: int, todo: Todo):
    if 0 <= index < len(todo_db):
        todo_db[index] = todo.item
        return {"message": "Updated successfully"}
    return {"error": "Invalid index"}

