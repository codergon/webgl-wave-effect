function guard(lowerBoundary, upperBoundary, value) {
  return Math.max(lowerBoundary, Math.min(upperBoundary, value));
}

function numberToHex(value) {
  const hex = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function hexToRgb(hex) {
  const hexValue = hex.replace("#", "");
  const r = parseInt(hexValue.substr(0, 2), 16);
  const g = parseInt(hexValue.substr(2, 2), 16);
  const b = parseInt(hexValue.substr(4, 2), 16);
  return { r, g, b };
}

function getLuminance(color) {
  if (color === "transparent") return 0;
  const rgbColor = hexToRgb(color);

  const [r, g, b] = Object.keys(rgbColor).map(key => {
    const channel = rgbColor[key] / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return parseFloat((0.2126 * r + 0.7152 * g + 0.0722 * b).toFixed(3));
}

// Function to calculate the contrast ratio between two colors
export default function getContrast(color1, color2) {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  return parseFloat(
    (luminance1 > luminance2
      ? (luminance1 + 0.05) / (luminance2 + 0.05)
      : (luminance2 + 0.05) / (luminance1 + 0.05)
    ).toFixed(2)
  );
}

// Function to convert rgb color to hex format
export function rgbToHex(r, g, b) {
  const red = guard(0, 255, r);
  const green = guard(0, 255, g);
  const blue = guard(0, 255, b);
  return `#${numberToHex(red)}${numberToHex(green)}${numberToHex(blue)}`;
}

// Function to convert hex color to rgb format
export function invertColor(color) {
  if (color === "transparent") return color;

  if (color.substr(0, 1) !== "#" || (color.length !== 4 && color.length !== 7))
    return undefined;

  // expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  if (color.length === 4) {
    color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }

  // parse color string to rgb
  const value = hexToRgb(color);

  // Invert rgb values
  const invertedColor = toColorString({
    r: 255 - value.r,
    g: 255 - value.g,
    b: 255 - value.b,
  });

  return rgbToHex(invertedColor.r, invertedColor.g, invertedColor.b);
}
