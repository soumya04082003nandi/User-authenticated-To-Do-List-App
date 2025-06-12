const generateSummaryBtn= document.querySelector("#generate-summary-btn");
const copySummaryBtn= document.querySelector("#copy_summary_btn");
const summaryHistoryBtn= document.querySelector("#summary_history_btn");
const summaryHistorySection=document.querySelector("#summary_history_section")


//adding the generating effect
if (generateSummaryBtn) {
    generateSummaryBtn.addEventListener('click', () => {
        generateSummaryBtn.innerText = "Generating....";
        generateSummaryBtn.classList.add("cursor-not-allowed");
    });
}

//adding the copy summary effect
if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', () => {
        copySummaryBtn.innerText = "Summary Copied ✅";
    });
}

//adding display and hide feature on show summary history btn
if (summaryHistoryBtn && summaryHistorySection) {
    summaryHistoryBtn.addEventListener('click', () => {
        const isVisible = !summaryHistorySection.classList.contains("hidden");

        if (!isVisible) {
            summaryHistoryBtn.innerText = "📜 Hide Summary History";
            summaryHistorySection.classList.remove("hidden");
            summaryHistorySection.scrollIntoView({ behavior: 'smooth' });
        } else {
            summaryHistoryBtn.innerText = "📜 View Past Summary History";
            summaryHistorySection.classList.add("hidden");
        }
    });
}

