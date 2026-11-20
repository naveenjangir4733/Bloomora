/**
 * Unsplash photo ids used by the demo catalogue. Every id was checked to resolve
 * and to roughly match the product it illustrates.
 */
const PHOTO_IDS = {
  bouquetDark: '1487530811176-3780de880c2d',
  bouquetKraft: '1567696153798-9111f9cd3d0d',
  tulipVase: '1561181286-d3fee7d55364',
  flowerHeart: '1526047932273-341f2a7631f9',
  tulipField: '1468327768560-75b778cbb551',
  rainbowRoses: '1508610048659-a06b669e3321',
  sunflowers: '1455659817273-f96807779a8a',
  sunflowerSingle: '1597848212624-a19eb35e2651',
  daisies: '1560717789-0ac7c58ac90a',
  daisySingle: '1606041008023-472dfb5e530f',
  redRose: '1496062031456-07b8f162a322',
  roseVase: '1518895949257-7621c3c786d7',
  roseField: '1519378058457-4c29a0a2efac',
  pinkTulip: '1520763185298-1b434c919102',
  pinkGerbera: '1471899236350-e3016bf1e69e',
  pinkDahlia: '1507290439931-a861b5a38200',
  tableLampGlow: '1517991104123-1d56a6e81ed9',
  deskLampNight: '1543198126-a8ad8e47fb22',
  greyLamp: '1507473885765-e6ed057f782c',
  floorLamp: '1494438639946-1ebd1d20bf85',
  pendantTeal: '1513506003901-1e6a229e2d15',
  goldPendants: '1540932239986-30128078f3c5',
  wickerBag: '1590874103328-eac38a683ce7',
  tealBag: '1594223274512-ad4803739b7c',
  toteBag: '1544816155-12df9643f363',
  galleryWall: '1513519245088-0e12902e5a38',
  livingRoom: '1513694203232-719a280e022f',
  cozyCorner: '1550226891-ef816aed4a98',
  sofaPampas: '1578500494198-246f612d3b3d',
  eucalyptus: '1533038590840-1cde6e668a91',
  penHolder: '1456735190827-d1262f71b8a3',
  blossomVases: '1490312278390-ab64016e0aa9',
  cactusPot: '1459411552884-841db9b3cc2a',
  succulentPot: '1485955900006-10f4d324d411',
  goldCharms: '1617038220319-276d3cfab638',
  pendantNecklace: '1599643478518-a784e5dc4c8f',
  bracelet: '1611591437281-460bfbe1220a',
  earrings: '1535632066927-ab7c9ab60908',
  jewelryPile: '1606760227091-3dd870d97f1d',
  kraftGift: '1513201099705-a9746e1e201f',
  pinkGift: '1549465220-1a8b9238cd48',
  goldBows: '1607344645866-009c320b63e0',
  floralPainting: '1579783902614-a3fb3927b6a5',
} as const;

export type PhotoKey = keyof typeof PHOTO_IDS;

export const photo = (key: PhotoKey, width = 900): string =>
  `https://images.unsplash.com/photo-${PHOTO_IDS[key]}?auto=format&fit=crop&w=${width}&q=80`;
