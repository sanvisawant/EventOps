import React, { useMemo } from 'react';
import { generateQRMatrix } from '../../utils/qrGenerator';

export function QRCode({ value, size = 180, className = '', label = 'Event QR Access Pass' }) {
  const { qrSize, pathData } = useMemo(() => {
    try {
      const { size: matrixSize, modules } = generateQRMatrix(value || 'EVENTOPS:PASS-EMPTY');
      let path = '';

      for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
          if (modules[r][c]) {
            path += `M${c},${r}h1v1h-1z `;
          }
        }
      }

      return { qrSize: matrixSize, pathData: path };
    } catch {
      return { qrSize: 25, pathData: '' };
    }
  }, [value]);

  return (
    <div
      className={`inline-block bg-white p-3 rounded-lg border border-gray-200 shadow-sm ${className}`}
      role="img"
      aria-label={`${label} for ${value}`}
    >
      <svg
        viewBox={`0 0 ${qrSize} ${qrSize}`}
        width={size}
        height={size}
        className="w-full h-full text-black block"
        shapeRendering="crispEdges"
      >
        <rect width={qrSize} height={qrSize} fill="#ffffff" />
        <path d={pathData} fill="#000000" />
      </svg>
    </div>
  );
}
