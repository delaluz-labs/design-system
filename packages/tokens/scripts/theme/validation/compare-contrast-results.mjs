export function compareContrastResults(name, standardResult, highResult) {
  if (!highResult) {
    throw new Error(
      `No se encontró el resultado de contraste "${name}" para el theme high contrast.`,
    );
  }

  if (highResult.ratio < standardResult.ratio) {
    throw new Error(
      [
        `High contrast empeora "${name}".`,
        `Standard=${standardResult.ratio.toFixed(2)}.`,
        `High=${highResult.ratio.toFixed(2)}.`,
      ].join(' '),
    );
  }
}
