import { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { getTasks, updateTask, deleteTask } from "../../utils/api";

function Table() {
  const [data, setData] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // Track the task being edited
  const [updatedTask, setUpdatedTask] = useState({}); // Track updated task details

  // Fetch tasks on component mount
  async function fetchData() {
    try {
      const res = await getTasks();
      setData(res);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  }

  // Handle delete task
  async function deleteData(id) {
    console.log("Deleting task with ID:", id);
    try {
      const res = await deleteTask(id);
      console.log("Delete Response:", res);
      fetchData();
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  }

  // Handle edit task (show modal/form)
  function handleEditTask(task) {
    setEditingTask(task); // Set the task to be edited
    setUpdatedTask({
      name: task.name,
      schedule: task.schedule,
      email: task.email,
      message: task.message,
    });
  }

  // Handle update task (send updated task data to backend)
  async function handleUpdateTask() {
    try {
      const res = await updateTask(editingTask.id, updatedTask); // Send updated data
      console.log("Edit Response:", res);
      fetchData(); // Fetch updated tasks list after editing
      setEditingTask(null); // Close the edit modal/form
    } catch (error) {
      console.log("Error updating task:", error);
    }
  }

  // Handle changes in the form fields
  function handleInputChange(event) {
    const { name, value } = event.target;
    setUpdatedTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full overflow-x-auto flex justify-center bg-gray-50 py-6 rounded-lg shadow-md">
      <table className="w-full md:w-11/12 border-collapse table-auto bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white text-sm uppercase">
            <th className="px-6 py-4 text-center">Task Name</th>
            <th className="px-6 py-4 text-center">Schedule</th>
            <th className="px-6 py-4 text-center">Email</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="px-6 py-4 text-center">{task.name}</td>
                <td className="px-6 py-4 text-center">{task.schedule}</td>
                <td className="px-6 py-4 text-center">{task.email}</td>
                <td className="px-6 py-4 text-center flex justify-center items-center">
                  <span
                    className={`font-bold ${
                      task.status === "Completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {task.status === "Completed" ? <TiTick /> : <ImCross />}
                  </span>
                </td>
                <td className="px-6 py-4 text-center ">
                  <button
                    onClick={() => handleEditTask(task)} // Open the edit form/modal
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteData(task.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Task Modal/Form */}
      {editingTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-700">
              Edit Task
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateTask();
              }}
            >
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Task Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={updatedTask.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="schedule"
                  className="block text-sm font-medium text-gray-700"
                >
                  Schedule
                </label>
                <input
                  type="text"
                  name="schedule"
                  value={updatedTask.schedule}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={updatedTask.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={updatedTask.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)} // Close the modal
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
