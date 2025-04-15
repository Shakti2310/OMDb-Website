// Selecting the search input field and the sections of the page
const searchInput = document.querySelector("#search-input");
const upperSection = document.querySelector("#upper-section");
const lowerSection = document.querySelector("#lower-section");

// Adding event listener for the "Enter" key to trigger the movie search
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    fetchMovieData();
  }
});

// Adding event listener for the "Enter" button click to trigger the movie search
searchInput.nextElementSibling.addEventListener("click", () => {
  fetchMovieData();
});

// Function to fetch movie data from the OMDb API
async function fetchMovieData() {
  try {
    // Adjusting the layout of the page to display the movie details
    upperSection.classList.remove("md:flex-1");
    upperSection.classList.remove("flex-[4]");
    upperSection.classList.add("md:flex-[3]");
    upperSection.classList.add("flex-[2]");
    lowerSection.classList.remove("md:flex-1");
    lowerSection.classList.remove("flex-[6]");
    lowerSection.classList.add("md:flex-[7]");
    lowerSection.classList.add("flex-[8]");
    searchInput.parentElement.parentElement.classList.remove("md:inset-0");
    searchInput.parentElement.parentElement.classList.remove("top-[36%]");
    searchInput.parentElement.parentElement.classList.add("md:top-[26%]");
    searchInput.parentElement.parentElement.classList.add("top-[16%]");

    // Getting the search value entered by the user
    const searchValue = searchInput.value.trim();

    // Check if the search value is empty
    if (!searchValue) {
      alert("Please enter a movie name to search.");
      return;
    }

    // Constructing the API URL with the search value
    const API = `http://www.omdbapi.com/?t=${searchValue}&apikey=54bdaf70`;

    // Fetching data from the API
    const response = await fetch(API);

    // Check if the response is not OK
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Check if the API returned an error or no data
    if (data.Response === "False") {
      alert(`Error: ${data.Error}`);
      return;
    }

    // Creating a container for displaying movie details
    const infoElement = document.createElement("div");
    infoElement.innerHTML = `
    <div class="border-2 border-white rounded-2xl flex max-[695px]:flex-col max-[695px]:p-2.5">
        <div class="w-80 flex justify-center items-center max-[695px]:w-full">
          <img src="${data.Poster}" alt="image" class="w-64 h-7/8 rounded-xl max-[695px]:w-32 max-[695px]:rounded-lg"/>
        </div>
        <div class="text-white w-4/6 min-[695px]:pt-6 min-[695px]:pb-6 text-left text-sm font-poppins max-[695px]:w-full max-[695px]:text-xs">
          <h2 class="text-3xl font-bold text-gray-200">${data.Title}</h2>
          <div id="genres" class="mb-3 mt-2"></div>
          <div class="text-gray-400 leading-5 text-sm mr-2 mb-3">${data.Plot}</div>
          <div class="flex flex-col justify-between h-2/5">
            <div class="text-gray-400">Director: <span class="text-gray-200">${data.Director}</span></div>
            <div class="text-gray-400">Writers: <span class="text-gray-200">${data.Writer}</span></div>
            <div class="text-gray-400">Starring: <span class="text-gray-200">${data.Actors}</span></div>
            <div class="text-gray-400">Box-office Collection: <span class="text-gray-200">${data.BoxOffice}</span></div>
            <div class="text-gray-400">Released on: <span class="text-gray-200">${data.Released}</span></div>
            <div class="text-gray-400">Runtime: <span class="text-gray-200">${data.Runtime}</span></div>
            <div class="text-gray-400 min-[695px]:hidden">IMDb Rating: <span class="text-gray-200">${data.imdbRating}(${data.imdbVotes})</span></div>
          </div>
          <div id="rating" class="w-full md:w-2/3 h-28 flex justify-around md:justify-between items-center max-[695px]:hidden"></div>
        </div>
      </div>
    `;

    // Clears the previous content in the lower section and append the new movie details
    lowerSection.innerHTML = "";
    lowerSection.appendChild(infoElement);

    // Adding ratings to the movie details
    const ratingElement = document.querySelector("#rating");
    if (data.Ratings.length > 0) {
      data.Ratings.forEach((rating, i) => {
        const ratingTab = document.createElement("a");
        ratingTab.className = "bg-inputBar cursor-pointer rounded-xl flex flex-col justify-center text-xs items-center w-20 h-16 text-gray-400";

        // Adding rating source logos
        const logo = document.createElement("img");
        logo.className = "w-16 rounded-md mb-2";
        logo.src = `./images/${data.Ratings[i].Source}.png`;
        ratingTab.appendChild(logo);

        // Adding rating values
        const ratingText = document.createElement("h1");
        ratingText.innerHTML = `Rating: <span class="text-white">${data.Ratings[i].Value.split("/")[0]}</span>`;
        ratingTab.appendChild(ratingText);

        ratingElement.appendChild(ratingTab);
      });
    }

    // Adding genres to the movie details
    const genresElement = document.querySelector("#genres");
    const genres = data.Genre.split(", ");
    genres.forEach((genre) => {
      const span = document.createElement("span");
      span.className = "text-gray-400 text-xs bg-inputBar pr-2 pl-2 pt-1 pb-1 rounded-3xl mr-2";
      span.innerText = genre;
      genresElement.appendChild(span);
    });
  } catch (error) {
    // Handle any errors that occur during the API call or data processing
    console.error("An error occurred:", error);
    alert("An error occurred while fetching movie data. Please try again later.");
  }
}
