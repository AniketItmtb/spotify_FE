import { useState } from "react";
import LoadingOverlay from "./components/Loading";
import SongTable from "./components/SongTable";
import FiltersSection from "./components/Filter";
import { useEffect } from "react"; 
const API = import.meta.env.VITE_API;

const Index = () => {
 function getSpecialDate(today = new Date()) {
   const targetDates = [
     { month: 8, days: [1, 2, 3, 4, 5, 6] }, // Aug
     { month: 2, days: [15, 16, 17, 18, 19] }, // Feb
     { month: 2, days: [27, 28] }, // Feb
     { month: 3, days: [4, 5, 6, 7, 8, 9, 10, 11] }, // March
   ];

   const day = today.getDate();
   const month = today.getMonth() + 1; // 1-based
   const year = today.getFullYear();

   // 1️⃣ If today is Friday → return today
   if (today.getDay() === 5) {
     return formatDate(today);
   }

   // 2️⃣ If date > 11-Aug but not Friday → return 12-Aug
   if (month === 8 && day > 11) {
     return `12-August-${year}`;
   }

   // 3️⃣ If before 11-Aug → find nearest past date from list
   let possibleDates = [];
   targetDates.forEach(({ month: m, days }) => {
     days.forEach((d) => {
       let dateObj = new Date(year, m - 1, d);
       if (dateObj < today) {
         possibleDates.push(dateObj);
       }
     });
   });

   if (possibleDates.length > 0) {
     let nearest = possibleDates.reduce((prev, curr) => {
       return Math.abs(curr - today) < Math.abs(prev - today) ? curr : prev;
     });
     return formatDate(nearest);
   }

   // Default fallback
   return formatDate(today);
 }

 function formatDate(dateObj) {
   const day = String(dateObj.getDate()).padStart(2, "0");
   const monthName = dateObj.toLocaleString("en-US", { month: "long" });
   const year = dateObj.getFullYear();
   return `${day}-${monthName}-${year}`;
 }

  
  const [isLoading, setIsLoading] = useState(false); 
  const [songData, setSongData] = useState([]);
  const [hasScraped, setHasScraped] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "rank", direction: "asc" });
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState(getSpecialDate());
  const songsPerPage = 10;

  // 🔍 FILTERING
  const filteredSongs = songData.filter((song) => {
    
    // const dateMatch = selectedDate ? song.scraped_Date === selectedDate : true;
    const cityMatch = selectedCity.toLowerCase() ? song.city.toLowerCase() === selectedCity.toLowerCase() : true; 
    return  cityMatch;
  });

 const sortedSongs = [...filteredSongs].sort((a, b) => {
   if (!sortConfig.key) return 0;

   const key = sortConfig.key;

   const getValue = (song) => {
     // Handle rank and track_name explicitly
     if (key === "rank") return Number(song.rank);
     if (key === "track_name") return song.track_name.toLowerCase();

     // Handle artists array
     if (key === "artists") {
       return Array.isArray(song.artists)
         ? song.artists.join(", ").toLowerCase()
         : "";
     }

     // Handle city and scraped_Date top-level fields
     if (key === "city") return song.city ? song.city.toLowerCase() : "";
     if (key === "scraped_Date")
       return song.scraped_Date ? song.scraped_Date.toLowerCase() : "";

     // Handle dates - parse to timestamp
     const dateKeys = ["Release Date", "First entry date", "scraped_Date"];
     if (dateKeys.includes(key)) {
       const dateStr = song.details?.[key] || song[key] || "";
       const time = new Date(dateStr).getTime();
       return isNaN(time) ? 0 : time;
     }

     // Handle numeric field Total weeks on chart
     if (key === "Total weeks on chart") {
       const val = song.details?.[key];
       return val ? Number(val) : 0;
     }

     // Handle Source inside details
     if (key === "Source") {
       return song.details?.[key]?.toLowerCase() || "";
     }

     // Default fallback: try details[key] as string lowercase
     return song.details?.[key]?.toString().toLowerCase() || "";
   };

   const aVal = getValue(a);
   const bVal = getValue(b);

   const direction = sortConfig.direction === "asc" ? 1 : -1;

   // Numeric comparison if both values are numbers
   if (typeof aVal === "number" && typeof bVal === "number") {
     return (aVal - bVal) * direction;
   }

   // String comparison otherwise
   return aVal.localeCompare(bVal) * direction;
 });

  const totalPages = Math.ceil(sortedSongs.length / songsPerPage);
  const currentSongs = sortedSongs.slice(
    (currentPage - 1) * songsPerPage,
    currentPage * songsPerPage
  );

  

  // 📤 FILTERS
  const handleFiltersChange = ({ city, date }) => {
    setSelectedCity(city);
    setSelectedDate(date);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dateParam = getSpecialDate(new Date(selectedDate));

  useEffect(() => {
    const fetchData = async () => {
     setIsLoading(true);

     try {
       let initialRes = await fetch(`${API}/song`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ date: dateParam }),
       });

       if (!initialRes.ok) throw new Error("Failed to fetch initial song data");

       let initialData = await initialRes.json();
       let parsedBody = JSON.parse(initialData.body);

       setSongData(parsedBody.data);
       setCurrentPage(1);
       setHasScraped(true);
     } catch (error) {
       console.error(error);
       // Optionally, show an error to user
     } finally {
       setIsLoading(false);
     }
 // Stop loader here so old data is visible immediately
    };

    fetchData();
  }, [selectedDate, dateParam]);

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <LoadingOverlay
        isVisible={isLoading}
        message="Loading data from Spotify..."
        currentStep={1}
        totalSteps={1}
      />
      {/* 🎵 Hero Section */}
      <section className="relative py-20 px-4 text-center">
        {/* Scrape button in top right */}
        {/* <button
          onClick={async () => {
            // Fetch current songs (before scraping)
            await handleScrapeCharts();

            // Open scrape progress page
            const win = window.open(
              "/scrape.html",
              "_blank",
              "width=800,height=600"
            );

            // Listen for "scrapeComplete" event from scrape.html
            window.addEventListener("message", async (event) => {
              if (event.data === "scrapeComplete") {
                // Fetch updated data after scraping
                const finalRes = await fetch(SONGS_API);
                const { data } = await finalRes.json();
                setSongData(data);
                setCurrentPage(1);
              }
            });
          }}
          className="absolute top-4 right-4 bg-yellow-500 text-black font-medium px-4 py-2 text-sm rounded-lg shadow hover:bg-yellow-400 disabled:opacity-50 transition-all"
        >
          🎵 Get New Data
        </button> */}

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl text-yellow-400">🎵</span>
            <span className="text-3xl text-yellow-400">✨</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 mb-6">
            Spotify City Charts
          </h1> 
          <p>powered by SPOTIFY...🎵</p>
        </div>
      </section>

      {/* 📊 Table & Filters Section */}
      {hasScraped && (
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto space-y-8">
            <FiltersSection
              onFiltersChange={handleFiltersChange}
              selectedCity={selectedCity}
              selectedDate={selectedDate}
              setSelectedCity={setSelectedCity}
              setSelectedDate={setSelectedDate}
              currentSongs={currentSongs}
              filteredSongs={filteredSongs}
            />

            <SongTable
              songs={currentSongs}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              sortConfig={sortConfig}
              onSortChange={setSortConfig}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
