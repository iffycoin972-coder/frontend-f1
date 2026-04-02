const qs = document.querySelectorAll(".faq-q");
const ans = document.querySelectorAll(".faq-a");

qs.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    const open = ans[i].style.display === "block";

    ans.forEach(a => a.style.display = "none");
    qs.forEach(q => q.querySelector("span").textContent = "+");

    if (!open) {
      ans[i].style.display = "block";
      btn.querySelector("span").textContent = "−";
    }
  });
});