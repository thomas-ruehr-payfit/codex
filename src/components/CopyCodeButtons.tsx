"use client";

import { useEffect } from "react";

export default function CopyCodeButtons() {
  useEffect(() => {
    const pres = document.querySelectorAll<HTMLPreElement>("pre");

    pres.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      const btn = document.createElement("button");
      btn.textContent = "Copy";
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "Copy code to clipboard");

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.innerText ?? pre.innerText;
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = "Copied!";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "Copy";
            btn.classList.remove("copied");
          }, 2000);
        } catch {
          btn.textContent = "Failed";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2000);
        }
      });

      pre.appendChild(btn);
    });
  }, []);

  return null;
}
