export const durationCss = {
  type: 'value',
  filter: (token) => token.$type === 'duration',
  transform(token) {
    const duration = token.$value;

    if (
      duration === null ||
      typeof duration !== 'object' ||
      Array.isArray(duration) ||
      !Number.isFinite(duration.value) ||
      (duration.unit !== 'ms' && duration.unit !== 's')
    ) {
      throw new Error(
        `Duración CSS inválida en "${token.path.join('.')}": se requiere un valor numérico finito y unidad ms o s.`,
      );
    }

    return `${duration.value}${duration.unit}`;
  },
};
