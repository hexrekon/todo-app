"use client"
import { useState, useEffect } from 'react'

export default function TodoApp() {
  const [todos, setTodos] = useState<string[]>([])
  const [input, setInput] = useState('')

  // New state for editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  const fetchTodos = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/todos')
      const data = await res.json()
      setTodos(data)
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    }
  }

  useEffect(() => { fetchTodos() }, [])

  const addTodo = async () => {
    if (!input) return
    try {
      await fetch('http://localhost:8080/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: input })
      })
      setInput('')
      fetchTodos()
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  const deleteTodo = async (index: number) => {
    try {
      await fetch(`http://localhost:8080/api/todos/${index}`, {
        method: 'DELETE',
      })
      fetchTodos()
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const startEditing = (index: number, todo: string) => {
    setEditingIndex(index)
    setEditText(todo)
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditText('')
  }

  const saveEdit = async (index: number) => {
    if (!editText) return
    try {
      await fetch(`http://localhost:8080/api/todos/${index}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: editText })
      })
      setEditingIndex(null)
      setEditText('')
      fetchTodos()
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  return (
    <div className="p-10 font-sans max-w-md mx-auto min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">My Todo List</h1>
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
            {editingIndex === i ? (
              <div className="flex gap-2 flex-grow">
                <input
                  className="border border-gray-400 p-1 rounded flex-grow text-black"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(i)} className="text-green-600 font-bold px-2">Save</button>
                <button onClick={cancelEdit} className="text-gray-500 font-bold px-2">Cancel</button>
              </div>
            ) : (
              <>
                <span>{todo}</span>
                <div className="flex">
                  <button
                    onClick={() => startEditing(i, todo)}
                    className="text-blue-500 hover:text-blue-700 font-bold px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(i)}
                    className="text-red-500 hover:text-red-700 font-bold px-2"
                  >
                    ✕
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}