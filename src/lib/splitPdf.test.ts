/**
 * Unit tests — parsePageRange (dividir / intervalos 1-based).
 */

import { describe, expect, it } from 'vitest';
import { parsePageRange } from './splitPdf';

describe('parsePageRange', () => {
  it('aceita página isolada "1"', () => {
    expect(parsePageRange('1', 10)).toEqual([0]);
  });

  it('aceita intervalo "1-3" (0-based)', () => {
    expect(parsePageRange('1-3', 10)).toEqual([0, 1, 2]);
  });

  it('aceita combinação "1, 3-5"', () => {
    expect(parsePageRange('1, 3-5', 10)).toEqual([0, 2, 3, 4]);
  });

  it('aceita "1, 3-5, 8"', () => {
    expect(parsePageRange('1, 3-5, 8', 10)).toEqual([0, 2, 3, 4, 7]);
  });

  it('normaliza intervalo invertido 5-3 → 3-5', () => {
    expect(parsePageRange('5-3', 10)).toEqual([2, 3, 4]);
  });

  it('deduplica páginas repetidas', () => {
    expect(parsePageRange('1,1,2', 5)).toEqual([0, 1]);
  });

  it('rejeita string vazia', () => {
    expect(() => parsePageRange('   ', 5)).toThrow(/intervalo de páginas/i);
  });

  it('rejeita página fora do PDF', () => {
    expect(() => parsePageRange('11', 10)).toThrow(/não existe/i);
  });

  it('rejeita intervalo fora do PDF', () => {
    expect(() => parsePageRange('8-12', 10)).toThrow(/fora do PDF/i);
  });

  it('rejeita formato inválido', () => {
    expect(() => parsePageRange('abc', 5)).toThrow(/Formato inválido/i);
  });

  it('rejeita pageCount < 1', () => {
    expect(() => parsePageRange('1', 0)).toThrow(/não possui páginas/i);
  });
});
