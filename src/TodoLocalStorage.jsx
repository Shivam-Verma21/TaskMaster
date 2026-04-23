import { useState, useReducer, useEffect } from 'react'
import './App.css'

function todoReducer(todos, action) {
    switch (action.type) {
        case 'addTodo':
            {
                return [...todos, {
                    id: Date.now(),
                    text: action.text,
                    done: false
                }]
            }

        case 'deleteTodo':
            {
                return todos.filter(t => t.id !== action.id)
            }

        case 'status':
            {
                // return todos.map(t => {
                //   if (t.id === action.id) return { ...t, done: !t.done }
                //   else return t;
                // })
                return todos.map(t =>
                    t.id === action.id ? { ...t, done: !t.done } : t
                );
            }

        case 'save':
            {
                return todos.map(t => t.id === action.id ? { ...t, text: action.text } : t)
            }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export default function TodoLocalStorage() {
    const [todos, dispatch] = useReducer(todoReducer, [], () => {
        const savedTodos = localStorage.getItem("Todos");
        if (savedTodos) return JSON.parse(savedTodos);
        else return [];
    });
    const [text, setText] = useState('');
    const [editText, setEditText] = useState('');
    const [editId, setEditId] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredTodos = (todos || []).filter(todo => {
        if (filter === 'finished') return todo.done === true;
        if (filter === 'pending') return todo.done === false;
        return true;
    })

    function handleAddTodo() {
        if (text.trim() === '') return;
        dispatch({ type: 'addTodo', text: text })
        setText('');
    }

    function handleDeleteTodo(id) {
        dispatch({ type: 'deleteTodo', id: id })
    }

    function handleTodoStatus(id) {
        dispatch({ type: 'status', id: id })
    }

    function handleEditTodo(todo) {
        setEditId(todo.id);
        setEditText(todo.text);
    }

    function handleSaveTodo() {
        dispatch({
            type: 'save',
            id: editId,
            text: editText
        });
        setEditText('');
        setEditId('');
    }

    useEffect(() => {
        localStorage.setItem("Todos", JSON.stringify(todos))
    }, [todos])


    return (
        <>
            <div className="main-div max-h-screen text-slate-100 flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30">
                {/* Header Section */}
                <div className="w-full max-w-lg mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        Task Master
                    </h1>
                    <p className="text-slate-500 text-sm tracking-wide uppercase font-semibold">Stay Focused, Stay Productive</p>
                </div>

                {/* Input Section */}
                <div className="w-full sm:w-[40%] bg-slate-900/50 border border-slate-800 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl backdrop-blur-sm mb-10 focus-within:border-indigo-500/50 transition-all">
                    <div className="flex-1 flex flex-col sm:flex-row gap-2 bg-slate-900/50 border border-slate-800 p-2 rounded-2xl">
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                            className="flex-1 bg-transparent border-none px-4 py-3 outline-none text-slate-100 placeholder:text-slate-600"
                        />
                        <button
                            onClick={handleAddTodo}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20 w-full sm:w-auto"
                        >
                            Add
                        </button>
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="h-full border bg-slate-900/50 border-slate-800 text-slate-100 px-4 py-2 rounded-2xl outline-none appearance-none cursor-pointer hover:border-slate-700 transition-all focus:border-indigo-500/50 shadow-2xl w-full sm:min-w-30 pr-10"
                        >
                            <option value="all">All</option>
                            <option value="finished">Finished</option>
                            <option value="pending">Pending</option>
                        </select>
                        {/* Chevron Icon */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>

                {/* Todo List */}
                <div className="w-[95%] max-w-lg">
                    <ul className="space-y-4">
                        {todos.length === 0 && (
                            <p className="text-center text-blue-200 mt-10 font-medium italic">No tasks yet. Start by adding one above!</p>
                        )}

                        {filteredTodos.map(todo => (
                            <li
                                key={todo.id}
                                className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${todo.done
                                    ? "bg-slate-900/30 border-slate-800/50 opacity-90"
                                    : "bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl"
                                    }`}
                            >
                                {/* Custom Checkbox */}
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={todo.done}
                                        onChange={() => handleTodoStatus(todo.id)}
                                        className="peer h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-slate-700 transition-all checked:bg-indigo-600 checked:border-indigo-600 hover:border-indigo-500"
                                    />
                                    <svg className="absolute left-1 top-1 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>

                                {editId === todo.id ? (
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveTodo()}
                                            className="flex-1 bg-slate-800 border border-indigo-500 rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-100"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSaveTodo}
                                            className="text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 transition-colors"
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span
                                            className={`flex-1 text-lg transition-all duration-300 cursor-default ${todo.done ? "line-through text-slate-400" : "text-slate-200"
                                                }`}
                                        >
                                            {todo.text}
                                        </span>
                                        <div className="flex items-center gap-1 transition-opacity">
                                            <button
                                                onClick={() => handleEditTodo(todo)}
                                                className="p-2 text-slate-500 hover:text-amber-400 transition-colors"
                                                title="Edit Task"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTodo(todo.id)}
                                                className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                                                title="Delete Task"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}
