import Navbar from "./components/Navbar/Navbar";
import Filter from "./components/Filter/Filter";
import Table from "./components/Table/Table";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Main Content */}

      <section className="w-full">
        <Filter />
        <Table />
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-800 text-white py-4 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
