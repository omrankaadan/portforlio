/**
 * Central color system for the 3D workspace.
 *
 * Art direction: warm, natural, premium interior/product photography.
 * Roughly 70% natural neutrals, 20% muted secondary colors, 10% accents.
 * Every visible surface, light and on-screen UI color resolves from here.
 */

/* eslint-disable no-multi-spaces */

const hex = (v) => v;

export const P = {
  /** Warm neutrals — the dominant 70%. */
  neutral: {
    white: 0xefe9de, // warm off-white
    paper: 0xf4efe4, // cream paper
    sand: 0xddd3c1, // soft beige
    taupe: 0xb8ae9e, // warm gray
    stone: 0x8d8578, // deeper warm gray
    graphite: 0x4a4740,
    charcoal: 0x33312c,
    black: 0x211f1c, // matte black (warm, never blue-black)
    blackSoft: 0x2c2a26,
    keycap: 0xe2dcd0, // off-white keycaps
    keycapAlt: 0xb9b1a3, // warm gray accent keycaps
  },

  /** Natural wood. */
  wood: {
    walnut: 0x6d4c36,
    walnutDeep: 0x573a29,
    oak: 0xb08e63,
  },

  /** Metals: graphite and natural silver with one muted brass note. */
  metal: {
    alu: 0xb4b0a8, // natural silver
    aluDark: 0x8a867f,
    steel: 0x3b3935,
    steelLight: 0x55524c,
    brass: 0xac8a58, // muted gold
  },

  /** Device shells: matte black, space gray, graphite. */
  device: {
    shellDark: 0x26251f,
    shellGray: 0xa9a49b,
    screenOff: 0x131311,
    trackpad: 0xc8c2b7,
    keyDark: 0x3a3833,
  },

  /** Muted secondary colors — used selectively on props and paper goods. */
  secondary: {
    sage: 0x7d8f74,
    olive: 0x6b6a4c,
    forest: 0x3f5344,
    dustyBlue: 0x6d8090,
    navy: 0x2b3948,
    terracotta: 0xa06a4e,
    clay: 0xb0704f,
  },

  /** Sparingly used accents that guide attention. */
  accent: {
    amber: 0xd9a45c, // burnt orange
    ember: 0xc2703a,
    gold: 0xc6a267,
    indicator: 0xe0b878, // restrained warm status light
  },

  /** Paper goods and books: cream, kraft, green, navy, terracotta. */
  goods: {
    kraft: 0xd8c6a6,
    bookForest: 0x3f5344,
    bookNavy: 0x2f3d4e,
    bookClay: 0x7d4b36,
    bookOlive: 0x64654a,
    bookBrown: 0x56483d,
    penInk: 0x2a2724,
  },

  /** Ceramic and liquid. */
  ceramic: {
    cream: 0xece4d6,
    espresso: 0x2b1a11,
  },

  /** Plant. */
  organic: {
    leaf: 0x5d7355,
    leafDeep: 0x43583f,
    soil: 0x3a2f26,
  },

  /** Desk lamp practicals. */
  lamp: {
    shade: 0x8e7a5c,
    glow: 0xffd6a8,
  },

  /** The seated developer and chair: natural fabric, no costume colors. */
  person: {
    skin: 0xa98263,
    hair: 0x2b2420,
    linen: 0xa2988a, // oatmeal linen shirt
    trouser: 0x6f6a60,
    chair: 0x7e7669,
    chairDark: 0x5f584e,
  },

  /** Room shell. */
  room: {
    wall: 0xd5cec1, // warm plaster
    wallShade: 0xbdb5a7,
    wallSide: 0xc7bfae,
    trim: 0x9d9488,
    floor: 0x7a6a58, // warm oak floor
    frame: 0x4b4437,
    frameInk: 0x9a9184,
    linen: 0xcfc7b6, // blinds
    glass: 0xdbe2e0, // soft daylight through the window
    daylight: 0xf3f0e6, // framed print
  },

  /** Soft late-afternoon light with gentle, warm fill. */
  light: {
    hemiSky: 0xffe8c8,
    hemiGround: 0x655345,
    key: 0xffdcae,
    window: 0xffedcf,
    screen: 0xffe5c2,
    screenActive: 0xffdab0,
    rim: 0xffe8cf,
    lamp: 0xffc982,
    shadow: 0x302319,
  },

  /** Renderer-level colors. */
  env: {
    bg: 0x75604b,
    fog: 0x75604b,
    fogNear: 2.2,
    fogFar: 10,
    environmentIntensity: 0.9,
    exposure: 1.12,
  },

  /** Procedural environment map: a warm interior, not a neon box. */
  probe: {
    shell: 0x82705b,
    ceiling: 0x635543,
    windowWarm: 0xffe4bd,
    windowSky: 0xffedcf,
    windowBase: 0xc7a782,
    lampWarm: 0xffd49b,
    furniture: 0x76604a,
    ground: 0x79644e,
  },

  /** On-screen product UI: off-white, charcoal, navy, muted green/blue, terracotta. */
  screen: {
    page: 0xf7f4ee,
    pageAlt: 0xefeae0,
    card: 0xfdfbf7,
    ink: 0x23262b,
    inkSoft: 0x54504a,
    muted: 0x8a8378,
    line: 0xded7ca,
    navy: 0x1d2833,
    navySoft: 0x33465c,
    sage: 0x6f8a72,
    sageDeep: 0x3f5344,
    blue: 0x6b8399,
    blueSoft: 0x9fb2bf,
    clay: 0xb0704f,
    claySoft: 0xd8b39a,
    cream: 0xf2ece0,
    warmWhite: 0xfaf7f0,
  },

  /** Dark creative-tool surfaces (editor, terminal, chat): warm charcoal, never blue-black. */
  dark: {
    bg: 0x1b1a17,
    bgAlt: 0x141310,
    panel: 0x23211d,
    panel2: 0x2b2823,
    line: 0x35322c,
    lineSoft: 0x2a2823,
    text: 0xe6e0d4,
    dim: 0x9c9384,
    faint: 0x6f675b,
    green: 0x87a97f, // muted green syntax
    blue: 0x83a0b5, // soft blue syntax
    sand: 0xd6b98c, // warm sand syntax
    clay: 0xc08358, // terracotta syntax
    paper: 0x3a362f,
  },

  /** Notebook surface: real paper, drawn with a pencil. */
  note: {
    paper: 0xf6f1e6,
    paperEdge: 0xe6dfcd,
    ink: 0x3a382f,
    inkSoft: 0x6f6a5e,
    rule: 0xd9d2c0,
    accent: 0xa8603f,
    wash: 0xd8e2e0,
    washWarm: 0xe6dcc8,
  },
};

/** Flattened object palette used by the batched world builders. */
export const C = Object.assign(
  {},
  P.neutral,
  {
    wood: P.wood.walnut,
    woodEdge: P.wood.walnutDeep,
    oak: P.wood.oak,
    leaf: P.organic.leaf,
    leafDark: P.organic.leafDeep,
    soil: P.organic.soil,
    pot: P.secondary.terracotta,
    fabric: P.person.chair,
    fabricDark: P.person.chairDark,
    skin: P.person.skin,
    cloth: P.person.linen,
    clothDark: P.person.trouser,
    hair: P.person.hair,
    mug: P.ceramic.cream,
    coffee: P.ceramic.espresso,
    pen: P.goods.penInk,
    cable: P.neutral.black,
    lampShade: P.lamp.shade,
    lampGlow: P.lamp.glow,
    status: P.accent.indicator,
  }
);

/** CSS strings for the canvas screen surfaces. */
export const S = {
  page: css(P.screen.page),
  pageAlt: css(P.screen.pageAlt),
  card: css(P.screen.card),
  ink: css(P.screen.ink),
  inkSoft: css(P.screen.inkSoft),
  muted: css(P.screen.muted),
  line: css(P.screen.line),
  navy: css(P.screen.navy),
  navySoft: css(P.screen.navySoft),
  sage: css(P.screen.sage),
  sageDeep: css(P.screen.sageDeep),
  blue: css(P.screen.blue),
  blueSoft: css(P.screen.blueSoft),
  clay: css(P.screen.clay),
  claySoft: css(P.screen.claySoft),
  cream: css(P.screen.cream),
  warmWhite: css(P.screen.warmWhite),

  dark: css(P.dark.bg),
  darkAlt: css(P.dark.bgAlt),
  panel: css(P.dark.panel),
  panel2: css(P.dark.panel2),
  line2: css(P.dark.line),
  lineSoft: css(P.dark.lineSoft),
  text: css(P.dark.text),
  dim: css(P.dark.dim),
  faint: css(P.dark.faint),
  green: css(P.dark.green),
  blue2: css(P.dark.blue),
  sand: css(P.dark.sand),
  clay2: css(P.dark.clay),
  paperDark: css(P.dark.paper),

  notePaper: css(P.note.paper),
  noteEdge: css(P.note.paperEdge),
  noteInk: css(P.note.ink),
  noteInkSoft: css(P.note.inkSoft),
  noteRule: css(P.note.rule),
  noteAccent: css(P.note.accent),
  noteWash: css(P.note.wash),
  noteWashWarm: css(P.note.washWarm),
};

function css(v) {
  return `#${v.toString(16).padStart(6, "0")}`;
}

/**
 * Subtle per-phase grade: daylight for design, balanced in development,
 * and warm on the production-ready product.
 */
export const STORY_TINT = {
  setup: { color: [1.0, 0.99, 0.96], amount: 0.045 },
  idea: { color: [1.0, 0.98, 0.93], amount: 0.065 },
  requirements: { color: [0.99, 0.99, 0.96], amount: 0.055 },
  breath: { color: [1.0, 0.99, 0.95], amount: 0.035 },
  plan: { color: [1.0, 0.99, 0.96], amount: 0.055 },
  build: { color: [0.98, 1.0, 0.96], amount: 0.05 },
  live: { color: [1.0, 0.98, 0.93], amount: 0.075 },
  responsive: { color: [1.0, 0.97, 0.92], amount: 0.07 },
  ship: { color: [1.0, 0.96, 0.88], amount: 0.09 },
};

export default P;
export { hex };
