export enum NodeIndex {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
  FOURTH = 'fourth',
  FIFTH = 'fifth',
  SIXTH = 'sixth',
  SEVENTH = 'seventh',
  EIGHTH = 'eighth',
  NINTH = 'ninth',
  TENTH = 'tenth',
  ELEVENTH = 'eleventh',
  TWELFTH = 'twelfth',
  THIRTEENTH = 'thirteenth',
  FOURTEENTH = 'fourteenth',
  FIFTEENTH = 'fifteenth',
  SIXTEENTH = 'sixteenth'
}

export const DIRECT_MAPPING: {
  [key in NodeIndex.THIRD | NodeIndex.FIFTH | NodeIndex.SEVENTH | NodeIndex.NINTH | NodeIndex.ELEVENTH | NodeIndex.THIRTEENTH]: NodeIndex
} = {
  [NodeIndex.THIRD]: NodeIndex.FOURTH,
  [NodeIndex.FIFTH]: NodeIndex.SIXTH,
  [NodeIndex.SEVENTH]: NodeIndex.EIGHTH,
  [NodeIndex.NINTH]: NodeIndex.TENTH,
  [NodeIndex.ELEVENTH]: NodeIndex.TWELFTH,
  [NodeIndex.THIRTEENTH]: NodeIndex.FOURTEENTH
};
