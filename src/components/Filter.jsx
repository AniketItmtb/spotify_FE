import { useState } from "react";

const FiltersSection = ({
  setSelectedCity,
  setSelectedDate,
  selectedCity, 
  currentSongs,
  filteredSongs, 
}) => {
  const [formattedDate, setFormattedDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const cities = [
    "Ahmedabad",
    "Bengaluru",
    "Chandigarh",
    "Chennai",
    "Delhi",
    "Guwahati",
    "Hyderabad",
    "Imphal",
    "Jaipur",
    "Kochi",
    "Kolkata",
    "Lucknow",
    "Ludhiana",
    "Mumbai",
    "Patna",
    "Pune",
  ];
  const [datee, setdatee] = useState("");
  const handleDateChange = (e) => {
    const rawDate = e.target.value;
    setdatee(rawDate);

    const inputDate = new Date(rawDate);
    const day = String(inputDate.getDate()).padStart(2, "0");
    const month = inputDate.toLocaleString("default", { month: "long" });
    const year = inputDate.getFullYear();

    const newFormattedDate = `${day}-${month}-${year}`;
    setFormattedDate(newFormattedDate);
    setSelectedDate(newFormattedDate);
  };

  const handleSubmit = () => {
    setIsOpen(false);
    // You could trigger filtering logic here if needed
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-900 border border-gray-700 rounded-xl">
      <p className="text-sm text-gray-400">
        Showing{" "}
        <span className="text-yellow-400 font-semibold">
          {currentSongs.length}
        </span>{" "}
        of{" "}
        <span className="text-yellow-400 font-semibold">
          {filteredSongs.length}
        </span>{" "}
        songs
      </p>

      <button
        onClick={() => setIsOpen(true)}
        className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-all"
      >
        🔍 Filters
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-80 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
            >
              ✖
            </button>

            <h3 className="text-lg font-semibold text-yellow-400 mb-4">
              Filters
            </h3>

            {/* City Filter */}
            <label className="block text-sm text-gray-400 mb-1">📍 City</label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
              }}
              
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-900 text-gray-200 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <label className="block text-sm text-gray-400 mb-1">
              📅 Date
            </label>
            <input
              type="date"
              value={datee}
              onChange={handleDateChange}
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-900 text-gray-200 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {formattedDate && (
              <p className="text-xs text-yellow-400 mb-4">
                Selected: {formattedDate}
              </p>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersSection;
