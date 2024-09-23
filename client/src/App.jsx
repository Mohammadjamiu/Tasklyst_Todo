import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Square, SquareCheck, SquareChevronDown, Trash2 } from "lucide-react";

const App = () => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://your-app.onrender.com/api"
      : "http://localhost:3001/api";

  const [getTodos, setGetTodos] = useState([]);
  const [taskToAdd, setTaskToAdd] = useState("");
  const [taskToComplete, setTaskToComplete] = useState(false);
  useEffect(() => {
    Axios.get(`${API_URL}/todos/`)
      .then((response) => {
        setGetTodos(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleTaskAddition = () => {
    Axios.post(`${API_URL}/todos/`, { title: taskToAdd })
      .then((response) => {
        setGetTodos((prevTodos) => [response.data, ...prevTodos]);
      })
      .catch((err) => {});
  };

  const handleDeleteTodo = (id) => {
    // Find the todo you want to delete before removing it from the state
    const todoToDelete = getTodos.find((todo) => todo._id === id);

    // Optimistically update the state by filtering out the todo
    setGetTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));

    // Send the delete request to the server
    Axios.delete(`${API_URL}/todos/${id}`)
      .then((response) => {
        // The request succeeded, and the UI has already been updated optimistically
        alert("Task deleted");
      })
      .catch((err) => {
        console.error(err);
        // The delete request failed, so we rollback the change by restoring the deleted todo
        alert("Failed to delete task. Rolling back...");

        // Add the deleted todo back to the state to "rollback" the UI
        setGetTodos((prevTodos) => [...prevTodos, todoToDelete]);
      });
  };

  const handleTaskComplete = (id, currentStatus) => {
    // Optimistically update the UI before the API call
    setGetTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, completed: !currentStatus } : todo
      )
    );

    // Send PUT request to the server to update task completion
    Axios.put(`${API_URL}/todos/${id}`, {
      completed: !currentStatus, // Toggle the current completion status
    })
      .then((response) => {
        const updatedTodo = response.data; // Get updated task from server (if needed)
        // Optionally, confirm the task status from the server and ensure state consistency
        setGetTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === updatedTodo._id ? updatedTodo : todo
          )
        );
      })
      .catch((err) => {
        // If there is an error, revert the change
        console.error(err);
        // Revert the optimistic update (if desired)
        setGetTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, completed: currentStatus } : todo
          )
        );
      });
  };

  return (
    <>
      {/* <div className="max-w-sm m-auto grid justify-center bg-white border py-5 rounded-lg  mt-16">
        <div className=" py-2">
          <h1 className="text-gray-800 font-bold text-2xl uppercase">
            To-Do List
          </h1>
        </div>
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            onChange={(e) => {
              setTaskToAdd(e.target.value);
            }}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Add a task"
          />
          <button
            onClick={handleTaskAddition}
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
          >
            Add
          </button>
        </div>

        <ul className="divide-y divide-gray-200 ">
          {getTodos.map((todo) => (
            <div className="py-4" key={todo._id}>
              <div className="ml-3 text-gray-900 flex justify-between items-center w-full">
                <span className="text-lg font-medium">{todo.title}</span>

                <div className="flex">
                
                  {todo.completed ? (
                    <SquareCheck
                      className="cursor-pointer mr-2"
                      onClick={() =>
                        handleTaskComplete(todo._id, todo.completed)
                      }
                    />
                  ) : (
                    <Square
                      className="cursor-pointer mr-2"
                      onClick={() =>
                        handleTaskComplete(todo._id, todo.completed)
                      }
                    />
                  )}
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="text-sm font-light text-gray-500"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div> */}
      <div className="relative h-screen pt-10 w-full bg-gradient-to-r from-red-700 to-orange-700 opacity-75">
        <div className="Tasklyst_Todo p-4 absolute inset-0  pt-10 max-w-[26rem] m-auto">
          <div className=" ">
            <h1 className="poppins-bold text-2xl text-center text-white">
              Tasklyst Todo
            </h1>
            <div className="todo_input mt-8 flex justify-center items-center">
              <input
                type="text"
                onChange={(e) => {
                  setTaskToAdd(e.target.value);
                }}
                className="capitalize py-3 px-4 ps-5 block w-full bg-gray-100 text-red-500 border border-transparent rounded-md text-sm focus:outline-none mr-3"
                placeholder="Add a task todo"
              />
              <button
                onClick={handleTaskAddition}
                className="flex justify-center items-center w-[75px] h-11 rounded-md bg-[#fafafaf6]"
              >
                <SquareChevronDown className="text-[rgb(239,68,68)]" />
              </button>
            </div>
            <div className="mt-7">
              {getTodos &&
                getTodos.map((todo) => (
                  <div
                    className="mt-4 h-12 py-3 px-4 ps-5  w-full flex justify-center items-center bg-[#ee3131] text-red-500
             rounded-md mr-3"
                    key={todo._id}
                  >
                    <div className="ml-3 text-gray-900 flex justify-between items-center w-full">
                      <span className="capitalize text-[15px] poppins-regular font-medium text-white pb-0.5">
                        {todo.title}
                      </span>

                      <div className="flex">
                        {todo.completed ? (
                          <SquareCheck
                            className="cursor-pointer mr-2 text-white"
                            onClick={() =>
                              handleTaskComplete(todo._id, todo.completed)
                            }
                          />
                        ) : (
                          <Square
                            className="cursor-pointer mr-2 text-white"
                            onClick={() =>
                              handleTaskComplete(todo._id, todo.completed)
                            }
                          />
                        )}
                        <button
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="text-sm font-light"
                        >
                          <Trash2 className="cursor-pointer mr-2 text-[#ddd]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* <span className="poppins-bold text-sm text-[#ffd2b2] block absolute bottom-0 max-w-sm m-auto">
          Designed by: Mohammad Jamiu
        </span> */}
        </div>
      </div>
    </>
  );
};

export default App;
