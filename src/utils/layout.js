export function getLayout(count) {
  switch (count) {
    case 1:
      return {
        template: { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' },
        slots: [{ rotated: false }]
      };
    case 2:
      return {
        template: { gridTemplateColumns: '1fr', gridTemplateRows: '1fr 1fr' },
        slots: [{ rotated: true }, { rotated: false }]
      };
    case 3:
      return {
        template: {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gridTemplateAreas: `'a a' 'b c'`
        },
        slots: [
          { rotated: true, area: 'a' },
          { rotated: false, area: 'b' },
          { rotated: false, area: 'c' }
        ]
      };
    case 4:
      return {
        template: { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' },
        slots: [
          { rotated: true }, { rotated: true },
          { rotated: false }, { rotated: false }
        ]
      };
    case 5:
      return {
        template: {
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: '1fr 1fr',
          gridTemplateAreas: `'a a a b b b' 'c c d d e e'`
        },
        slots: [
          { rotated: true, area: 'a' },
          { rotated: true, area: 'b' },
          { rotated: false, area: 'c' },
          { rotated: false, area: 'd' },
          { rotated: false, area: 'e' }
        ]
      };
    case 6:
      return {
        template: { gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '1fr 1fr' },
        slots: [
          { rotated: true }, { rotated: true }, { rotated: true },
          { rotated: false }, { rotated: false }, { rotated: false }
        ]
      };
    default:
      return null;
  }
}
