/**
 * Lavender Women's Salon - Interactive Experience
 * Realistic Hairdresser Scissors Snip & Lengthwise Cut Animation
 */

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".link-item");

  // Web Audio Context for realistic scissor snip sound effect
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  // Synthesize a crisp salon shears snip sound
  function playSalonSnip(timeOffset = 0) {
    if (!audioCtx) return;
    try {
      const startTime = audioCtx.currentTime + timeOffset;
      const duration = 0.045;
      const sampleRate = audioCtx.sampleRate;
      const buffer = audioCtx.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
      const output = buffer.getChannelData(0);

      // Metallic friction noise curve
      for (let i = 0; i < buffer.length; i++) {
        const decay = Math.exp(-i / (sampleRate * 0.012));
        output[i] = (Math.random() * 2 - 1) * decay;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter to isolate the metallic "snip" resonance of salon scissors
      const filter = audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(3800, startTime);
      filter.Q.setValueAtTime(4.2, startTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      whiteNoise.start(startTime);
    } catch (_) {}
  }

  // Play a sequence of snips as the scissors cuts across the sentence
  function playCuttingSnipSequence() {
    initAudio();
    const snipIntervals = [0, 0.11, 0.22, 0.33, 0.44];
    snipIntervals.forEach((time) => {
      playSalonSnip(time);
    });
  }

  // Spawn sparkling snippets along the cut path
  function spawnCutSparks(link, startX, distance, totalDuration) {
    const numSparks = 6;
    for (let i = 0; i < numSparks; i++) {
      const delay = (i / numSparks) * totalDuration;
      setTimeout(() => {
        if (!link.classList.contains("is-cutting")) return;
        const spark = document.createElement("span");
        spark.className = "cut-sparkle";
        const currentProgress = (i + 0.5) / numSparks;
        const xPos = startX + (distance * currentProgress);
        const yOffset = (Math.random() * 12 - 6);
        spark.style.left = `${xPos}px`;
        spark.style.top = `calc(50% + ${yOffset}px)`;
        link.appendChild(spark);

        setTimeout(() => spark.remove(), 460);
      }, delay);
    }
  }

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetUrl = link.getAttribute("href");
      if (!targetUrl || targetUrl === "#") return;

      // Prevent default immediate navigation to allow the cut animation to play
      e.preventDefault();

      // Avoid double triggers if already cutting
      if (link.classList.contains("is-cutting")) return;

      const scissors = link.querySelector(".action-scissors-wrap");
      const iconBox = link.querySelector(".link-icon-box");

      // Calculate travel distance from scissors (left) to icon (right)
      let travelDistance = 260; // fallback
      let startLeft = 20;

      if (scissors && iconBox) {
        const sRect = scissors.getBoundingClientRect();
        const iRect = iconBox.getBoundingClientRect();
        const lRect = link.getBoundingClientRect();
        startLeft = sRect.left - lRect.left + (sRect.width / 2);
        // Distance in screen coordinates moving from left to right
        travelDistance = Math.max(160, Math.round((iRect.left + (iRect.width * 0.3)) - sRect.left));
      }

      link.style.setProperty("--cut-travel-x", `${travelDistance}px`);
      link.classList.add("is-cutting");

      // Mobile haptics: snip vibration pulse
      if ("vibrate" in navigator) {
        try {
          navigator.vibrate([15, 35, 15, 35, 15, 35, 20]);
        } catch (_) {}
      }

      // Audio snips & visual sparks
      playCuttingSnipSequence();
      spawnCutSparks(link, startLeft, travelDistance, 520);

      // Navigate smoothly once the scissors completes its cut
      setTimeout(() => {
        const targetAttr = link.getAttribute("target");
        if (targetAttr === "_blank") {
          const win = window.open(targetUrl, "_blank");
          if (!win || win.closed || typeof win.closed === "undefined") {
            window.location.href = targetUrl;
          }
        } else {
          window.location.href = targetUrl;
        }
      }, 570);

      // Clean reset after animation so card is fresh if user returns
      setTimeout(() => {
        link.classList.remove("is-cutting");
        link.querySelectorAll(".cut-sparkle").forEach((s) => s.remove());
      }, 1250);
    });
  });
});
