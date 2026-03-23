const sections = document.querySelectorAll(".section");
const images = document.querySelectorAll(".bg");
const outer = document.querySelectorAll(".outer");
const inner = document.querySelectorAll(".inner");

let current = 0;
let next = 0;
let listening = true;

/* 초기 세팅 */
gsap.set(outer, { yPercent: 100 });
gsap.set(inner, { yPercent: -100 });
gsap.set(sections, { autoAlpha: 0 });

gsap.set(sections[0], { autoAlpha: 1 });
gsap.set([outer[0], inner[0]], { yPercent: 0 });

/* 리셋 */
function resetSection(index) {
  gsap.set([outer[index], inner[index]], { yPercent: 0 });
  gsap.set(images[index], { yPercent: 0 });
}

/* 내려가기 */
function slideIn() {
  listening = false;

  gsap.set(sections[next], { autoAlpha: 1, zIndex: 1 });
  gsap.set(sections[current], { zIndex: 0 });

  gsap.set(outer[next], { yPercent: 100 });
  gsap.set(inner[next], { yPercent: -100 });

  const tl = gsap.timeline({
    defaults: { duration: 1.2, ease: "power2.inOut" },
    onComplete: () => {
      gsap.set(sections[current], { autoAlpha: 0 });
      resetSection(current);
      current = next;
      listening = true;
    }
  });

  tl.to([outer[next], inner[next]], { yPercent: 0 }, 0)
    .from(images[next], { yPercent: 15 }, 0)
    .to(images[current], { yPercent: -15 }, 0);
}

/* 올라가기 */
function slideOut() {
  listening = false;

  gsap.set(sections[next], { autoAlpha: 1, zIndex: 0 });
  gsap.set(sections[current], { zIndex: 1 });

  gsap.set(outer[next], { yPercent: -100 });
  gsap.set(inner[next], { yPercent: 100 });

  const tl = gsap.timeline({
    defaults: { duration: 1.2, ease: "power2.inOut" },
    onComplete: () => {
      gsap.set(sections[current], { autoAlpha: 0 });
      resetSection(current);
      current = next;
      listening = true;
    }
  });

  tl.to(outer[current], { yPercent: 100 }, 0)
    .to(inner[current], { yPercent: -100 }, 0)
    .to(images[current], { yPercent: 15 }, 0)
    .to([outer[next], inner[next]], { yPercent: 0 }, 0);
}

/* 스크롤 */
window.addEventListener("wheel", (e) => {
  if (!listening) return;

  if (e.deltaY > 0 && current < sections.length - 1) {
    next = current + 1;
    slideIn();
  } else if (e.deltaY < 0 && current > 0) {
    next = current - 1;
    slideOut();
  }
});

/* 모달 */

const openBtns = document.querySelectorAll(".open-video");
const modal = document.querySelector(".video-modal");
const closeBtn = document.querySelector(".close-video");
const video = document.getElementById("mainVideo");

/* 열기 */
openBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    modal.classList.add("active");
    video.currentTime = 0;
    video.play();

    listening = false;
  });
});

/* 닫기 함수 */
function closeModal() {
  modal.classList.remove("active");
  video.pause();
  video.currentTime = 0;

  listening = true;
}

/* 버튼 닫기 */
closeBtn.addEventListener("click", closeModal);

/* 배경 클릭 닫기 */
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

/* ESC 닫기 */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

/* 터치로 스크롤 */
let startY = 0;
let endY = 0;

window.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
});

window.addEventListener("touchend", (e) => {
  if (!listening) return;

  endY = e.changedTouches[0].clientY;
  let diff = startY - endY;

  if (diff > 50 && current < sections.length - 1) {
    next = current + 1;
    slideIn();
  }

  if (diff < -50 && current > 0) {
    next = current - 1;
    slideOut();
  }
});