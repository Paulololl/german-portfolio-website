document.addEventListener("DOMContentLoaded", () => {
  /* =============================
     Resume Modal
  ============================== */
  // const resumeModal = document.getElementById("resumeModal");
  // const openBtn = document.querySelector(".btn-resume");
  // const closeBtn = document.getElementById("closeModal");

  // if (openBtn && resumeModal && closeBtn) {
  //   openBtn.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     resumeModal.classList.remove(
  //       "opacity-0",
  //       "scale-95",
  //       "pointer-events-none",
  //     );
  //     resumeModal.classList.add("opacity-100", "scale-100");
  //   });

  //   closeBtn.addEventListener("click", () => closeResumeModal());

  //   resumeModal.addEventListener("click", (e) => {
  //     if (e.target === resumeModal) closeResumeModal();
  //   });
  // }

  // function closeResumeModal() {
  //   resumeModal.classList.add("opacity-0", "scale-95", "pointer-events-none");
  //   resumeModal.classList.remove("opacity-100", "scale-100");
  // }

  /* =============================
     Scroll to Projects
  ============================== */
  const btnProjects = document.getElementById("btnProjects");
  const projectsSection = document.getElementById("projects");

  if (btnProjects && projectsSection) {
    btnProjects.addEventListener("click", (e) => {
      e.preventDefault();
      projectsSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* =============================
     Reset scroll on reload
  ============================== */
  // window.scrollTo(0, 0);
  // if (window.location.hash) {
  //   history.replaceState(null, null, "index.html");
  // }

  /* =============================
   Carousel (manual + autoplay + drag/swipe + live drag)
============================== */
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");

    let index = 0;
    let intervalId;
    const delay = 4000;

    function updateSlide() {
      track.style.transition = "transform 0.5s ease";
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
      index = (index + 1) % slides.length;
      updateSlide();
    }

    function prevSlide() {
      index = (index - 1 + slides.length) % slides.length;
      updateSlide();
    }

    function startAutoSlide() {
      stopAutoSlide();
      intervalId = setInterval(nextSlide, delay);
    }

    function stopAutoSlide() {
      if (intervalId) clearInterval(intervalId);
    }

    nextBtn?.addEventListener("click", () => {
      nextSlide();
      startAutoSlide();
    });

    prevBtn?.addEventListener("click", () => {
      prevSlide();
      startAutoSlide();
    });

    /* =============================
     Drag + Swipe + Live Drag
  ============================= */
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let moved = false;
    const swipeThreshold = 50;

    function setTranslate(x) {
      track.style.transition = "none";
      track.style.transform = `translateX(${x}px)`;
    }

    function dragStart(e) {
      startX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
      prevTranslate = -index * carousel.offsetWidth;
      currentTranslate = prevTranslate;
      isDragging = true;
      moved = false;
      stopAutoSlide();
    }

    function dragMove(e) {
      if (!isDragging) return;
      const currentX = e.type.startsWith("touch")
        ? e.touches[0].clientX
        : e.clientX;
      const diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
      if (Math.abs(diff) > 5) moved = true;
      setTranslate(currentTranslate);
    }

    function dragEnd(e) {
      if (!isDragging) return;
      isDragging = false;

      const movedBy = currentTranslate - prevTranslate;

      if (movedBy < -swipeThreshold) nextSlide();
      else if (movedBy > swipeThreshold) prevSlide();
      else updateSlide();

      startAutoSlide();
    }

    // Touch events
    carousel.addEventListener("touchstart", dragStart, { passive: true });
    carousel.addEventListener("touchmove", dragMove, { passive: true });
    carousel.addEventListener("touchend", dragEnd);

    // Mouse events
    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragMove);
    carousel.addEventListener("mouseup", dragEnd);
    carousel.addEventListener("mouseleave", () => {
      if (isDragging) dragEnd(new MouseEvent("mouseup"));
    });

    // Only allow image modal open on true click (not drag/swipe)
    track.querySelectorAll("img").forEach((img) => {
      let clickStartTime = 0;

      img.addEventListener("mousedown", () => {
        clickStartTime = Date.now();
      });

      img.addEventListener("touchstart", () => {
        clickStartTime = Date.now();
      });

      img.addEventListener("click", (e) => {
        const clickDuration = Date.now() - clickStartTime;
        if (!moved && clickDuration < 200) {
          if (typeof openImageModal === "function") openImageModal(img.src);
        }
        e.preventDefault();
      });

      // Prevent default image dragging
      img.addEventListener("dragstart", (e) => e.preventDefault());
    });

    carousel.addEventListener("mouseenter", stopAutoSlide);
    carousel.addEventListener("mouseleave", startAutoSlide);

    updateSlide();
    startAutoSlide();
  });

  /* =============================
     Image Modal
  ============================== */
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-image");
  const modalClose = document.getElementById("modal-close");

  window.openImageModal = function (src) {
    modalImg.src = src;

    modal.classList.remove("opacity-0", "scale-95", "pointer-events-none");
    modal.classList.add("opacity-100", "scale-100");

    modalImg.classList.remove("scale-95");
    modalImg.classList.add("scale-100");
  };

  function closeImageModal() {
    modal.classList.add("opacity-0", "scale-95", "pointer-events-none");
    modal.classList.remove("opacity-100", "scale-100");

    modalImg.classList.add("scale-95");
    modalImg.classList.remove("scale-100");
  }

  modalClose?.addEventListener("click", closeImageModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeImageModal();
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  window.copyEmail = function () {
    const email = "Paulbryangerman@gmail.com";
    const button = event.currentTarget;
    const textSpan = button.querySelector(".email-text");

    if (button.dataset.copied === "true") return;

    navigator.clipboard.writeText(email).then(() => {
      const originalText = textSpan.textContent;
      button.dataset.copied = "true";

      // Slide left + fade out
      textSpan.style.transform = "translateX(-8px)";
      textSpan.style.opacity = "0";

      setTimeout(() => {
        textSpan.textContent = "Email copied to clipboard!";
        textSpan.style.transform = "translateX(0)";
        textSpan.style.opacity = "1";
      }, 200);

      // Revert after 3s
      setTimeout(() => {
        textSpan.style.transform = "translateX(-8px)";
        textSpan.style.opacity = "0";

        setTimeout(() => {
          textSpan.textContent = originalText;
          textSpan.style.transform = "translateX(0)";
          textSpan.style.opacity = "1";
          button.dataset.copied = "false";
        }, 200);
      }, 3000);
    });
  };

  /* =============================
     Keyword Card Modal
  ============================== */
  const keywordModal = document.getElementById("keyword-modal");
  const keywordModalClose = document.getElementById(
    "keyword-modal-close",
  );
  const keywordButtons = document.querySelectorAll(".keyword-btn");
  const keywordCards = document.querySelectorAll(".keyword-card");

  function openKeywordModal(keyword) {
    keywordCards.forEach((card) => {
      if (card.dataset.keywordCard === keyword) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });

    keywordModal.classList.remove(
      "opacity-0",
      "scale-95",
      "pointer-events-none",
    );

    keywordModal.classList.add("opacity-100", "scale-100");
  }

  function closeKeywordModal() {
    keywordModal.classList.add(
      "opacity-0",
      "scale-95",
      "pointer-events-none",
    );

    keywordModal.classList.remove("opacity-100", "scale-100");
  }

  keywordButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const keyword = button.dataset.keyword;
      openKeywordModal(keyword);
    });
  });

  keywordModalClose?.addEventListener("click", closeKeywordModal);

  keywordModal?.addEventListener("click", (e) => {
    if (e.target === keywordModal) {
      closeKeywordModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeKeywordModal();
    }
  });
});