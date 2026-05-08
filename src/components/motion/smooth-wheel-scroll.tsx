"use client";

import { useEffect } from "react";

const scrollableOverflow = new Set(["auto", "scroll", "overlay"]);

function normalizeWheelDelta(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 16;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }

  return event.deltaY;
}

function canScrollElement(element: HTMLElement, deltaY: number) {
  const overflowY = window.getComputedStyle(element).overflowY;

  if (!scrollableOverflow.has(overflowY)) {
    return false;
  }

  if (element.scrollHeight <= element.clientHeight + 1) {
    return false;
  }

  if (deltaY > 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
  }

  return element.scrollTop > 1;
}

function shouldUseNativeScroll(target: EventTarget | null, deltaY: number) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  for (let element: HTMLElement | null = target; element; element = element.parentElement) {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement
    ) {
      return true;
    }

    if (element.dataset.nativeScroll === "true" || canScrollElement(element, deltaY)) {
      return true;
    }

    if (element === document.body) {
      return false;
    }
  }

  return false;
}

function getMaxScrollY() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function clampScrollY(value: number) {
  return Math.min(getMaxScrollY(), Math.max(0, value));
}

export function SmoothWheelScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    if (reduceMotion.matches || !finePointer.matches) {
      return;
    }

    let targetY = window.scrollY;
    let animationFrame: number | null = null;
    let isAnimating = false;

    function stopAnimation() {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      isAnimating = false;
    }

    function animate() {
      const currentY = window.scrollY;
      const distance = targetY - currentY;

      if (Math.abs(distance) < 0.6) {
        window.scrollTo({ behavior: "instant", top: targetY });
        stopAnimation();
        return;
      }

      window.scrollTo({ behavior: "instant", top: currentY + distance * 0.16 });
      animationFrame = window.requestAnimationFrame(animate);
    }

    function onWheel(event: WheelEvent) {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ) {
        return;
      }

      const deltaY = normalizeWheelDelta(event);

      if (Math.abs(deltaY) < 6 || shouldUseNativeScroll(event.target, deltaY)) {
        return;
      }

      const maxScrollY = getMaxScrollY();

      if (maxScrollY <= 0) {
        return;
      }

      const currentY = window.scrollY;

      if ((currentY <= 0 && deltaY < 0) || (currentY >= maxScrollY && deltaY > 0)) {
        return;
      }

      event.preventDefault();
      targetY = clampScrollY(targetY + deltaY);

      if (!isAnimating) {
        isAnimating = true;
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    function onNativeScroll() {
      if (!isAnimating) {
        targetY = window.scrollY;
      }
    }

    function onResize() {
      targetY = clampScrollY(targetY);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stopAnimation();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
