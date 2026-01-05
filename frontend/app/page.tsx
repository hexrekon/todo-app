"use client"
import { useState, useEffect } from 'react'

export default function TodoApp() {
  const [todos, setTodos] = useState<string[]>([])
  const [input, setInput] = useState('')

  const fetchTodos = async () => {
    const res = await fetch('/api/todos')
    const data = await res.json()
    setTodos(data)
  }

  useEffect(() => { fetchTodos() }, [])

  const addTodo = async () => {
    if (!input) return
    await fetch('http://47.130.246.56:8080/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: input })
    })
    setInput('')
    fetchTodos()
  }

  // --- NEW DELETE FUNCTION ---
  const deleteTodo = async (index: number) => {
    await fetch(`http://47.130.246.56:8080/api/todos/${index}`, {
      method: 'DELETE',
    })
    fetchTodos()
  }

  return (
    <div className="p-10 font-sans max-w-md mx-auto min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">My AWS Todo List</h1>
      <div className="flex gap-2 mb-6">
        <input 
          className="border border-gray-400 p-2 rounded flex-grow text-black bg-white" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task..."
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold" onClick={addTodo}>Add</button>
      </div>
      <ul className="space-y-3">
        {todos.map((todo, i) => (
          <li key={i} className="bg-gray-100 p-3 rounded shadow-sm border-l-4 border-blue-500 flex justify-between items-center text-black">
            <span>{todo}</span>
            <button 
              onClick={() => deleteTodo(i)} 
              className="text-red-500 hover:text-red-700 font-bold px-2"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}