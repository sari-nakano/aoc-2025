import { Point } from "./points.ts";
import { Rectangle } from "./rectangles.ts";

export class CompressionMap {
  toCompressedColumnMap: Map<number, number> = new Map();
  fromCompressedColumnMap: Map<number, number> = new Map();
  toCompressedRowMap: Map<number, number> = new Map();
  fromCompressedRowMap: Map<number, number> = new Map();

  storeColumn(uncompressed: number, compressed: number) {
    this.toCompressedColumnMap.set(uncompressed, compressed);
    this.fromCompressedColumnMap.set(compressed, uncompressed);
  }

  storeRow(uncompressed: number, compressed: number) {
    this.toCompressedRowMap.set(uncompressed, compressed);
    this.fromCompressedRowMap.set(compressed, uncompressed);
  }

  compressPoint(p: Point) {
    const compressedColumn = this.toCompressedColumnMap.get(p.column);
    if (compressedColumn === undefined) {
      throw new Error(`No compressed value for column ${p.column}`);
    }

    const compressedRow = this.toCompressedRowMap.get(p.row);
    if (compressedRow === undefined) {
      throw new Error(`No compressed value for row ${p.row}`);
    }

    return { column: compressedColumn, row: compressedRow };
  }

  uncompressPoint(p: Point) {
    const uncompressedColumn = this.fromCompressedColumnMap.get(p.column);
    if (uncompressedColumn === undefined) {
      throw new Error(`No uncompressed value for column ${p.column}`);
    }

    const uncompressedRow = this.fromCompressedRowMap.get(p.row);
    if (uncompressedRow === undefined) {
      throw new Error(`No uncompressed value for row ${p.row}`);
    }

    return { column: uncompressedColumn, row: uncompressedRow };
  }
}

export function compressPoints(points: Point[]): [Point[], CompressionMap] {
  const compressionMap = new CompressionMap();

  const allColumns = [...new Set(points.map((p) => p.column))].toSorted((
    a,
    b,
  ) => a - b);
  for (const [ix, column] of allColumns.entries()) {
    compressionMap.storeColumn(column, ix);
  }

  const allRows = [...new Set(points.map((p) => p.row))].toSorted((a, b) =>
    a - b
  );
  for (const [ix, row] of allRows.entries()) {
    compressionMap.storeRow(row, ix);
  }

  const compressedPoints = points.map((p) => compressionMap.compressPoint(p));
  return [compressedPoints, compressionMap];
}

export function compressRectangle(
  compressionMap: CompressionMap,
  rectangle: Rectangle,
): Rectangle {
  return new Rectangle(
    compressionMap.compressPoint(rectangle.point1),
    compressionMap.compressPoint(rectangle.point2),
  );
}

export function uncompressRectangle(
  compressionMap: CompressionMap,
  rectangle: Rectangle,
) {
  return new Rectangle(
    compressionMap.uncompressPoint(rectangle.point1),
    compressionMap.uncompressPoint(rectangle.point2),
  );
}
