const PREFIXES = ["", "-moz-", "-o-", "-webkit-", "-ms-"];
const TRANSLATIONS = [
  "0%:-10%,10%",
  "10%:-25%,0%",
  "20%:-30%,10%",
  "30%:-30%,30%",
  "40%:-20%,20%",
  "50%:-15%,10%",
  "60%:-20%,20%",
  "70%:-5%,20%",
  "80%:-25%,5%",
  "90%:-30%,25%",
  "100%:-10%,10%"
];

const DEFAULT_OPTIONS = {
  animate: true,
  patternWidth: 100,
  patternHeight: 100,
  grainOpacity: 0.09,
  grainDensity: 1,
  grainWidth: 1,
  grainHeight: 1,
  grainChaos: 0.5,
  grainSpeed: 10
};

const KEYFRAME_STYLE_ID = "grained-keyframes";
let idCounter = 0;
const PATTERN_CACHE = new Map();

function getPatternCacheKey(options) {
  return [
    options.patternWidth,
    options.patternHeight,
    options.grainOpacity,
    options.grainDensity,
    options.grainWidth,
    options.grainHeight
  ].join("|");
}

function ensureElementId(element) {
  if (element.id && element.id.trim().length > 0) {
    return { id: element.id, created: false };
  }
  const generatedId = `grained-${++idCounter}`;
  element.id = generatedId;
  return { id: generatedId, created: true };
}

function ensureRelativePosition(element) {
  const computed = window.getComputedStyle(element);
  if (computed.position === "static") {
    const previous = element.style.position;
    element.style.position = "relative";
    return () => {
      element.style.position = previous;
    };
  }
  return () => {};
}

function generatePattern(options, doc) {
  const cacheKey = getPatternCacheKey(options);
  if (PATTERN_CACHE.has(cacheKey)) {
    return PATTERN_CACHE.get(cacheKey);
  }

  const canvas = doc.createElement("canvas");
  canvas.width = options.patternWidth;
  canvas.height = options.patternHeight;
  const ctx = canvas.getContext("2d");

  for (let x = 0; x < options.patternWidth; x += options.grainDensity) {
    for (let y = 0; y < options.patternHeight; y += options.grainDensity) {
      const value = (Math.random() * 256) | 0;
      ctx.fillStyle = `rgba(${value}, ${value}, ${value}, ${options.grainOpacity})`;
      ctx.fillRect(x, y, options.grainWidth, options.grainHeight);
    }
  }
  const dataUrl = canvas.toDataURL("image/png");
  PATTERN_CACHE.set(cacheKey, dataUrl);
  return dataUrl;
}

function buildKeyframes(doc) {
  if (doc.getElementById(KEYFRAME_STYLE_ID)) {
    return;
  }

  let css = "";
  PREFIXES.forEach((prefix) => {
    const atRule = prefix ? `@${prefix}keyframes grained` : "@keyframes grained";
    css += `${atRule}{`;
    TRANSLATIONS.forEach((entry) => {
      const [percent, transform] = entry.split(":");
      const transformProp = prefix ? `${prefix}transform` : "transform";
      css += `${percent}{${transformProp}:translate(${transform});}`;
    });
    css += "}";
  });

  const style = doc.createElement("style");
  style.type = "text/css";
  style.id = KEYFRAME_STYLE_ID;
  style.appendChild(doc.createTextNode(css));
  doc.head.appendChild(style);
}

export function applyGrain(target, options = {}) {
  const element = typeof target === "string"
    ? document.getElementById(target.replace(/^#/, ""))
    : target;

  if (!element) {
    console.error("applyGrain: target element not found", target);
    return () => {};
  }

  if (typeof window === "undefined") {
    return () => {};
  }

  const doc = element.ownerDocument || document;
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  buildKeyframes(doc);
  const pattern = generatePattern(finalOptions, doc);

  const { id, created } = ensureElementId(element);
  const restorePosition = ensureRelativePosition(element);

  const overlayId = `grained-overlay-${id}`;
  const existingOverlay = element.querySelector(`[data-grained-overlay-id="${overlayId}"]`);
  if (existingOverlay && existingOverlay.parentNode) {
    existingOverlay.parentNode.removeChild(existingOverlay);
  }

  const overlay = doc.createElement("div");
  overlay.setAttribute("data-grained-overlay-id", overlayId);
  overlay.style.position = "absolute";
  overlay.style.inset = "0";
  overlay.style.pointerEvents = "none";
  overlay.style.overflow = "hidden";
  overlay.style.contain = "paint";
  overlay.style.zIndex = finalOptions.zIndex != null ? String(finalOptions.zIndex) : "0";

  const noise = doc.createElement("div");
  noise.style.position = "absolute";
  noise.style.top = "-170%";
  noise.style.left = "-170%";
  noise.style.width = "440%";
  noise.style.height = "440%";
  noise.style.backgroundImage = `url(${pattern})`;
  noise.style.backgroundRepeat = "repeat";
  noise.style.backgroundSize = `${finalOptions.patternWidth}px ${finalOptions.patternHeight}px`;
  noise.style.willChange = "transform";
  noise.style.transform = "translate3d(0,0,0)";
  noise.style.backfaceVisibility = "hidden";
  noise.style.opacity = "1";

  if (finalOptions.animate) {
    noise.style.animationName = "grained";
    noise.style.animationDuration = `${Math.max(finalOptions.grainChaos, 0.0001)}s`;
    noise.style.animationIterationCount = "infinite";
    noise.style.animationTimingFunction = `steps(${Math.max(finalOptions.grainSpeed, 1)}, end)`;
  }

  overlay.appendChild(noise);
  element.appendChild(overlay);

  return () => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    restorePosition();
    if (created) {
      element.removeAttribute("id");
    }
  };
}
