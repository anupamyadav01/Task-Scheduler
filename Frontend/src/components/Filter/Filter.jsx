import { useState } from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";
import { createTask } from "../../utils/api"; // Ensure this function works as expected

function Filter() {
  const [showForm, setShowForm] = useState(false);
  const [taskData, setTaskData] = useState({
    name: "",
    email: "",
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function create() {
    const cronExpression = `${taskData.minute} ${taskData.hour} ${taskData.dayOfMonth} ${taskData.month} ${taskData.dayOfWeek}`;
    const newTask = {
      name: taskData.name,
      schedule: cronExpression,
      email: taskData.email,
      message: "This is Auto generated message", // you can customize this message
      expiration: "",
    };

    // Call the backend API to create the task
    const res = await createTask(newTask);
    console.log("respo", res);

    if (res) {
      setTaskData({
        name: "",
        email: "",
        minute: "*",
        hour: "*",
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: "*",
      }); // Clear the form data
      setShowForm(false); // Close the modal
    } else {
      console.error("Error creating task:", res.message);
      // Handle error if needed (e.g., show error message to the user)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white w-full shadow-lg">
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-80 p-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm transition">
            <IoFilterSharp className="text-lg" />
            Filter
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="p-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500 transition"
          >
            + Create
          </button>
          <button className="flex items-center gap-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm transition">
            <FaCloudDownloadAlt className="text-lg" />
            Export
          </button>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="flex flex-col items-center gap-6 p-6 bg-white text-gray-800 w-full max-w-lg rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-700">Create Task</h3>

            {[
              /* Form fields */
              {
                label: "Task Name",
                name: "name",
                type: "text",
                placeholder: "Enter task name",
                helper: "A short descriptive name for the task.",
              },
              {
                label: "Notification Email",
                name: "email",
                type: "email",
                placeholder: "Enter email address",
                helper: "Email where notifications will be sent.",
              },
              {
                label: "Minute",
                name: "minute",
                type: "number",
                placeholder: "0-59",
                helper: "Specify the minute of execution (0-59).",
              },
              {
                label: "Hour",
                name: "hour",
                type: "number",
                placeholder: "0-23",
                helper: "Specify the hour of execution (0-23).",
              },
              {
                label: "Day of Month",
                name: "dayOfMonth",
                type: "number",
                placeholder: "1-31",
                helper: "Specify the day of the month (1-31).",
              },
              {
                label: "Month",
                name: "month",
                type: "number",
                placeholder: "1-12",
                helper: "Specify the month (1-12).",
              },
              {
                label: "Day of Week",
                name: "dayOfWeek",
                type: "text",
                placeholder: "0-6 (Sun-Sat)",
                helper: "Specify the day of the week (0-6 or Sun-Sat).",
              },
            ].map(({ label, name, type, placeholder }) => (
              <label key={name} className="flex flex-col w-full gap-1">
                <span className="text-sm font-medium text-gray-600">
                  {label}
                </span>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={taskData[name]}
                  onChange={handleInputChange}
                  className="p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </label>
            ))}

            <div className="flex gap-4">
              <button
                onClick={create}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500 transition"
              >
                Submit
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-400 transition"
              >
                Close X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
