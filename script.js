document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     DECISIÓN SECCIÓN 7
  ========================= */
  const decisionSection = document.getElementById("decision");
  const btnOfrendar = document.getElementById("btnOfrendar");
  const btnQuedarsela = document.getElementById("btnQuedarsela");
  const finalOfrenda = document.getElementById("finalOfrenda");
  const finalQuedarsela = document.getElementById("finalQuedarsela");
  const decisionOverlay = document.querySelector(".decision-overlay");

  let decisionLocked = false;
  let decisionMade = false;

  function lockScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.overflow = "";
  }

  function goToFinal(targetSection) {
    if (!targetSection) return;

    decisionMade = true;
    decisionLocked = false;

    if (decisionOverlay) {
      decisionOverlay.style.display = "none";
    }

    if (finalOfrenda) {
      finalOfrenda.style.display = "none";
    }

    if (finalQuedarsela) {
      finalQuedarsela.style.display = "none";
    }

    targetSection.style.display = "block";

    unlockScroll();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }

  const decisionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !decisionMade) {
          decisionLocked = true;
          lockScroll();
        }
      });
    },
    {
      threshold: 0.7
    }
  );

  if (decisionSection) {
    decisionObserver.observe(decisionSection);
  }

  if (btnOfrendar) {
    btnOfrendar.addEventListener("click", () => {
      goToFinal(finalQuedarsela);
    });
  }

  if (btnQuedarsela) {
    btnQuedarsela.addEventListener("click", () => {
      goToFinal(finalOfrenda);
    });
  }

  window.addEventListener(
    "wheel",
    (e) => {
      if (decisionLocked && !decisionMade) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (decisionLocked && !decisionMade) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  /* =========================
     AUDIO POR SECCIÓN
  ========================= */
  const musicBtn = document.getElementById("music-btn");
  const music = document.getElementById("music");
  const sections = document.querySelectorAll(".pagina-titulo, .section");

  let soundEnabled = false;
  let currentAudio = "";

  function getCurrentVisibleSection() {
    return [...sections].find((section) => {
      const rect = section.getBoundingClientRect();
      return (
        rect.top < window.innerHeight * 0.6 &&
        rect.bottom > window.innerHeight * 0.4
      );
    });
  }

  function changeAudioForSection(section) {
    if (!section || !music) return;

    const newAudio = section.dataset.audio;
    if (!newAudio) return;
    if (newAudio === currentAudio) return;

    currentAudio = newAudio;
    music.src = newAudio;
    music.load();

    if (soundEnabled) {
      music.play().catch((error) => {
        console.log("No se pudo reproducir el audio:", error);
      });
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;

      if (soundEnabled) {
        musicBtn.classList.add("playing");

        const visibleSection = getCurrentVisibleSection();
        if (visibleSection) {
          changeAudioForSection(visibleSection);
        }

        music.play().catch((error) => {
          console.log("No se pudo activar el audio:", error);
        });
      } else {
        musicBtn.classList.remove("playing");
        music.pause();
      }
    });
  }

  const audioObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          changeAudioForSection(entry.target);
        }
      });
    },
    {
      threshold: 0.6
    }
  );

  sections.forEach((section) => {
    audioObserver.observe(section);
  });
});
