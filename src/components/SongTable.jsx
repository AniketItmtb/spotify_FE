
const headers = [
  { label: "Rank", key: "rank" },
  { label: "Song", key: "track_name" },
  { label: "Artists", key: "artists" },
  { label: "Release Date", key: "Release Date" },
  { label: "Source", key: "Source" },
  { label: "Total Weeks", key: "Total weeks on chart" },
  { label: "City", key: "city" },
  { label: "Date", key: "scraped_Date" },
  { label: "Listen", key: "" },
];

const SongTable = ({
  songs,
  currentPage,
  totalPages,
  onPageChange,
  sortConfig,
  onSortChange,
}) => {
  const maxButtons = 5; // how many page buttons to show
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = startPage + maxButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  // Sorting function with all keys handled properly
  // const getValue = (song) => {
  //   const key = sortConfig.key;

  //   if (!key) return "";

  //   // Handle rank and track_name directly
  //   if (key === "rank") return Number(song.rank);
  //   if (key === "track_name") return song.track_name.toLowerCase();

  //   // Handle artists array
  //   if (key === "artists") {
  //     return Array.isArray(song.artists)
  //       ? song.artists.join(", ").toLowerCase()
  //       : "";
  //   }

  //   // Handle city and scraped_Date (top-level fields)
  //   if (key === "city") {
  //     return song.city ? song.city.toLowerCase() : "";
  //   }

  //   if (key === "scraped_Date") {
  //     return song.scraped_Date ? song.scraped_Date.toLowerCase() : "";
  //   }

  //   // Handle Release Date and other date fields inside details - parse dates for sorting
  //   const dateKeys = ["Release Date", "First entry date", "scraped_Date"];
  //   if (dateKeys.includes(key)) {
  //     const dateStr = song.details?.[key] || song[key] || "";
  //     const dateVal = new Date(dateStr);
  //     return isNaN(dateVal) ? 0 : dateVal.getTime();
  //   }

  //   // Handle numeric field Total weeks on chart inside details
  //   if (key === "Total weeks on chart") {
  //     const val = song.details?.[key];
  //     return val ? Number(val) : 0;
  //   }

  //   // Handle Source inside details
  //   if (key === "Source") {
  //     return song.details?.[key]?.toLowerCase() || "";
  //   }

  //   // For Listen or any unknown key, return empty string
  //   return "";
  // };

  // Sort the songs according to sortConfig
  // const sortedSongs = [...songs].sort((a, b) => {
  //   if (!sortConfig.key) return 0;

  //   const aVal = getValue(a);
  //   const bVal = getValue(b);

  //   const direction = sortConfig.direction === "asc" ? 1 : -1;

  //   // If both are numbers, numeric sort
  //   if (typeof aVal === "number" && typeof bVal === "number") {
  //     return (aVal - bVal) * direction;
  //   }

  //   // Otherwise, string comparison
  //   return aVal.localeCompare(bVal) * direction;
  // });

  return (
    <div className="space-y-6">
      {/* Headers */}
      <div className="hidden sm:grid grid-cols-9 gap-4 px-6 py-2 bg-gray-800 rounded-lg border border-gray-700 text-sm font-semibold text-yellow-400">
        {headers.map(({ label, key }) => (
          <div
            key={label}
            onClick={() =>
              key &&
              onSortChange((prev) => ({
                key,
                direction:
                  prev.key === key && prev.direction === "asc" ? "desc" : "asc",
              }))
            }
            className={`whitespace-nowrap ${
              key ? "cursor-pointer hover:underline" : ""
            }`}
          >
            {label}
            {sortConfig.key === key && (
              <span className="ml-1">
                {sortConfig.direction === "asc" ? "▲" : "▼"}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {songs.map((song, index) => (
          <div
            key={`${song.rank}-${index}`}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-md"
          >
            {/* City + Scraped Date */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 border-b border-gray-800">
              {/* Left: Rank + Info */}
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-bold text-sm flex items-center justify-center shadow shrink-0">
                    #{song.rank}
                  </div>

                  {/* Song Info */}
                  <div className="space-y-1 min-w-0 w-full">
                    <h3 className="text-white flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 items-start sm:items-center text-base sm:text-lg font-semibold break-words">
                      {/* Song Title */}
                      <a
                        href={song.track_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-violet-400 break-words w-full sm:w-auto"
                      >
                        {song.track_name}
                      </a>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 text-xs w-full sm:w-auto mt-1 sm:mt-0">
                        {song.city && (
                          <span className="border border-purple-500 text-purple-400 rounded hover:bg-purple-500 hover:text-white transition px-2 py-0.5 whitespace-nowrap">
                            {song.city}
                          </span>
                        )}
                        {song.scraped_Date && (
                          <span className="border border-purple-500 text-purple-400 rounded hover:bg-purple-500 hover:text-white transition px-2 py-0.5 whitespace-nowrap">
                            {song.scraped_Date}
                          </span>
                        )}
                      </div>
                    </h3>

                    {/* Artists + Source */}
                    <div className="flex flex-wrap items-center  text-sm text-gray-400 gap-1 max-w-full">
                      <p
                        className="truncate max-w-[180px] sm:max-w-[250px] md:max-w-[350px]"
                        title={song.artists.join(", ")}
                      >
                        {song.artists.join(", ")}
                      </p>

                      {song.details.Source && (
                        <div
                          className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-[250px] flex-shrink"
                          title={song.details.Source}
                        >
                          <span className="text-gray-400"> || Source: </span>
                          {song.details.Source}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-700 shadow shrink-0">
                <img
                  src={song.image_url}
                  alt={song.track_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 md:grid-cols-5 mt-6 gap-y-3 gap-x-6 text-sm text-gray-300">
              <div>
                <p className="text-xs text-gray-400">Release Date</p>
                <p>{song.details["Release Date"]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">First Entry Date</p>
                <p>{song.details["First entry date"]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Entry Position</p>
                <p>#{song.details["First entry position"]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Weeks on Chart</p>
                <p>{song.details["Total weeks on chart"]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Songwriters</p>
                <p>{song.details.Songwriters}</p>
              </div>
            </div>

            {/* Songwriters & Source */}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-3 py-1 border text-sm rounded ${
            currentPage <= 1
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "border-gray-600 text-white hover:bg-gray-800"
          }`}
        >
          Previous
        </button>

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const pageNum = startPage + i;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 border text-sm rounded ${
                currentPage === pageNum
                  ? "bg-purple-500 text-white font-semibold"
                  : "border-gray-600 text-white hover:bg-gray-800"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-3 py-1 border text-sm rounded ${
            currentPage >= totalPages
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "border-gray-600 text-white hover:bg-gray-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SongTable;
