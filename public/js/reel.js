let isFetching = false;
let page = 1;
let noMoreReels = false;

async function fetchReels() {
    if (isFetching || noMoreReels) return;

    isFetching = true;
    page++;

    try {
        const response = await fetch(`/reels?page=${page}`, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
        });

        if (!response.ok) throw new Error("Failed to fetch reels");

        const data = await response.json();

        if (data.length === 0) {
            noMoreReels = true;
            const endMessage = document.getElementById("end-message");
            if (endMessage) endMessage.style.display = "flex";
            return;
        }

        setupObserver(); // Reset observer for the new last reel

    } catch (err) {
        console.error("Error fetching reels:", err);
    } finally {
        isFetching = false;
    }
}

function setupObserver() {
    const reels = document.querySelectorAll(".reel");
    if (reels.length === 0 || noMoreReels) return;

    const lastReel = reels[reels.length - 1];
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) fetchReels();
    });

    observer.observe(lastReel);
}

function toggleLike(button) {
    const icon = button.querySelector("i");
    icon.classList.toggle("fa-regular");
    icon.classList.toggle("fa-solid");

    icon.style.color = icon.classList.contains("fa-solid")
        ? "#fd4949"
        : "#f5f0f0";
}

// Initial load
fetchReels();

function sharePost() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => showCopiedMessage("🔗 Link copied to clipboard!"))
        .catch(err => {
            console.error("Clipboard error:", err);
            alert("Failed to copy link 😢");
        });
}


//----------for profile button-------------------

function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  }
  
  // Optional: Click outside to close
  document.addEventListener('click', function (event) {
    const isClickInside = document.querySelector('.custom-profile-menu').contains(event.target);
    if (!isClickInside) {
        document.getElementById('profileDropdown').style.display = 'none';
    }
  });
  

