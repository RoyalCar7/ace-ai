const grid = document.getElementById("toolsGrid");
const searchInput = document.getElementById("searchInput");
const audienceSelect = document.getElementById("audienceSelect");

let allTools = [];

// Load tools from tools.json instead of backend
async function loadToolsFromJSON() {
    const res = await fetch("tools.json");
    allTools = await res.json();
    renderTools(allTools);
}

// Render tools to grid
function renderTools(tools) {
    grid.innerHTML = "";

    tools.forEach(tool => {
        const card = document.createElement("div");
        card.className = "tool-card";

        card.innerHTML = `
            <span class="badge">${tool.category}</span>
            <h3>${tool.emoji} ${tool.name}</h3>
            <p>${tool.description}</p>
            <span class="audience ${tool.audience.toLowerCase()}">
                ${tool.audience === "Both"
                ? "🎓 Students & 👩‍🏫 Teachers"
                : tool.audience === "Students"
                    ? "🎓 Best for Students"
                    : "👩‍🏫 Best for Teachers"
            }
            </span>
            <a href="${tool.url}" target="_blank">Visit →</a>
        `;

        grid.appendChild(card);
    });
}

// Filter tools in frontend
function filterTools() {
    const q = searchInput.value.toLowerCase();
    const audience = audienceSelect.value;

    const filtered = allTools.filter(tool => {

        // Audience filter
        if (audience !== "All" && tool.audience !== audience) {
            return false;
        }

        // Search filter (name + description + category)
        if (
            !tool.name.toLowerCase().includes(q) &&
            !tool.description.toLowerCase().includes(q) &&
            !tool.category.toLowerCase().includes(q)
        ) {
            return false;
        }

        return true;
    });

    renderTools(filtered);
}

// Event listeners
searchInput.addEventListener("input", filterTools);
audienceSelect.addEventListener("change", filterTools);

// Initial load
loadToolsFromJSON();


