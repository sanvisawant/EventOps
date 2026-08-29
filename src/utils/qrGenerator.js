/**
 * Pure JavaScript QR Code Matrix Generator.
 * Generates a valid 2D boolean matrix (Version 2/3) for QR encoding.
 */

// Error correction polynomials
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);

(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_EXP[i + 255] = x;
    GF256_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
})();

function gfMul(x, y) {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

function rsEncode(data, ecLen) {
  // Generator polynomial for ecLen
  const gen = new Uint8Array(ecLen + 1);
  gen[0] = 1;
  for (let i = 0; i < ecLen; i++) {
    const root = GF256_EXP[i];
    for (let j = i + 1; j > 0; j--) {
      gen[j] = gen[j] ^ gfMul(gen[j - 1], root);
    }
  }

  const res = new Uint8Array(ecLen);
  for (let i = 0; i < data.length; i++) {
    const coef = data[i] ^ res[0];
    for (let j = 0; j < ecLen - 1; j++) {
      res[j] = res[j + 1] ^ gfMul(gen[j + 1], coef);
    }
    res[ecLen - 1] = gfMul(gen[ecLen], coef);
  }
  return res;
}

/**
 * Generates QR Code matrix for a given string text.
 * Returns { size, modules: boolean[][] }
 */
export function generateQRMatrix(text) {
  const bytes = new TextEncoder().encode(text);
  const dataLen = bytes.length;

  // Version selection: Version 2 (25x25, max 32 bytes M) or Version 3 (29x29)
  const version = dataLen <= 26 ? 2 : 3;
  const size = 17 + version * 4; // V2: 25, V3: 29
  const ecLen = version === 2 ? 10 : 15;
  const maxDataBytes = version === 2 ? 34 : 44;

  // 1. Bit Stream Construction
  const bitBuf = [];

  function addBits(val, numBits) {
    for (let i = numBits - 1; i >= 0; i--) {
      bitBuf.push((val >> i) & 1);
    }
  }

  // Byte Mode Indicator (0100)
  addBits(4, 4);
  // Character Count (8 bits for Byte Mode in V1-9)
  addBits(dataLen, 8);
  // Data Bytes
  for (let i = 0; i < dataLen; i++) {
    addBits(bytes[i], 8);
  }

  // Terminator (4 bits or remaining)
  const capacityBits = maxDataBytes * 8;
  const termBits = Math.min(4, capacityBits - bitBuf.length);
  for (let i = 0; i < termBits; i++) bitBuf.push(0);

  // Bit padding to byte boundary
  while (bitBuf.length % 8 !== 0) bitBuf.push(0);

  // Pad bytes (0xEC, 0x11 alternating)
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bitBuf.length < capacityBits) {
    addBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bitBuf to data byte array
  const dataBytes = new Uint8Array(maxDataBytes);
  for (let i = 0; i < maxDataBytes; i++) {
    let b = 0;
    for (let bit = 0; bit < 8; bit++) {
      b = (b << 1) | bitBuf[i * 8 + bit];
    }
    dataBytes[i] = b;
  }

  // RS Error Correction Bytes
  const ecBytes = rsEncode(dataBytes, ecLen);

  // Full codeword stream
  const codewords = new Uint8Array(maxDataBytes + ecLen);
  codewords.set(dataBytes);
  codewords.set(ecBytes, maxDataBytes);

  // 2. Matrix Layout
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const isReserved = Array.from({ length: size }, () => Array(size).fill(false));

  function setModule(r, c, val, reserved = true) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      grid[r][c] = val;
      if (reserved) isReserved[r][c] = true;
    }
  }

  // Finder Patterns
  function drawFinder(r, c) {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;

        if (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) {
          const isBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
          const isCenter = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
          setModule(nr, nc, isBorder || isCenter, true);
        } else {
          setModule(nr, nc, false, true); // Separator
        }
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Alignment Pattern for V2 & V3
  if (version >= 2) {
    const alignPos = size - 7;
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const nr = alignPos + dr;
        const nc = alignPos + dc;
        if (isReserved[nr][nc]) continue;
        const isBorder = Math.abs(dr) === 2 || Math.abs(dc) === 2;
        const isCenter = dr === 0 && dc === 0;
        setModule(nr, nc, isBorder || isCenter, true);
      }
    }
  }

  // Timing Patterns
  for (let i = 8; i < size - 8; i++) {
    if (!isReserved[6][i]) setModule(6, i, i % 2 === 0, true);
    if (!isReserved[i][6]) setModule(i, 6, i % 2 === 0, true);
  }

  // Reserve Format Info Area
  for (let i = 0; i < 9; i++) {
    if (!isReserved[8][i]) setModule(8, i, false, true);
    if (!isReserved[i][8]) setModule(i, 8, false, true);
    if (!isReserved[8][size - 1 - i]) setModule(8, size - 1 - i, false, true);
    if (!isReserved[size - 1 - i][8]) setModule(size - 1 - i, 8, false, true);
  }
  setModule(size - 8, 8, true, true); // Dark module

  // 3. Place Data Bits (Zigzag Pattern)
  let bitsPlaced = 0;
  const totalBits = codewords.length * 8;

  let dir = -1; // -1 = up, +1 = down
  let r = size - 1;
  let c = size - 1;

  while (c > 0) {
    if (c === 6) c--; // Skip vertical timing column

    for (let step = 0; step < size; step++) {
      const row = dir === -1 ? r - step : r + step;
      for (let colOffset = 0; colOffset < 2; colOffset++) {
        const col = c - colOffset;
        if (!isReserved[row][col]) {
          let bit = 0;
          if (bitsPlaced < totalBits) {
            const byteIdx = Math.floor(bitsPlaced / 8);
            const bitIdx = 7 - (bitsPlaced % 8);
            bit = (codewords[byteIdx] >> bitIdx) & 1;
            bitsPlaced++;
          }
          grid[row][col] = bit === 1;
        }
      }
    }

    dir = -dir;
    r = dir === -1 ? size - 1 : 0;
    c -= 2;
  }

  // Format info for Mask 0 (Mask 000 with EC level L: 01)
  const formatInfo = 0x77c4; // Precomputed 15-bit format string for L-mask0
  for (let i = 0; i < 15; i++) {
    const bit = (formatInfo >> (14 - i)) & 1;
    // Map format bits around finders
    if (i < 6) grid[8][i] = bit === 1;
    else if (i < 8) grid[8][i + 1] = bit === 1;
    else if (i < 9) grid[8 - (14 - i)][8] = bit === 1;
    else grid[14 - i][8] = bit === 1;
  }

  return { size, modules: grid };
}
