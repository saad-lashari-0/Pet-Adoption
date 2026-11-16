/* Name: Muhammad Saad Baloch */
/* Roll Number: i263147 */
/* Section: SE-C */

let currentCategory = "all";

// Run initialization functions when any page finishes loading
document.addEventListener("DOMContentLoaded", function () {
    updatePetAdoptionStatuses();
    loadSelectedPetIntoForm();
    loadGalleryLikes();
});

// ==========================================
// 1. HOME PAGE: FILTERING, SEARCH & ADOPTION
// ==========================================
function setCategoryFilter(category) {
    currentCategory = category;
    filterPets();
}

function filterPets() {
    const searchInput = document.getElementById("petSearchInput");
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".pet-card");
    let visibleCount = 0;

    cards.forEach(function (card) {
        const name = card.getAttribute("data-name").toLowerCase();
        const breed = card.getAttribute("data-breed").toLowerCase();
        const category = card.getAttribute("data-category");

        const matchesCategory = (currentCategory === "all" || category === currentCategory);
        const matchesSearch = (name.includes(query) || breed.includes(query));

        if (matchesCategory && matchesSearch) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    const noPetsMsg = document.getElementById("noPetsMsg");
    if (noPetsMsg) {
        noPetsMsg.style.display = visibleCount === 0 ? "block" : "none";
    }
}

function selectPetForAdoption(name) {
    console.log("Thank you for choosing to adopt, " + name + "!");
    localStorage.setItem("selectedPetForAdoption", name);
    window.location.href = "adopt.html";
}

function updatePetAdoptionStatuses() {
    const adoptedPets = JSON.parse(localStorage.getItem("adoptedPetsList")) || [];
    const pets = ["Max", "Bella", "Cooper"];

    pets.forEach(function (pet) {
        const badge = document.getElementById("badge-" + pet);
        const btn = document.getElementById("btn-" + pet);

        if (badge && btn && adoptedPets.includes(pet)) {
            badge.textContent = "Application Pending";
            badge.classList.add("adopted");
            btn.textContent = "Pending Adoption";
            btn.disabled = true;
        }
    });
}

function resetAllAdoptions() {
    localStorage.removeItem("adoptedPetsList");
    localStorage.removeItem("selectedPetForAdoption");
    location.reload();
}

// ==========================================
// 2. CARE PAGE: TABLE SEARCH, QUIZ & CALCULATOR
// ==========================================
function searchDietTable() {
    const input = document.getElementById("tableSearchInput");
    const table = document.getElementById("dietTable");
    if (!input || !table) return;

    const filter = input.value.toLowerCase();
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const rowText = rows[i].textContent.toLowerCase();
        rows[i].style.display = rowText.includes(filter) ? "" : "none";
    }
}

function recommendPet() {
    const activity = document.getElementById("activityLevel").value;
    const space = document.getElementById("livingSpace").value;
    const agePref = document.getElementById("petAgePref").value;
    const resultBox = document.getElementById("quizResultBox");

    let matchedPet = "Cooper";
    let reason = "Cooper (Golden Retriever) is gentle, adaptable, and loves playing fetch in a medium or large home.";

    if (agePref === "puppy" || (activity === "high" && space === "yard")) {
        matchedPet = "Max";
        reason = "Max (German Shepherd puppy) thrives on high energy, training games like hide-and-seek, and room to explore!";
    } else if (activity === "relaxed" || space === "apartment") {
        matchedPet = "Bella";
        reason = "Bella (French Bulldog) is ideal for apartment living and loves indoor tug-of-war sessions.";
    }

    resultBox.style.display = "block";
    resultBox.innerHTML = `
        <h3>Your Best Match is ${matchedPet}!</h3>
        <p>${reason}</p>
        <button type="button" onclick="selectPetForAdoption('${matchedPet}')">Adopt ${matchedPet} Now</button>
    `;
}

function calculateCareCost() {
    const pet = document.getElementById("calcPetSelect").value;
    const grooming = document.getElementById("includeGrooming").checked;
    const resultBox = document.getElementById("costResultBox");

    let foodCost = 0;
    if (pet === "Max") foodCost = 65;      // Large-breed puppy formula
    if (pet === "Bella") foodCost = 45;    // Grain-free small breed food
    if (pet === "Cooper") foodCost = 60;   // Salmon & brown rice kibble

    const total = foodCost + (grooming ? 35 : 0);

    resultBox.style.display = "block";
    resultBox.innerHTML = `
        <p><strong>Estimated Monthly Care for ${pet}: $${total}/month</strong></p>
        <p>Includes specialized diet ($${foodCost})${grooming ? " + Monthly Grooming & Toys ($35)" : ""}.</p>
    `;
}

// ==========================================
// 3. ADOPT PAGE: AUTO-FILL & FORM SUBMISSION
// ==========================================
function loadSelectedPetIntoForm() {
    const petSelect = document.getElementById("selectedPet");
    if (!petSelect) return;

    const savedPet = localStorage.getItem("selectedPetForAdoption");
    if (savedPet) {
        petSelect.value = savedPet;
    }
}

function submitApplication(event) {
    event.preventDefault();

    const pet = document.getElementById("selectedPet").value;
    const adopterName = document.getElementById("adopterName").value.trim();
    const email = document.getElementById("adopterEmail").value.trim();
    const phone = document.getElementById("adopterPhone").value.trim();
    const homeType = document.getElementById("homeType").value;

    // Save pet to adoptedPetsList in localStorage
    const adoptedPets = JSON.parse(localStorage.getItem("adoptedPetsList")) || [];
    if (!adoptedPets.includes(pet)) {
        adoptedPets.push(pet);
        localStorage.setItem("adoptedPetsList", JSON.stringify(adoptedPets));
    }

    const receipt = document.getElementById("confirmationReceipt");
    receipt.style.display = "block";
    receipt.innerHTML = `
        <h3>Thank You for Adopting, ${adopterName}!</h3>
        <p>Your adoption application for <strong>${pet}</strong> has been received.</p>
        <p><strong>Applicant Email:</strong> ${email} | <strong>Phone:</strong> ${phone}</p>
        <p><strong>Living Environment:</strong> ${homeType}</p>
        <p>Status on the Home Page has been updated to <em>Application Pending</em>.</p>
    `;

    document.getElementById("adoptionForm").reset();
}

// ==========================================
// 4. GALLERY PAGE: LIGHTBOX & LIKE COUNTER
// ==========================================
function openLightbox(imageSrc, captionText) {
    const modal = document.getElementById("lightboxModal");
    const modalImg = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxCaption");

    modal.style.display = "block";
    modalImg.src = imageSrc;
    caption.textContent = captionText;
}

function closeLightbox() {
    const modal = document.getElementById("lightboxModal");
    if (modal) modal.style.display = "none";
}

function likePet(petName) {
    const likesData = JSON.parse(localStorage.getItem("petLikes")) || {
        Max: 12,
        Bella: 18,
        Cooper: 24
    };

    likesData[petName] = (likesData[petName] || 0) + 1;
    localStorage.setItem("petLikes", JSON.stringify(likesData));

    const span = document.getElementById("likes-" + petName);
    if (span) span.textContent = likesData[petName];
}

function loadGalleryLikes() {
    const likesData = JSON.parse(localStorage.getItem("petLikes"));
    if (!likesData) return;

    ["Max", "Bella", "Cooper"].forEach(function (pet) {
        const span = document.getElementById("likes-" + pet);
        if (span && likesData[pet] !== undefined) {
            span.textContent = likesData[pet];
        }
    });
}

// ==========================================
// 5. ABOUT PAGE: FAQ ACCORDION & CONTACT FORM
// ==========================================
function toggleFaq(index) {
    const answers = document.querySelectorAll(".faq-answer");
    if (!answers[index]) return;

    const currentDisplay = answers[index].style.display;
    answers[index].style.display = (currentDisplay === "block") ? "none" : "block";
}

function submitContactMessage(event) {
    event.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const feedback = document.getElementById("contactFeedback");

    feedback.style.display = "block";
    feedback.innerHTML = `<p>Thanks, <strong>${name}</strong>! Your message has been sent to our shelter team. We will reply shortly.</p>`;
    document.getElementById("contactForm").reset();
}