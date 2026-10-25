export interface GalaxyItem {
  id: string;
  name: string;
  messier?: string;
  ngc?: string;
  type: 'Spiral' | 'Barred Spiral' | 'Elliptical' | 'Irregular' | 'Lenticular';
  hubbleClass: string;
  constellation: string;
  distanceMly: number; // Million light-years
  diameterKly: number; // Thousand light-years
  estimatedStars: string;
  massSolarMasses: string;
  description: string;
  keyFeatures: string[];
  imageUrl: string;
  isArtisticImpression?: boolean;
}

export interface CelestialBody {
  id: string;
  name: string;
  type: 'Star' | 'Terrestrial Planet' | 'Gas Giant' | 'Ice Giant' | 'Dwarf Planet' | 'Major Moon';
  diameterKm: number;
  massKg: string;
  gravityMs2: number;
  orbitalDistanceAU: number; // Semi-major axis in AU
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  moonsCount: number;
  hasRings: boolean;
  meanTempC: number;
  atmosphere: string[];
  color: string;
  description: string;
  surfaceFeatures: string;
  scientificDiscovery: string;
}

export interface BlackHoleItem {
  id: string;
  name: string;
  type: 'Supermassive' | 'Stellar-mass' | 'Intermediate-mass' | 'Primordial (Hypothetical)';
  constellation: string;
  distanceLy: string;
  massSolarMasses: string;
  schwarzschildRadiusKm: string;
  hostGalaxy: string;
  description: string;
  keyPhenomena: string[];
  isDirectObservation: boolean;
  observationalCredit: string;
  imageUrl: string;
}

export interface ExoplanetItem {
  id: string;
  name: string;
  hostStar: string;
  constellation: string;
  distanceLy: number;
  planetType: 'Super-Earth' | 'Terrestrial' | 'Sub-Neptune' | 'Gas Giant' | 'Hot Jupiter';
  discoveryMethod: 'Transit' | 'Radial Velocity' | 'Direct Imaging' | 'Microlensing';
  discoveryYear: number;
  massEarths: number;
  radiusEarths: number;
  orbitalPeriodDays: number;
  inHabitableZone: boolean;
  equilibriumTempK: number;
  description: string;
  habitabilityNote: string;
}

export interface SpaceMissionItem {
  id: string;
  name: string;
  agency: 'NASA' | 'ESA' | 'JAXA' | 'ISRO' | 'International Consortium';
  target: string;
  launchDate: string;
  status: 'Active / Operational' | 'En Route' | 'Completed' | 'In Development';
  missionType: 'Space Observatory' | 'Planetary Rover' | 'Orbiter / Probe' | 'Lunar Exploration' | 'Deep Space Flyby';
  keyObjectives: string[];
  scientificAchievements: string;
  imageUrl: string;
}

export interface SpaceGalleryImage {
  id: string;
  title: string;
  category: 'Galaxies' | 'Nebulae' | 'Planets' | 'Spacecraft & Telescopes' | 'Deep Field';
  credit: string;
  date: string;
  description: string;
  imageUrl: string;
  isArtisticImpression: boolean;
  dimensions: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  questionBn?: string;
  options: string[];
  optionsBn?: string[];
  correctIndex: number;
  explanation: string;
  explanationBn?: string;
}

// 1. GALAXIES
export const galaxiesData: GalaxyItem[] = [
  {
    id: 'milky-way',
    name: 'Milky Way Galaxy',
    type: 'Barred Spiral',
    hubbleClass: 'SBbc',
    constellation: 'Sagittarius (Galactic Center)',
    distanceMly: 0,
    diameterKly: 105.7,
    estimatedStars: '100 - 400 Billion',
    massSolarMasses: '1.5 × 10¹²',
    description: 'Our home galaxy containing our Solar System, possessing four major spiral arms and a supermassive black hole at its core designated Sagittarius A*.',
    keyFeatures: ['Central bar structure', 'Sagittarius A* black hole (4.3 million M☉)', 'Four major spiral arms (Perseus, Scutum-Centaurus, Sagittarius, Norma)', 'Surrounded by dark matter halo'],
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    isArtisticImpression: false,
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy',
    messier: 'M31',
    ngc: 'NGC 224',
    type: 'Spiral',
    hubbleClass: 'SA(s)b',
    constellation: 'Andromeda',
    distanceMly: 2.537,
    diameterKly: 220,
    estimatedStars: '~1 Trillion',
    massSolarMasses: '1.2 × 10¹²',
    description: 'The closest major spiral galaxy to the Milky Way, approaching us at approximately 110 km/s. Set to undergo a gravitational merger with the Milky Way in approximately 4.5 billion years.',
    keyFeatures: ['Over 1 trillion stars', 'Double galactic nucleus (supermassive black hole)', 'Approaching at 110 km/s', 'Visible to naked eye under dark skies'],
    imageUrl: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1200&q=80',
    isArtisticImpression: false,
  },
  {
    id: 'whirlpool',
    name: 'Whirlpool Galaxy',
    messier: 'M51a',
    ngc: 'NGC 5194',
    type: 'Spiral',
    hubbleClass: 'SA(s)bc pec',
    constellation: 'Canes Venatici',
    distanceMly: 31,
    diameterKly: 76,
    estimatedStars: '~100 Billion',
    massSolarMasses: '1.6 × 10¹¹',
    description: 'A classic "grand-design" spiral galaxy interacting gravitationally with its companion galaxy NGC 5195, causing intense density waves and starburst activity in its arms.',
    keyFeatures: ['Archetypal grand design spiral', 'Gravitational tidal bridge with NGC 5195', 'Prominent H II star-forming regions', 'Extensive dust lanes'],
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
    isArtisticImpression: false,
  },
  {
    id: 'sombrero',
    name: 'Sombrero Galaxy',
    messier: 'M104',
    ngc: 'NGC 4594',
    type: 'Lenticular',
    hubbleClass: 'SA(s)a',
    constellation: 'Virgo',
    distanceMly: 31.1,
    diameterKly: 49,
    estimatedStars: '~800 Billion',
    massSolarMasses: '8.0 × 10¹¹',
    description: 'Famous for its brilliant white bulbous core encircled by a thick, dark dust lane in its outer disk, resembling a broad-brimmed sombrero hat.',
    keyFeatures: ['Massive central bulge', 'Nearly edge-on dust disk', 'Supermassive black hole (~1 billion M☉)', 'Rich system of globular clusters (~2,000)'],
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    isArtisticImpression: false,
  },
  {
    id: 'triangulum',
    name: 'Triangulum Galaxy',
    messier: 'M33',
    ngc: 'NGC 598',
    type: 'Spiral',
    hubbleClass: 'SA(s)cd',
    constellation: 'Triangulum',
    distanceMly: 2.73,
    diameterKly: 60,
    estimatedStars: '~40 Billion',
    massSolarMasses: '5.0 × 10¹⁰',
    description: 'The third-largest member of our Local Group of galaxies. Hosts NGC 604, one of the largest known star-forming H II nebulae in the universe.',
    keyFeatures: ['Houses NGC 604 giant nebula', 'No central supermassive black hole detected yet', 'High star formation rate relative to its mass', 'Gravitationally bound to Andromeda'],
    imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1200&q=80',
    isArtisticImpression: false,
  },
  {
    id: 'cartwheel',
    name: 'Cartwheel Galaxy',
    type: 'Lenticular',
    hubbleClass: 'Ring Galaxy',
    constellation: 'Sculptor',
    distanceMly: 500,
    diameterKly: 150,
    estimatedStars: '~100 Billion',
    massSolarMasses: '3.0 × 10¹¹',
    description: 'A spectacular ring galaxy created by a high-speed collision with a smaller companion galaxy, producing a cosmic shockwave expanding outwards like ripples in a pond.',
    keyFeatures: ['Collisional ring morphology', 'Outer ring of intense starburst activity', 'Filamentary gas spokes connecting core and outer ring', 'Recent Webb NIRCam/MIRI imaging'],
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    isArtisticImpression: false,
  },
];

// 2. CELESTIAL BODIES (SOLAR SYSTEM)
export const celestialBodiesData: CelestialBody[] = [
  {
    id: 'sun',
    name: 'The Sun',
    type: 'Star',
    diameterKm: 1392700,
    massKg: '1.989 × 10³⁰',
    gravityMs2: 274.0,
    orbitalDistanceAU: 0,
    orbitalPeriodDays: 0,
    rotationPeriodHours: 609.12, // 25.4 Earth days at equator
    moonsCount: 0,
    hasRings: false,
    meanTempC: 5500, // Photosphere
    atmosphere: ['73% Hydrogen', '25% Helium', 'Oxygen', 'Carbon', 'Neon', 'Iron'],
    color: '#FDB813',
    description: 'The yellow dwarf star (spectral class G2V) at the center of our Solar System, comprising 99.86% of the total system mass.',
    surfaceFeatures: 'Photosphere granulations, sunspots, solar flares, and coronal mass ejections.',
    scientificDiscovery: 'Nuclear fusion engine converting 600 million metric tons of hydrogen into helium every second in its 15 million °C core.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'Terrestrial Planet',
    diameterKm: 4879,
    massKg: '3.301 × 10²³',
    gravityMs2: 3.7,
    orbitalDistanceAU: 0.387,
    orbitalPeriodDays: 87.97,
    rotationPeriodHours: 1407.6, // 58.6 Earth days
    moonsCount: 0,
    hasRings: false,
    meanTempC: 167, // -180°C at night to 430°C at day
    atmosphere: ['Trace Exosphere: Oxygen', 'Sodium', 'Hydrogen', 'Helium', 'Potassium'],
    color: '#9E9E9E',
    description: 'The smallest and innermost planet in the Solar System, with extreme temperature swings and a heavily cratered surface resembling our Moon.',
    surfaceFeatures: 'Caloris Basin impact crater (1,550 km), lobate scarps indicating planetary shrinking, and permanently shadowed polar ice traps.',
    scientificDiscovery: 'MESSENGER spacecraft verified water ice in deep polar craters shielded from solar radiation.',
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'Terrestrial Planet',
    diameterKm: 12104,
    massKg: '4.867 × 10²⁴',
    gravityMs2: 8.87,
    orbitalDistanceAU: 0.723,
    orbitalPeriodDays: 224.7,
    rotationPeriodHours: -5832.5, // Retrograde rotation
    moonsCount: 0,
    hasRings: false,
    meanTempC: 464,
    atmosphere: ['96.5% Carbon Dioxide', '3.5% Nitrogen', 'Sulfuric Acid Clouds'],
    color: '#E0A96D',
    description: 'Earth’s "evil twin" with a runaway greenhouse effect causing crushing surface pressures (92 bar) and molten-lead surface temperatures.',
    surfaceFeatures: 'Thousands of volcanoes, Maxwell Montes mountain range (11 km high), and vast basaltic lava plains.',
    scientificDiscovery: 'Super-rotating atmosphere circles the planet in just 4 Earth days, while the solid planet takes 243 days to rotate.',
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'Terrestrial Planet',
    diameterKm: 12742,
    massKg: '5.972 × 10²⁴',
    gravityMs2: 9.807,
    orbitalDistanceAU: 1.0,
    orbitalPeriodDays: 365.256,
    rotationPeriodHours: 23.934,
    moonsCount: 1,
    hasRings: false,
    meanTempC: 15,
    atmosphere: ['78.08% Nitrogen', '20.95% Oxygen', '0.93% Argon', '0.04% Carbon Dioxide'],
    color: '#2B82C9',
    description: 'The third planet from the Sun and the only known astronomical body harboring life and vast liquid surface oceans.',
    surfaceFeatures: 'Active plate tectonics, continental crusts, deep ocean trenches (Mariana Trench -11 km), and protective magnetosphere.',
    scientificDiscovery: 'The geodynamo in Earth’s liquid outer core generates a magnetic dipole shield defending the biosphere from solar wind stripping.',
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'Terrestrial Planet',
    diameterKm: 6779,
    massKg: '6.417 × 10²³',
    gravityMs2: 3.72,
    orbitalDistanceAU: 1.524,
    orbitalPeriodDays: 686.98,
    rotationPeriodHours: 24.62,
    moonsCount: 2, // Phobos & Deimos
    hasRings: false,
    meanTempC: -63,
    atmosphere: ['95.3% Carbon Dioxide', '2.6% Nitrogen', '1.9% Argon', '0.16% Oxygen'],
    color: '#C1440E',
    description: 'The Red Planet, colored by ferric oxide (rust) covering its surface, hosting ancient river valleys, massive extinct volcanoes, and polar ice caps.',
    surfaceFeatures: 'Olympus Mons (highest shield volcano in solar system, 21.9 km), Valles Marineris canyon network (4,000 km long).',
    scientificDiscovery: 'Perseverance rover confirmed deltaic sediments in Jezero Crater deposited by ancient liquid rivers 3.5 billion years ago.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas Giant',
    diameterKm: 139820,
    massKg: '1.898 × 10²⁷',
    gravityMs2: 24.79,
    orbitalDistanceAU: 5.204,
    orbitalPeriodDays: 4332.59, // 11.86 Earth years
    rotationPeriodHours: 9.93,
    moonsCount: 95,
    hasRings: true,
    meanTempC: -110,
    atmosphere: ['89.8% Hydrogen', '10.2% Helium', 'Methane', 'Ammonia', 'Water Ice'],
    color: '#C88B3A',
    description: 'The king of planets, with more than twice the mass of all other planets in the Solar System combined, acting as a cosmic gravitational shield.',
    surfaceFeatures: 'Great Red Spot anticyclonic storm (active for over 350 years), zonal jet streams, and intense polar cyclones.',
    scientificDiscovery: 'Juno spacecraft revealed that Jupiter possesses a dilute, fuzzy core rather than a compact rocky sphere.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'Gas Giant',
    diameterKm: 116460,
    massKg: '5.683 × 10²⁶',
    gravityMs2: 10.44,
    orbitalDistanceAU: 9.582,
    orbitalPeriodDays: 10759.22, // 29.45 Earth years
    rotationPeriodHours: 10.7,
    moonsCount: 146,
    hasRings: true,
    meanTempC: -140,
    atmosphere: ['96.3% Hydrogen', '3.25% Helium', 'Methane', 'Ammonia'],
    color: '#E2BF7D',
    description: 'The jewel of the Solar System, renowned for its dazzling system of icy rings stretching 282,000 km across while averaging only 10 meters thick.',
    surfaceFeatures: 'Spectacular main rings (A, B, C, D, F), hexagonal polar jet stream, and low bulk density (less dense than liquid water).',
    scientificDiscovery: 'Cassini spacecraft found water vapor geysers erupting from Enceladus’s south pole and liquid hydrocarbon seas on Titan.',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'Ice Giant',
    diameterKm: 50724,
    massKg: '8.681 × 10²⁵',
    gravityMs2: 8.69,
    orbitalDistanceAU: 19.2,
    orbitalPeriodDays: 30685.4, // 84 Earth years
    rotationPeriodHours: -17.24,
    moonsCount: 28,
    hasRings: true,
    meanTempC: -195,
    atmosphere: ['82.5% Hydrogen', '15.2% Helium', '2.3% Methane'],
    color: '#4B70DD',
    description: 'An ice giant with a dramatic 97.77° axial tilt, effectively rolling on its side around the Sun, resulting in 42 years of continuous sunlight and darkness at its poles.',
    surfaceFeatures: 'Faint vertical ring system, coldest planetary atmosphere in the solar system (-224°C record minimum), and complex tilted magnetosphere.',
    scientificDiscovery: 'Extreme axial tilt thought to result from a catastrophic proto-planetary collision early in solar system accretion.',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'Ice Giant',
    diameterKm: 49244,
    massKg: '1.024 × 10²⁶',
    gravityMs2: 11.15,
    orbitalDistanceAU: 30.05,
    orbitalPeriodDays: 60189.0, // 164.8 Earth years
    rotationPeriodHours: 16.11,
    moonsCount: 16,
    hasRings: true,
    meanTempC: -201,
    atmosphere: ['80% Hydrogen', '19% Helium', '1.5% Methane'],
    color: '#274687',
    description: 'The outermost major planet, an ice giant with supersonic winds reaching 2,100 km/h, deep azure methane color, and dynamic storm systems.',
    surfaceFeatures: 'Great Dark Spot storm systems, cirrus methane clouds, and retrograde moon Triton with cryovolcanoes.',
    scientificDiscovery: 'Discovered through mathematical perturbations in Uranus’s orbit by Le Verrier and Adams before ever being seen in a telescope.',
  },
  {
    id: 'pluto',
    name: 'Pluto',
    type: 'Dwarf Planet',
    diameterKm: 2376,
    massKg: '1.303 × 10²²',
    gravityMs2: 0.62,
    orbitalDistanceAU: 39.48,
    orbitalPeriodDays: 90560, // 248 Earth years
    rotationPeriodHours: -153.3,
    moonsCount: 5,
    hasRings: false,
    meanTempC: -229,
    atmosphere: ['Trace Nitrogen', 'Methane', 'Carbon Monoxide'],
    color: '#C39B77',
    description: 'The famous Kuiper Belt dwarf planet visited by New Horizons in 2015, revealing glaciers of nitrogen ice, towering water-ice mountains, and cryovolcanism.',
    surfaceFeatures: 'Sputnik Planitia heart-shaped nitrogen glacier, Hillary Montes mountains, and Charon tidally locked binary relationship.',
    scientificDiscovery: 'Active convection cells in nitrogen ice prove internal heat continues driving geological renewal 4.5 billion years after formation.',
  },
];

// 3. BLACK HOLES
export const blackHolesData: BlackHoleItem[] = [
  {
    id: 'sgr-a-star',
    name: 'Sagittarius A*',
    type: 'Supermassive',
    constellation: 'Sagittarius',
    distanceLy: '26,670 ly',
    massSolarMasses: '4.297 × 10⁶ M☉ (~4.3 Million Sun masses)',
    schwarzschildRadiusKm: '12.7 Million km (~0.085 AU)',
    hostGalaxy: 'Milky Way',
    description: 'The supermassive gravitational anchor at the heart of our Milky Way galaxy. Directly imaged by the Event Horizon Telescope (EHT) in 2022.',
    keyPhenomena: ['Direct EHT millimeter-wave shadow image', 'Relativistic orbits of S-stars (S2)', 'Gravitational redshift of light confirmed by GRAVITY/VLT', 'Quiescent accretion state'],
    isDirectObservation: true,
    observationalCredit: 'Event Horizon Telescope (EHT) Collaboration',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'm87-star',
    name: 'Messier 87* (M87*)',
    type: 'Supermassive',
    constellation: 'Virgo',
    distanceLy: '53.5 Million ly',
    massSolarMasses: '6.5 × 10⁹ M☉ (~6.5 Billion Sun masses)',
    schwarzschildRadiusKm: '19.2 Billion km (~128 AU)',
    hostGalaxy: 'Messier 87 (Virgo A)',
    description: 'The historical first black hole directly imaged in human history (April 2019). It powers a relativistic plasma jet extending over 5,000 light-years across space.',
    keyPhenomena: ['First direct black hole shadow imaged (2019)', 'Polarized light reveals magnetic field structure', 'Relativistic jet traveling at 99% speed of light', 'Supermassive accretion disk'],
    isDirectObservation: true,
    observationalCredit: 'Event Horizon Telescope (EHT) & ALMA Observatory',
    imageUrl: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cygnus-x1',
    name: 'Cygnus X-1',
    type: 'Stellar-mass',
    constellation: 'Cygnus',
    distanceLy: '7,200 ly',
    massSolarMasses: '21.2 M☉',
    schwarzschildRadiusKm: '62.6 km',
    hostGalaxy: 'Milky Way',
    description: 'The first widely accepted black hole candidate, discovered in 1964 via high-energy X-ray emissions as it strips plasma from its blue supergiant companion star HDE 226868.',
    keyPhenomena: ['Intense X-ray binary accretion disk', 'Near-maximal Kerr spin (a* > 0.95)', 'Relativistic radio jets', 'Historical wager between Stephen Hawking and Kip Thorne'],
    isDirectObservation: false,
    observationalCredit: 'Chandra X-ray Observatory / NuSTAR',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ton-618',
    name: 'TON 618',
    type: 'Supermassive',
    constellation: 'Canes Venatici',
    distanceLy: '10.8 Billion ly',
    massSolarMasses: '6.6 × 10¹⁰ M☉ (~66 Billion Sun masses)',
    schwarzschildRadiusKm: '390 Billion km (~2,600 AU)',
    hostGalaxy: 'TON 618 host quasar',
    description: 'One of the most gargantuan ultramassive black holes known in cosmology. Its accretion disk shines as a hyper-luminous quasar outshining 140 trillion Suns.',
    keyPhenomena: ['Ultramassive black hole classification', 'Quasar bolometric luminosity 4 × 10⁴⁰ Watts', 'Event horizon larger than Pluto’s entire orbit 40 times over', 'Broad emission line region (Hβ)'],
    isDirectObservation: false,
    observationalCredit: 'Sloan Digital Sky Survey (SDSS)',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
];

// 4. EXOPLANETS
export const exoplanetsData: ExoplanetItem[] = [
  {
    id: 'trappist-1e',
    name: 'TRAPPIST-1e',
    hostStar: 'TRAPPIST-1 (Ultra-cool Red Dwarf)',
    constellation: 'Aquarius',
    distanceLy: 39.46,
    planetType: 'Terrestrial',
    discoveryMethod: 'Transit',
    discoveryYear: 2017,
    massEarths: 0.692,
    radiusEarths: 0.92,
    orbitalPeriodDays: 6.1,
    inHabitableZone: true,
    equilibriumTempK: 251, // -22°C (very similar to Earth's 255K equilibrium)
    description: 'An Earth-sized rocky exoplanet located squarely in the conservative habitable zone of the TRAPPIST-1 red dwarf system, receiving 66% of Earth’s solar flux.',
    habitabilityNote: 'Prime candidate for JWST atmospheric transmission spectroscopy. Note: Being in the habitable zone indicates liquid water could theoretically exist on the surface under sufficient atmospheric pressure, but does not confirm life.',
  },
  {
    id: 'proxima-b',
    name: 'Proxima Centauri b',
    hostStar: 'Proxima Centauri (M-type Red Dwarf)',
    constellation: 'Centaurus',
    distanceLy: 4.24,
    planetType: 'Terrestrial',
    discoveryMethod: 'Radial Velocity',
    discoveryYear: 2016,
    massEarths: 1.17,
    radiusEarths: 1.03,
    orbitalPeriodDays: 11.19,
    inHabitableZone: true,
    equilibriumTempK: 234,
    description: 'The closest known exoplanet to our Solar System, orbiting our nearest stellar neighbor. Tidally locked, with its day side eternally facing the red dwarf star.',
    habitabilityNote: 'Orbits closely (0.048 AU), exposing it to violent stellar flares and coronal mass ejections that may strip its atmosphere unless shielded by a strong magnetic field.',
  },
  {
    id: 'kepler-452b',
    name: 'Kepler-452b',
    hostStar: 'Kepler-452 (G-type Yellow Star like our Sun)',
    constellation: 'Cygnus',
    distanceLy: 1402,
    planetType: 'Super-Earth',
    discoveryMethod: 'Transit',
    discoveryYear: 2015,
    massEarths: 5.0,
    radiusEarths: 1.63,
    orbitalPeriodDays: 384.8,
    inHabitableZone: true,
    equilibriumTempK: 265,
    description: 'Often dubbed "Earth’s older cousin", orbiting a sun-like star in a 385-day orbit, making its orbital environment remarkably analogous to Earth.',
    habitabilityNote: 'Radius at the transition boundary between rocky Super-Earths and volatile-rich Mini-Neptunes. Its host star is 1.5 billion years older than our Sun.',
  },
  {
    id: 'k2-18b',
    name: 'K2-18b',
    hostStar: 'K2-18 (Red Dwarf)',
    constellation: 'Leo',
    distanceLy: 124,
    planetType: 'Sub-Neptune',
    discoveryMethod: 'Transit',
    discoveryYear: 2015,
    massEarths: 8.63,
    radiusEarths: 2.61,
    orbitalPeriodDays: 32.9,
    inHabitableZone: true,
    equilibriumTempK: 255,
    description: 'A habitable-zone sub-Neptune where JWST detected carbon-bearing molecules (methane and carbon dioxide) and potential traces of dimethyl sulfide (DMS).',
    habitabilityNote: 'Hypothesized to be a "Hycean" world: a planet with a hydrogen-rich atmosphere overlying a global liquid water ocean. Research is actively ongoing.',
  },
  {
    id: 'wasp-121b',
    name: 'WASP-121b',
    hostStar: 'WASP-121 (F-type Star)',
    constellation: 'Puppis',
    distanceLy: 858,
    planetType: 'Hot Jupiter',
    discoveryMethod: 'Transit',
    discoveryYear: 2015,
    massEarths: 375.0,
    radiusEarths: 20.3,
    orbitalPeriodDays: 1.27,
    inHabitableZone: false,
    equilibriumTempK: 2500,
    description: 'An extreme "Hot Jupiter" so close to its star that its atmosphere vaporizes heavy metals, resulting in clouds of iron, titanium, and vaporized corundum (sapphire/ruby).',
    habitabilityNote: 'Entirely uninhabitable. Used by astrophysicists as a laboratory for studying extreme atmospheric physics and thermal inversions.',
  },
];

// 5. SPACE MISSIONS
export const spaceMissionsData: SpaceMissionItem[] = [
  {
    id: 'jwst',
    name: 'James Webb Space Telescope (JWST)',
    agency: 'NASA',
    target: 'Cosmic Origins & Deep Universe',
    launchDate: 'December 25, 2021',
    status: 'Active / Operational',
    missionType: 'Space Observatory',
    keyObjectives: ['First light in the early universe (z > 10)', 'Galactic assembly and evolution', 'Stellar nurseries and protoplanetary disks', 'Exoplanet atmospheres and biosignatures'],
    scientificAchievements: 'Detected galaxies dating to within 300 million years of the Big Bang (JADES-GS-z14-0), verified water in inner planet-forming disks, and characterized atmospheres of temperate exoplanets.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'artemis',
    name: 'Artemis Program (Artemis II & III)',
    agency: 'NASA',
    target: 'Moon & Lunar South Pole',
    launchDate: 'Artemis I: Nov 2022 | Artemis II/III: 2025-2026',
    status: 'Active / Operational',
    missionType: 'Lunar Exploration',
    keyObjectives: ['Land the first woman and person of color on the Moon', 'Explore water ice deposits in permanently shadowed south pole craters', 'Establish the Lunar Gateway station', 'Validate technology for human expeditions to Mars'],
    scientificAchievements: 'Artemis I Orion capsule completed a 1.4-million-mile test flight entering a distant retrograde lunar orbit and executing record-velocity atmospheric re-entry.',
    imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'perseverance',
    name: 'Mars 2020 Perseverance Rover',
    agency: 'NASA',
    target: 'Jezero Crater, Mars',
    launchDate: 'July 30, 2020',
    status: 'Active / Operational',
    missionType: 'Planetary Rover',
    keyObjectives: ['Seek signs of ancient microbial life', 'Collect and cache sealed core rock samples for Mars Sample Return', 'Deploy MOXIE oxygen generation experiment', 'Survey past habitable environments in Jezero delta'],
    scientificAchievements: 'Cached 24+ geological rock cores, completed 72 flights with the Ingenuity Mars Helicopter, and extracted breathable oxygen from Mars’s CO₂ atmosphere with MOXIE.',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'europa-clipper',
    name: 'Europa Clipper',
    agency: 'NASA',
    target: 'Europa (Jupiter Moon)',
    launchDate: 'October 14, 2024',
    status: 'En Route',
    missionType: 'Orbiter / Probe',
    keyObjectives: ['Determine thickness of Europa’s ice shell', 'Assess ocean composition and depth', 'Search for organic compounds and thermal vents', 'Investigate potential habitability of subsurface ocean'],
    scientificAchievements: 'Successfully entered interplanetary transfer orbit on a Falcon Heavy; equipped with ice-penetrating radar, infrared spectrometers, and magnetometer.',
    imageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1 & 2',
    agency: 'NASA',
    target: 'Interstellar Space',
    launchDate: 'August / September 1977',
    status: 'Active / Operational',
    missionType: 'Deep Space Flyby',
    keyObjectives: ['Grand Tour of outer planets (Jupiter, Saturn, Uranus, Neptune)', 'Reach interstellar space', 'Measure heliopause and cosmic ray spectrum outside the solar bubble'],
    scientificAchievements: 'The farthest human-made objects from Earth (over 160 AU / 24 billion km away). First spacecraft to cross the heliopause and sample interstellar plasma in situ.',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
  },
];

// 6. SPACE GALLERY
export const spaceGalleryData: SpaceGalleryImage[] = [
  {
    id: 'gal-1',
    title: 'Carina Nebula (Cosmic Cliffs) - Webb NIRCam',
    category: 'Nebulae',
    credit: 'NASA, ESA, CSA, STScI',
    date: '2022-07-12',
    description: 'Towering gaseous peaks in the NGC 3324 star-forming region, where blistering stellar radiation has carved away dense gas and triggered birth of protostellar jets.',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    isArtisticImpression: false,
    dimensions: '14,575 × 8,441 px',
  },
  {
    id: 'gal-2',
    title: 'Jupiter in Multi-Wavelength Infrared View',
    category: 'Planets',
    credit: 'NASA, ESA, Jupiter ERO Team',
    date: '2022-08-22',
    description: 'Webb NIRCam composite showing glowing auroral caps at both northern and southern poles, delicate rings, and moons Amalthea and Adrastea against dark space.',
    imageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80',
    isArtisticImpression: false,
    dimensions: '3,840 × 2,160 px',
  },
  {
    id: 'gal-3',
    title: 'SMACS 0723 Deep Field Gravitational Lens',
    category: 'Deep Field',
    credit: 'NASA, ESA, CSA, STScI',
    date: '2022-07-11',
    description: 'The gravitational mass of galaxy cluster SMACS 0723 bends and magnifies the light of primordial galaxies behind it, stretching them into dramatic glowing arcs.',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    isArtisticImpression: false,
    dimensions: '4,537 × 4,630 px',
  },
  {
    id: 'gal-4',
    title: 'The Ring Nebula (M57) in Mid-Infrared',
    category: 'Nebulae',
    credit: 'ESA / Webb / NASA',
    date: '2023-08-21',
    description: 'A dying star expelling its outer shells of ionized gas into the cosmos, revealing complex concentric rings sculpted by companion stellar interactions.',
    imageUrl: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1200&q=80',
    isArtisticImpression: false,
    dimensions: '3,840 × 3,840 px',
  },
];

// 7. QUIZ QUESTIONS (ASTRONOMY & ASTROPHYSICS)
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the physical boundary around a black hole beyond which nothing, not even light, can escape?',
    questionBn: 'একটি কৃষ্ণগহ্বরের চারপাশের কোন সীমানা পেরিয়ে আলোসহ কোনো কিছুই ফিরে আসতে পারে না?',
    options: ['Accretion Disk', 'Event Horizon', 'Photon Sphere', 'Ergosphere'],
    optionsBn: ['অ্যাক্রিশন ডিস্ক', 'ইভেন্ট হরাইজন (ঘটনা দিগন্ত)', 'ফোটন স্ফিয়ার', 'এরগোস্ফিয়ার'],
    correctIndex: 1,
    explanation: 'The Event Horizon is the mathematically defined boundary of spacetime where the escape velocity equals the speed of light (c). The radius is given by the Schwarzschild equation rs = 2GM/c².',
    explanationBn: 'ইভেন্ট হরাইজন বা ঘটনা দিগন্ত হলো এমন এক সীমানা যেখানে মুক্তিবেগ আলোর গতির সমান হয়ে যায়। এর ব্যাসার্ধ নির্ধারণ করে শোয়ার্জশিল্ড সূত্র rs = 2GM/c²।',
  },
  {
    id: 2,
    question: 'Approximately how long does it take for sunlight to travel from the Sun to Earth (1 AU)?',
    questionBn: 'সূর্য থেকে পৃথিবীতে আলো পৌঁছাতে আনুমানিক কত সময় লাগে?',
    options: ['8 minutes and 20 seconds', '1 hour and 15 minutes', '1 second', '24 hours'],
    optionsBn: ['৮ মিনিট ২০ সেকেন্ড', '১ ঘণ্টা ১৫ মিনিট', '১ সেকেন্ড', '২৪ ঘণ্টা'],
    correctIndex: 0,
    explanation: 'Earth is 1 Astronomical Unit (~149.6 million km) from the Sun. Dividing by the speed of light (299,792 km/s) yields ~499 seconds, or ~8 minutes and 19-20 seconds.',
    explanationBn: 'সূর্য থেকে পৃথিবীর গড় দূরত্ব ১৪.৯৬ কোটি কিমি। আলোর গতি (২৯৯,৭৯২ কিমি/সেকেন্ড) দিয়ে ভাগ করলে সময় লাগে প্রায় ৪৯৯ সেকেন্ড বা ৮ মিনিট ২০ সেকেন্ড।',
  },
  {
    id: 3,
    question: 'Which telescope detected the farthest known galaxy (JADES-GS-z14-0) formed just 290 million years after the Big Bang?',
    questionBn: 'কোন দূরবীন মহাবিস্ফোরণের মাত্র ২৯ কোটি বছর পরের প্রাচীনতম গ্যালাক্সি JADES-GS-z14-0 পর্যবেক্ষণ করেছে?',
    options: ['Hubble Space Telescope', 'James Webb Space Telescope', 'Chandra X-ray Observatory', 'Spitzer Telescope'],
    optionsBn: ['হাবল স্পেস টেলিস্কোপ', 'জেমস ওয়েব স্পেস টেলিস্কোপ', 'চন্দ্রা এক্স-রে মানমন্দির', 'স্পিটজার টেলিস্কোপ'],
    correctIndex: 1,
    explanation: 'The James Webb Space Telescope (JWST) uses high-resolution infrared spectrographs (NIRSpec) to peer through cosmological redshift and capture early cosmic dawn.',
    explanationBn: 'জেমস ওয়েব স্পেস টেলিস্কোপ (JWST) ইনফ্রারেড স্পেকট্রোস্কোপি দিয়ে মহাজাগতিক রেডশিফটের ওপারে আদিম গ্যালাক্সি আবিষ্কার করেছে।',
  },
  {
    id: 4,
    question: 'What element makes planet Mars appear predominantly reddish in color?',
    questionBn: 'কোন উপাদানের উপস্থিতির কারণে মঙ্গল গ্রহকে লালচে দেখায়?',
    options: ['Liquid Mercury', 'Iron Oxide (Rust)', 'Sulfur crystals', 'Copper carbonate'],
    optionsBn: ['তরল পারদ', 'আয়রন অক্সাইড (মরিচা)', 'সালফার স্ফটিক', 'কপার কার্বনেট'],
    correctIndex: 1,
    explanation: 'Mars’s regolith contains abundant iron oxide (rust) minerals that oxidize and scatter red wavelengths of sunlight, giving it its iconic "Red Planet" hue.',
    explanationBn: 'মঙ্গল গ্রহের মাটির ধূলিকণায় প্রচুর পরিমাণে আয়রন অক্সাইড বা মরিচা বিদ্যমান যা সূর্যের লাল তরঙ্গ প্রতিফলিত করে।',
  },
  {
    id: 5,
    question: 'What is the dominant constituent of the universe’s total energy-mass budget according to the standard Lambda-CDM cosmological model?',
    questionBn: 'আধুনিক ল্যাম্বডা-সিডিএম মহাজাগতিক মডেল অনুযায়ী মহাবিশ্বের মোট শক্তি-ভরের সবচেয়ে বড় অংশ কোনটি?',
    options: ['Ordinary Baryonic Matter (Atoms)', 'Dark Energy (~68%)', 'Dark Matter (~27%)', 'Electromagnetic Radiation'],
    optionsBn: ['সাধারণ পরমাণু বা দৃশ্যমান পদার্থ (~৫%)', 'ডার্ক এনার্জি বা অদৃশ্য শক্তি (~৬৮%)', 'ডার্ক ম্যাটার বা অদৃশ্য ভর (~২৭%)', 'তড়িৎচৌম্বকীয় বিকিরণ'],
    correctIndex: 1,
    explanation: 'Dark Energy accounts for roughly 68% of the universe and is responsible for the accelerating expansion of space. Dark matter comprises ~27%, and ordinary matter is only ~5%.',
    explanationBn: 'ডার্ক এনার্জি মহাবিশ্বের প্রায় ৬৮% জুড়ে রয়েছে যা স্থানকালের ত্বরান্বিত প্রসারণ ঘটাচ্ছে। ডার্ক ম্যাটার ২৭% এবং আমাদের পরিচিত দৃশ্যমান পদার্থ মাত্র ৫%।',
  },
];
