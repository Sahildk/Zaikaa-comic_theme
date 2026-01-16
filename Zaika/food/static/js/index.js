// Bubble Button
document.querySelectorAll(".bubble-button").forEach((button) => {
    button.addEventListener("mousemove", function (e) {
      let x = e.pageX - this.offsetLeft;
      let y = e.pageY - this.offsetTop;
  
      let bubble = document.createElement("span");
      bubble.classList.add("bubble");
      this.appendChild(bubble);
  
      bubble.style.left = x + "px";
      bubble.style.top = y + "px";
  
      let size = Math.random() * 20;
      bubble.style.width = 2 + size + "px";
      bubble.style.height = 2 + size + "px";
  
      setTimeout(() => {
        bubble.remove();
      }, 1000);
    });
  });
  