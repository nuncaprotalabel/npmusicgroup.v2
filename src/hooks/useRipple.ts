"use client";

import { useCallback } from "react";

export function useRipple() {
  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const existing = button.querySelector(".ripple-effect");
    if (existing) existing.remove();

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple-effect");

    button.appendChild(circle);

    circle.addEventListener("animationend", () => circle.remove());
  }, []);

  return { createRipple };
}
