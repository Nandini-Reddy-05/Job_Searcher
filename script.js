const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const locationInput = document.getElementById("locationInput");
const jobsContainer = document.getElementById("jobsContainer");
const loader = document.getElementById("loader");

searchBtn.addEventListener("click", fetchJobs);

async function fetchJobs() {
    const keyword = searchInput.value.trim();
    const category = categorySelect.value;
    const location = locationInput.value.trim();

    loader.classList.remove("hidden");
    jobsContainer.innerHTML = "";

    try {
        let url = `https://remotive.com/api/remote-jobs?`;

        if (keyword) url += `search=${keyword}&`;
        if (category) url += `category=${category}&`;

        const response = await fetch(url);
        const data = await response.json();

        let jobs = data.jobs;

        // Location filter manually (since API does not filter perfectly by location)
        if (location) {
            jobs = jobs.filter(job =>
                job.candidate_required_location.toLowerCase().includes(location.toLowerCase())
            );
        }

        displayJobs(jobs);

    } catch (error) {
        jobsContainer.innerHTML = `<p>Error fetching jobs.</p>`;
    }

    loader.classList.add("hidden");
}

function displayJobs(jobs) {
    if (!jobs.length) {
        jobsContainer.innerHTML = "<p>No jobs found.</p>";
        return;
    }

    jobs.forEach(job => {
        const card = document.createElement("div");
        card.className = "job-card";

        card.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Company:</strong> ${job.company_name}</p>
            <p><strong>Category:</strong> ${job.category}</p>
            <p><strong>Location:</strong> ${job.candidate_required_location}</p>
            <a href="${job.url}" target="_blank">Apply Now</a>
        `;

        jobsContainer.appendChild(card);
    });
}

// Initial Load
fetchJobs();
