const grid = document.getElementById("toolsGrid");
const searchInput = document.getElementById("searchInput");
const audienceSelect = document.getElementById("audienceSelect");

async function loadTools() {
    const q = searchInput.value;
    const audience = audienceSelect.value;

    const params = new URLSearchParams({ q, audience });
    const res = await fetch(`/api/tools?${params}`);
    const tools = await res.json();

    grid.innerHTML = "";

    tools.forEach(tool => {
        const card = document.createElement("div");
        card.className = "tool-card";

        card.innerHTML = `
            <span class="badge">${tool.category}</span>
            <h3> ${tool.emoji} ${tool.name}</h3>
            <p>${tool.description}</p>
            <span class="audience ${tool.audience.toLowerCase()}">
                ${tool.audience === "Both" ? "🎓 Students & 👩‍🏫 Teachers" :
                tool.audience === "Students" ? "🎓 Best for Students" :
                    "👩‍🏫 Best for Teachers"}
            </span>
            <a href="${tool.url}" target="_blank">Visit →</a>
        `;

        grid.appendChild(card);
    });
}

searchInput.addEventListener("input", loadTools);
audienceSelect.addEventListener("change", loadTools);

loadTools();

