import { useState, useReducer } from 'react'
import './App.css'

// const initialState = [];

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

function App() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [text, setText] = useState('');
  const [editId, setEditId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
    setIsEditing(true);
    setText(todo.text);
    setEditId(todo.id);
  }

  function handleSaveTodo() {
    dispatch({
      type: 'save',
      id: editId,
      text: text
    });
    setIsEditing(false);
    setText('');
    setEditId('');
  }

  return (
    <>
      <div className='add-task'>
        <input type="text"
          placeholder='Add task'
          value={text}
          onChange={(e) => setText(e.target.value)} />

        {isEditing ? (
          <button onClick={handleSaveTodo}>Save</button>
        ) : (
          <button onClick={handleAddTodo}>Add</button>
        )}
      </div>

      <div className='todo-list'>
        <ul>
          {
            todos.map(todo => (
              <li key={todo.id}>
                <input
                  type="checkbox"
                  name="" id=""
                  checked={todo.done}
                  onChange={() => handleTodoStatus(todo.id)} />
                <span>{todo.text}</span>
                <button onClick={() => handleEditTodo(todo)}>Edit</button>
                <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              </li>
            ))
          }
        </ul>
      </div>
    </>
  )
}

export default App
