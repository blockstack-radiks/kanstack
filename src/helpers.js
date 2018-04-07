export default {
  boardColor: (board, opacity) => {
    if (!board || !board.color) {
      return null
    }
    return board.color.replace('1.0', opacity)
  },
  colors: [
    'rgba(0, 168, 255, 1.0)',
    'rgba(156, 136, 255, 1.0)',
    'rgba(251, 197, 49, 1.0)',
    'rgba(76, 209, 55, 1.0)',
    'rgba(72, 126, 176, 1.0)',
    'rgba(232, 65, 24, 1.0)',
    'rgba(245, 246, 250, 1.0)',
    'rgba(127, 143, 166, 1.0)',
    'rgba(64, 115, 158, 1.0)',
    'rgba(53, 59, 72, 1.0)'
  ],
  russianPalette: [
    'rgba(243, 166, 131,1.0)',
    'rgba(247, 215, 148,1.0)',
    'rgba(119, 139, 235,1.0)',
    'rgba(231, 127, 103,1.0)',
    'rgba(207, 106, 135,1.0)',
    'rgba(120, 111, 166,1.0)',
    'rgba(248, 165, 194,1.0)',
    'rgba(99, 205, 218,1.0)',
    'rgba(234, 134, 133,1.0)',
    'rgba(89, 98, 117,1.0)'
  ]
}
