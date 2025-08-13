
const headers = [
  { label: "Rank", key: "rank" },
  { label: "Song", key: "track_name" },
  { label: "Artists", key: "artists" },
  { label: "Release Date", key: "Release Date" },
  { label: "Source", key: "Source" },
  { label: "Total Weeks", key: "Total weeks on chart" },
  { label: "City", key: "city" },
  { label: "Date", key: "scraped_Date" }, 
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
 
  return (
    <div className="space-y-6">
      {/* Headers */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-10 px-4 sm:px-6 py-2 bg-gray-800 rounded-lg border border-gray-700 text-sm font-semibold text-yellow-400">
        <span className="w-full sm:w-auto">Sort by</span>
        {headers.map(({ label, key }) => {
          const isSorted = sortConfig.key === key;
          return (
            <div
              key={label}
              onClick={() =>
                key &&
                onSortChange((prev) => ({
                  key,
                  direction:
                    prev.key === key && prev.direction === "asc"
                      ? "desc"
                      : "asc",
                }))
              }
              className={`flex items-center gap-1 whitespace-nowrap 
          ${key ? "cursor-pointer select-none hover:text-yellow-300" : ""}
        `}
            >
              <span>{label}</span>
              {isSorted && (
                <span
                  className={`transition-transform duration-200 ${
                    sortConfig.direction === "asc" ? "rotate-0" : "rotate-180"
                  }`}
                >
                  ▲
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {songs.map((song, index) => (
          <div
            key={`${song.rank}-${index}`}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-md"
          >
            {/* City + Scraped Date */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 border-b border-gray-800">
              {/* Left: Rank + Info */}
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="flex items-start gap-3 sm:gap-4 w-full">
                  {/* Rank Badge */}
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full bg-purple-700 text-white font-bold text-xs xs:text-sm flex items-center justify-center shadow shrink-0">
                    #{song.rank}
                  </div>

                  {/* Song Info */}
                  <div className="space-y-1 min-w-0 w-full">
                    {/* Title + Tags */}
                    <h3 className="text-white flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-3 items-start sm:items-center text-sm xs:text-base sm:text-lg font-semibold break-words">
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
                      <div className="flex flex-wrap gap-1 text-[10px] xs:text-xs w-full sm:w-auto mt-1 sm:mt-0">
                        {song.city && (
                          <span className="border border-purple-500 capitalize text-purple-400 rounded hover:bg-purple-500 hover:text-white transition px-2 py-0.5 whitespace-nowrap">
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

                    {/* Artists + Source + Image (mobile first) */}
                    <div className="flex sm:flex-row  flex-wrap items-center gap-2 text-xs xs:text-sm text-gray-400 max-w-full">
                      {/* Image (mobile only) */}
                      <div className="w-12 h-12 xs:w-14 xs:h-14 sm:hidden rounded-lg overflow-hidden border border-gray-700 shadow shrink-0 flex-none">
                        <img
                          src={song.image_url}
                          alt={song.track_name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      {/* Text Info */}
                      <div className="flex flex-col gap-0.5 min-w-0">
                        {/* Artists */}
                        <p
                          className="truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[250px] md:max-w-[350px]"
                          title={song.artists.join(", ")}
                        >
                          {song.artists.join(", ")}
                        </p>

                        {/* Source */}
                        {song.details.Source && (
                          <div
                            className="truncate max-w-[100px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-[250px] flex-shrink"
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
              </div>

              {/* Image (desktop only) */}
              <div className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-700 shadow shrink-0">
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
