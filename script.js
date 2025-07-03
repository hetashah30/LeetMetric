document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.getElementById("stats-container");
  const easyProgress = document.getElementById("easy-progress");
  const mediumProgress = document.getElementById("medium-progress");
  const hardProgress = document.getElementById("hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.getElementById("stats-cards");
  const title = document.getElementById("title");
  const targetText = "LeetMetric";
  const chars = "#$/?*!:+<&";
  let iteration = 0;

  function animateTitle() {
    let displayText = "";
    for (let i = 0; i < targetText.length; i++) {
      if (i < iteration) {
        displayText += targetText[i];
      } else {
        displayText += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    title.textContent = displayText;

    if (iteration <= targetText.length) {
      iteration++;
      setTimeout(animateTitle, 70); // speed of effect
    } else {
      setTimeout(() => {
        iteration = 0;
        animateTitle();
      }, 3000); // how long before it repeats
    }
  }

  animateTitle(); // start animation

  // Validate username input
  //return true or false based on regex
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username cannot be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert(
        "Invalid Username: Username must be 1-15 characters long and can only contain letters, numbers, and underscores."
      );
      return false;
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = "Searching...";
      searchButton.style.backgroundColor = "#dbb790";
      searchButton.style.color = "#333";
      searchButton.style.fontWeight = "700";
      searchButton.disabled = true;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Unable to fetch user data. Please check the username."
        );
      }
      let data = await response.json();
      console.log("User data:", data);
      // Update circular progress bars
      const easyPercent = (data.easySolved / data.totalEasy) * 100;
      const mediumPercent = (data.mediumSolved / data.totalMedium) * 100;
      const hardPercent = (data.hardSolved / data.totalHard) * 100;

      easyProgress.style.setProperty("--progress-degree", `${easyPercent}%`);
      mediumProgress.style.setProperty(
        "--progress-degree",
        `${mediumPercent}%`
      );
      hardProgress.style.setProperty("--progress-degree", `${hardPercent}%`);

      easyLabel.textContent = `${data.easySolved}/${data.totalEasy} `;
      mediumLabel.textContent = `${data.mediumSolved}/${data.totalMedium} `;
      hardLabel.textContent = `${data.hardSolved}/${data.totalHard} `;

      // Update stat cards
      cardStatsContainer.innerHTML = `
        <div class="card" style="background-color: red">Total Solved: ${data.totalSolved}</div>
        <div class="card" style="background-color: blue">Total Questions: ${data.totalQuestions}</div>
        <div class="card" style="background-color: maroon">Acceptance Rate: ${data.acceptanceRate}%</div>
        <div class="card" style="background-color: green">Ranking: ${data.ranking}</div>
        <div class="card" style="background-color: purple">Reputation: ${data.reputation}</div>
        <div class="card" style="background-color: #242424">Contribution Points: ${data.contributionPoints}</div>
      `;
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
      searchButton.style.backgroundColor = "#242424";
      searchButton.style.color = "#fff";
    }
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("Logging username:", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
