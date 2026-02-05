import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  cssInjectionMode: "ui",
  allFrames: false,

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "dom-filter",
      position: "inline",
      anchor: "body",
      append: "first",

      onMount(container) {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        const wrapper = document.createElement("div");
        container.appendChild(wrapper);

        const FilterApp = () => {
          const [filterValue, setFilterValue] = useState("");
          const [removedAds, setRemovedAds] = useState(false);
          const [channelsSpotlight, setChannelsSpotlight] = useState(false);

          const [position, setPosition] = useState({
            top: 24,
            left: (window.innerWidth - 380) / 2,
          });

          const [isDragging, setIsDragging] = useState(false);
          const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

          const containerRef = useRef<HTMLDivElement>(null);

          function isYouTubeDarkMode(): boolean {
            const html = document.documentElement;

            if (html.hasAttribute("data-theme")) {
              const theme = html.getAttribute("data-theme");
              if (theme === "dark") return true;
              if (theme === "light") return false;
            }

            const bg = getComputedStyle(document.body).backgroundColor;
            const rgb = bg.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const brightness =
                (Number(rgb[0]) * 299 +
                  Number(rgb[1]) * 587 +
                  Number(rgb[2]) * 114) /
                1000;
              return brightness < 100;
            }

            return window.matchMedia("(prefers-color-scheme: dark)").matches;
          }

          const [isDarkMode, setIsDarkMode] = useState(isYouTubeDarkMode());

          useEffect(() => {
            const observer = new MutationObserver(() => {
              setIsDarkMode(isYouTubeDarkMode());
            });

            observer.observe(document.documentElement, {
              attributes: true,
              attributeFilter: ["data-theme", "class", "style"],
            });

            return () => observer.disconnect();
          }, []);

          const handleMouseDown = (e: React.MouseEvent) => {
            if (isMobile) return;

            if ((e.target as HTMLElement).closest("input, button, svg")) return;

            const rect = containerRef.current!.getBoundingClientRect();

            setIsDragging(true);
            setDragOffset({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });

            e.preventDefault();
          };

          useEffect(() => {
            if (isMobile) return;

            const handleMouseMove = (e: MouseEvent) => {
              if (!isDragging) return;

              const newLeft = e.clientX - dragOffset.x;
              const newTop = e.clientY - dragOffset.y;

              const maxLeft =
                window.innerWidth - (containerRef.current?.offsetWidth || 380);
              const maxTop =
                window.innerHeight - (containerRef.current?.offsetHeight || 60);

              const clampedLeft = Math.max(0, Math.min(maxLeft, newLeft));
              const clampedTop = Math.max(10, Math.min(maxTop, newTop));

              setPosition({
                left: clampedLeft,
                top: clampedTop,
              });
            };

            const handleMouseUp = () => {
              setIsDragging(false);
            };

            if (isDragging) {
              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }

            return () => {
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
            };
          }, [isDragging, dragOffset]);

          const toggleChannelNames = () => {
            setChannelsSpotlight((prev) => {
              const shouldHighlight = !prev;

              applyChannelHighlight(shouldHighlight);

              if (shouldHighlight) setFilterValue("");

              return shouldHighlight;
            });
          };

          const applyChannelHighlight = (enable: boolean) => {
            const allowedSelectors = [
              "ytd-channel-name",
              "[href*='/@']",
              "yt-formatted-string[href*='/@']",
              "a.yt-simple-endpoint[href*='/@']",
            ];

            document.querySelectorAll("body *").forEach((el: Element) => {
              const htmlEl = el as HTMLElement;

              if (htmlEl.closest('[data-wxt-ui="dom-filter"]')) return;
              if (!htmlEl.textContent?.trim()) return;

              const isChannelRelated = allowedSelectors.some(
                (sel) =>
                  htmlEl.matches(sel) ||
                  htmlEl.closest(sel) ||
                  htmlEl.querySelector(sel)
              );

              if (enable) {
                htmlEl.style.opacity = isChannelRelated ? "1" : "0.18";
                htmlEl.style.transition = "opacity 0.3s ease";
              } else {
                htmlEl.style.opacity = "";
                htmlEl.style.transition = "";
              }
            });
          };

          const removeAllAds = () => {
            setRemovedAds(true);
            const adSelectors = [
              "ytd-ad-slot-renderer",
              "ytd-in-feed-ad-layout-renderer",
              "ytd-promoted-sparkles-web-renderer",
              "ytd-promoted-video-renderer",
              "ytd-ad-div",
              ".ytd-companion-slot-renderer",
              ".ytd-action-companion-ad-renderer",
              "ytd-display-ad-renderer",
              "ytd-banner-promo-renderer",
              ".ytp-ad-module",
              ".ytp-ad-image-overlay",
              ".ytp-ad-player-overlay",
              "yt-mealbar-promo-renderer",
              "[ad-slot]",
              ".sparkles-light-cta",
              "ytd-rich-item-renderer:has(ytd-ad-slot-renderer)",
              "ytd-item-section-renderer:has(ytd-ad-slot-renderer)",
            ];

            const selector = adSelectors.join(", ");

            document.querySelectorAll(selector).forEach((ad) => {
              const el = ad as HTMLElement;
              el.remove();
            });
          };

          useEffect(() => {
            setChannelsSpotlight(false);
            const lower = filterValue.toLowerCase().trim();

            document.querySelectorAll("body *").forEach((el: Element) => {
              const htmlEl = el as HTMLElement;
              if (htmlEl.closest('[data-wxt-ui="dom-filter"]')) return;
              if (!htmlEl.textContent?.trim()) return;

              const text = htmlEl.textContent!.toLowerCase();
              htmlEl.style.opacity =
                lower === "" || text.includes(lower) ? "1" : "0.1";
              htmlEl.style.transition = "opacity 0.3s ease";
            });
          }, [filterValue]);

          const AdIcon = () => (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDarkMode ? "#fff" : "#000"}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11.636 6A13 13 0 0 0 19.4 3.2 1 1 0 0 1 21 4v11.344" />
              <path d="M14.378 14.357A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1" />
              <path d="m2 2 20 20" />
              <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
              <path d="M8 8v6" />
            </svg>
          );

          const ChannelIcon = () => (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDarkMode ? "#fff" : "#000"}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m17 2-5 5-5-5" />
              <rect width="20" height="15" x="2" y="7" rx="2" />
            </svg>
          );

          const Buttons = () => (
            <>
              {filterValue ? (
                <button
                  onClick={() => setFilterValue("")}
                  title="Clear spotlight"
                >
                  Clear
                </button>
              ) : null}
              <div className="flex gap">
                <button
                  title="Spotlight channel names"
                  className="channel-icon-button"
                  onClick={toggleChannelNames}
                >
                  <ChannelIcon />
                </button>
                <button
                  disabled={removedAds}
                  title="Remove ads"
                  className="ad-icon-button"
                  onClick={removeAllAds}
                >
                  <AdIcon />
                </button>
              </div>
            </>
          );

          const ScanIcon = () => (
            <svg
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <circle cx="12" cy="12" r="3" />
              <path d="m16 16-1.9-1.9" />
            </svg>
          );

          const Styles = () => (
            <style
              dangerouslySetInnerHTML={{
                __html: `
.container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  padding: 6px 10px;
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  width: min(380px, 85vw);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  z-index: 999999;
  top: ${isMobile ? 10 : position.top}px;
  left: ${isMobile ? "50%" : `${position.left}px`};
  transform: ${isMobile ? "translateX(-50%)" : "none"};
  cursor: ${isMobile ? "default" : isDragging ? "grabbing" : "grab"};
  user-select: none;
  transition: ${
    isDragging ? "none" : "all 0.3s cubic-bezier(0.2, 0.8, 0.4, 1)"
  };
}

.flex {
  display: flex;
  align-items: center;
}

input {
  padding: 0 8px;
  border: none;
  outline: none;
  background: none;
  color: ${isDarkMode ? "#fff" : "#6e6e6eff"};
  width: 70%;
  fontSize: 16px;
}

input::placeholder {
  color: ${isDarkMode ? "#aaa" : "#6e6e6eff"};
  opacity: 1;
}

button {
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
  color: ${isDarkMode ? "#fff" : "#ccc"};
}

.gap {
  gap: 8px;
}

.ad-icon-button {
  border-radius: 100%;
  background: ${
    removedAds
      ? isDarkMode
        ? "rgba(255, 255, 255, 0.1) !important;"
        : "rgba(0, 0, 0, 0.1) !important;"
      : ""
  }
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: ${
    removedAds
      ? isDarkMode
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.1)"
      : ""
  };
  cursor: ${removedAds ? "not-allowed" : ""};
  transition: all .3s;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.channel-icon-button {
  border-radius: 100%;
  background: ${
    channelsSpotlight
      ? isDarkMode
        ? "rgba(255, 255, 255, 0.1) !important;"
        : "rgba(0, 0, 0, 0.1) !important;"
      : ""
  }
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: ${
    channelsSpotlight
      ? isDarkMode
        ? "1px solid rgba(255, 255, 255, 0.1);"
        : "1px solid rgba(0, 0, 0, 0.1);"
      : ""
  };
  cursor: ${channelsSpotlight ? "crosshair" : ""};
  transition: all .3s;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg {
  pointer-events: none;
  flex-shrink: 0;
}
`,
              }}
            />
          );

          return (
            <>
              <Styles />
              <div
                className="container"
                ref={containerRef}
                onMouseDown={handleMouseDown}
              >
                <div className="flex">
                  <ScanIcon />
                  <input
                    type="text"
                    placeholder="Spotlight scan"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    autoFocus
                    className="input"
                  />
                  <Buttons />
                </div>
              </div>
            </>
          );
        };

        const root = ReactDOM.createRoot(wrapper);
        root.render(<FilterApp />);
        return root;
      },

      onRemove(root) {
        document.querySelectorAll("body *").forEach((el) => {
          (el as HTMLElement).style.opacity = "";
          (el as HTMLElement).style.transition = "";
        });
        root?.unmount();
      },
    });

    ctx.onInvalidated(() => ui.remove());

    ctx.addEventListener(window, "wxt:locationchange", () => {
      ui.remove();
      ui.mount();
    });

    ui.mount();
  },
});
