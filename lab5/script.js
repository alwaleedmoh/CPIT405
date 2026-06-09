const players = [
    { name: "Joel Embiid", team: "PHI", points: 33, rebounds: 10.8, assists: 5.7 },
    { name: "Jalen Brunson", team: "NYK", points: 32.4, rebounds: 3.3, assists: 7.5 },
    { name: "Shai Gilgeous-Alexander", team: "OKC", points: 30.2, rebounds: 7.2, assists: 6.4 },
    { name: "Tyrese Maxey", team: "PHI", points: 29.8, rebounds: 5.2, assists: 6.8 },
    { name: "Donovan Mitchell", team: "CLE", points: 29.6, rebounds: 5.4, assists: 4.7 }
];

const tableBody = document.getElementById("player-table-body");
const searchInput = document.getElementById("search-players");
const teamFilter = document.getElementById("team-filter");
const darkModeBtn = document.getElementById("toggle-dark-mode");

function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(p => {
        const row = `<tr>
            <td>${p.name}</td>
            <td>${p.team}</td>
            <td>${p.points}</td>
            <td>${p.rebounds}</td>
            <td>${p.assists}</td>
        </tr>`;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}

function updateTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedTeam = teamFilter.value;

    const filtered = players.filter(p => {
        const matchesName = p.name.toLowerCase().includes(searchTerm);
        const matchesTeam = selectedTeam === "All" || p.team === selectedTeam;
        return matchesName && matchesTeam;
    });
    renderTable(filtered);
}

// Events
searchInput.addEventListener("input", updateTable);
teamFilter.addEventListener("change", updateTable);
darkModeBtn.addEventListener("click", () => document.body.classList.toggle("dark-mode"));

// Initial Render
renderTable(players);