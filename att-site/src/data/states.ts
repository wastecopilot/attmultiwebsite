/**
 * States where att.com publishes an AT&T Fiber state page (https://www.att.com/local/fiber/<state>), with the
 * first 12 cities of each page's city directory, copied verbatim. Captured 2026-10-22 from the evidence in
 * research/raw/pages-2026-10-22/state-*.{txt,html}. att.com does not publish state pages for AT&T Internet Air,
 * and its pages do not say which addresses are served, so the site only states that att.com lists AT&T Fiber
 * areas in the state, with limited availability. att.com has 32 state pages; 25 are included (OPEN_ITEMS).
 */
export interface FiberState {
  state: string;
  code: string;
  slug: string;
  sourceUrl: string;
  retrievedAt: string;
  cities: string[];
}

export const fiberStates: FiberState[] = [
  {
    "state": "Alabama",
    "code": "AL",
    "slug": "alabama",
    "sourceUrl": "https://www.att.com/local/fiber/alabama",
    "retrievedAt": "2026-10-22T11:18:20.718Z",
    "cities": [
      "Adamsville",
      "Adger",
      "Alabaster",
      "Albertville",
      "Alex City",
      "Alexander City",
      "Alexandria",
      "Anniston",
      "Arley",
      "Athens",
      "Attalla",
      "Auburn"
    ]
  },
  {
    "state": "Arizona",
    "code": "AZ",
    "slug": "arizona",
    "sourceUrl": "https://www.att.com/local/fiber/arizona",
    "retrievedAt": "2026-10-22T11:33:41.516Z",
    "cities": [
      "Anthem",
      "Apache Junction",
      "Arizona City",
      "Avondale",
      "Buckeye",
      "Casa Grande",
      "Cave Creek",
      "Chandler",
      "El Mirage",
      "Eloy",
      "Florence",
      "Fountain Hills"
    ]
  },
  {
    "state": "Arkansas",
    "code": "AR",
    "slug": "arkansas",
    "sourceUrl": "https://www.att.com/local/fiber/arkansas",
    "retrievedAt": "2026-10-22T11:30:02.794Z",
    "cities": [
      "Alexander",
      "Barling",
      "Batesville",
      "Bauxite",
      "Benton",
      "Bentonville",
      "Bethel Heights",
      "Blytheville",
      "Bonanza",
      "Bono",
      "Bryant",
      "Cammack Village"
    ]
  },
  {
    "state": "California",
    "code": "CA",
    "slug": "california",
    "sourceUrl": "https://www.att.com/local/fiber/california",
    "retrievedAt": "2026-10-22T11:13:04.833Z",
    "cities": [
      "Adelaide",
      "Agoura",
      "Agoura Hills",
      "Agua Dulce",
      "Alameda",
      "Alamo",
      "Albany",
      "Alhambra",
      "Aliso Viejo",
      "Altadena",
      "Alviso",
      "American Canyon"
    ]
  },
  {
    "state": "Colorado",
    "code": "CO",
    "slug": "colorado",
    "sourceUrl": "https://www.att.com/local/fiber/colorado",
    "retrievedAt": "2026-10-22T11:32:47.676Z",
    "cities": [
      "Arvada",
      "Aurora",
      "Berthoud",
      "Boulder",
      "Brighton",
      "Broomfield",
      "Castle Rock",
      "Colorado Springs",
      "Commerce City",
      "Denver",
      "Edgewater",
      "Elizabeth"
    ]
  },
  {
    "state": "Florida",
    "code": "FL",
    "slug": "florida",
    "sourceUrl": "https://www.att.com/local/fiber/florida",
    "retrievedAt": "2026-10-22T11:15:22.912Z",
    "cities": [
      "Alafaya",
      "Aloma",
      "Altamonte Springs",
      "Altoona",
      "Alva",
      "Amelia Island",
      "Anastasia Island",
      "Apopka",
      "Arcadia",
      "Archer",
      "Astor",
      "Atlantic Beach"
    ]
  },
  {
    "state": "Georgia",
    "code": "GA",
    "slug": "georgia",
    "sourceUrl": "https://www.att.com/local/fiber/georgia",
    "retrievedAt": "2026-10-22T11:16:53.287Z",
    "cities": [
      "Acworth",
      "Adairsville",
      "Albany",
      "Alpharetta",
      "Appling",
      "Aragon",
      "Arcade",
      "Athens",
      "Atlanta",
      "Auburn",
      "Augusta",
      "Austell"
    ]
  },
  {
    "state": "Illinois",
    "code": "IL",
    "slug": "illinois",
    "sourceUrl": "https://www.att.com/local/fiber/illinois",
    "retrievedAt": "2026-10-22T11:16:06.435Z",
    "cities": [
      "Addison",
      "Algonquin",
      "Alsip",
      "Alton",
      "Anchor",
      "Argo",
      "Arlington Heights",
      "Aurora",
      "Bannockburn",
      "Barrington",
      "Bartlett",
      "Batavia"
    ]
  },
  {
    "state": "Indiana",
    "code": "IN",
    "slug": "indiana",
    "sourceUrl": "https://www.att.com/local/fiber/indiana",
    "retrievedAt": "2026-10-22T11:24:03.192Z",
    "cities": [
      "Acton",
      "Anderson",
      "Arlington",
      "Avon",
      "Bedford",
      "Beech Grove",
      "Bloomington",
      "Boonville",
      "Brazil",
      "Brownsburg",
      "Camby",
      "Carmel"
    ]
  },
  {
    "state": "Kansas",
    "code": "KS",
    "slug": "kansas",
    "sourceUrl": "https://www.att.com/local/fiber/kansas",
    "retrievedAt": "2026-10-22T11:29:21.713Z",
    "cities": [
      "Andover",
      "Athol",
      "Augusta",
      "Baldwin City",
      "Basehor",
      "Bavaria",
      "Bel Aire",
      "Benton",
      "Bonner Springs",
      "Bucyrus",
      "Chautauqua",
      "Countryside"
    ]
  },
  {
    "state": "Kentucky",
    "code": "KY",
    "slug": "kentucky",
    "sourceUrl": "https://www.att.com/local/fiber/kentucky",
    "retrievedAt": "2026-10-22T11:23:11.718Z",
    "cities": [
      "Allegre",
      "Almo",
      "Alvaton",
      "Anchorage",
      "Audubon Park",
      "Balkan",
      "Ballardsville",
      "Bancroft",
      "Barbourmeade",
      "Bardstown",
      "Beattyville",
      "Bellemeade"
    ]
  },
  {
    "state": "Louisiana",
    "code": "LA",
    "slug": "louisiana",
    "sourceUrl": "https://www.att.com/local/fiber/louisiana",
    "retrievedAt": "2026-10-22T11:20:23.405Z",
    "cities": [
      "Abbeville",
      "Abita Springs",
      "Addis",
      "Albany",
      "Alexandria",
      "Ama",
      "Amite",
      "Arabi",
      "Arcadia",
      "Archibald",
      "Avondale",
      "Bains"
    ]
  },
  {
    "state": "Michigan",
    "code": "MI",
    "slug": "michigan",
    "sourceUrl": "https://www.att.com/local/fiber/michigan",
    "retrievedAt": "2026-10-22T11:17:37.288Z",
    "cities": [
      "Ada",
      "Allegan",
      "Allen Park",
      "Ann Arbor",
      "Argyle",
      "Auburn Hills",
      "Bath",
      "Battle Creek",
      "Belleville",
      "Belmont",
      "Benton Harbor",
      "Berkley"
    ]
  },
  {
    "state": "Minnesota",
    "code": "MN",
    "slug": "minnesota",
    "sourceUrl": "https://www.att.com/local/fiber/minnesota",
    "retrievedAt": "2026-10-22T11:28:34.561Z",
    "cities": [
      "Afton",
      "Albertville",
      "Andover",
      "Anoka",
      "Arden Hills",
      "Bayport",
      "Blaine",
      "Bloomington",
      "Brooklyn Center",
      "Brooklyn Park",
      "Burnsville",
      "Cannon Falls"
    ]
  },
  {
    "state": "Mississippi",
    "code": "MS",
    "slug": "mississippi",
    "sourceUrl": "https://www.att.com/local/fiber/mississippi",
    "retrievedAt": "2026-10-22T11:22:09.391Z",
    "cities": [
      "Abbeville",
      "Aberdeen",
      "Ackerman",
      "Agricola",
      "Amory",
      "Avalon",
      "Batesville",
      "Bay Saint Louis",
      "Belden",
      "Biloxi",
      "Blue Springs",
      "Brandon"
    ]
  },
  {
    "state": "Missouri",
    "code": "MO",
    "slug": "missouri",
    "sourceUrl": "https://www.att.com/local/fiber/missouri",
    "retrievedAt": "2026-10-22T11:25:23.921Z",
    "cities": [
      "Affton",
      "Allenton",
      "Antonia",
      "Arnold",
      "Avondale",
      "Ballwin",
      "Barnhart",
      "Battlefield",
      "Belton",
      "Berkeley",
      "Billings",
      "Birmingham"
    ]
  },
  {
    "state": "North Carolina",
    "code": "NC",
    "slug": "north-carolina",
    "sourceUrl": "https://www.att.com/local/fiber/north-carolina",
    "retrievedAt": "2026-10-22T11:19:43.673Z",
    "cities": [
      "Alexander",
      "Alexander Mills",
      "Alexis",
      "Apex",
      "Arden",
      "Asheville",
      "Bald Head Island",
      "Balsam",
      "Barber",
      "Belews Creek",
      "Belmont",
      "Belville"
    ]
  },
  {
    "state": "Ohio",
    "code": "OH",
    "slug": "ohio",
    "sourceUrl": "https://www.att.com/local/fiber/ohio",
    "retrievedAt": "2026-10-22T11:21:12.656Z",
    "cities": [
      "Akron",
      "Alliance",
      "Auburn Township",
      "Barberton",
      "Bay Village",
      "Beachwood",
      "Beavercreek",
      "Beavercreek Township",
      "Bedford",
      "Bedford Heights",
      "Bellbrook",
      "Bentleyville"
    ]
  },
  {
    "state": "Oklahoma",
    "code": "OK",
    "slug": "oklahoma",
    "sourceUrl": "https://www.att.com/local/fiber/oklahoma",
    "retrievedAt": "2026-10-22T11:27:44.636Z",
    "cities": [
      "Altus",
      "Arcadia",
      "Bartlesville",
      "Bethany",
      "Bixby",
      "Broken Arrow",
      "Burbank",
      "Canute",
      "Cashion",
      "Catoosa",
      "Choctaw",
      "Claremore"
    ]
  },
  {
    "state": "South Carolina",
    "code": "SC",
    "slug": "south-carolina",
    "sourceUrl": "https://www.att.com/local/fiber/south-carolina",
    "retrievedAt": "2026-10-22T11:26:04.432Z",
    "cities": [
      "Aiken",
      "Anderson",
      "Arcadia",
      "Awendaw",
      "Batesburg",
      "Beech Island",
      "Belton",
      "Belvedere",
      "Blythewood",
      "Boiling Springs",
      "Brittons Neck",
      "Cainhoy"
    ]
  },
  {
    "state": "Tennessee",
    "code": "TN",
    "slug": "tennessee",
    "sourceUrl": "https://www.att.com/local/fiber/tennessee",
    "retrievedAt": "2026-10-22T11:19:03.279Z",
    "cities": [
      "Adams",
      "Alamo",
      "Alcoa",
      "Andersonville",
      "Antioch",
      "Apison",
      "Arlington",
      "Arrington",
      "Ashland City",
      "Athens",
      "Bakewell",
      "Bartlett"
    ]
  },
  {
    "state": "Texas",
    "code": "TX",
    "slug": "texas",
    "sourceUrl": "https://www.att.com/local/fiber/texas",
    "retrievedAt": "2026-10-22T11:13:53.913Z",
    "cities": [
      "Abilene",
      "Acton",
      "Addison",
      "Alamo",
      "Alamo Heights",
      "Aledo",
      "Alice",
      "Allen",
      "Alton",
      "Alvarado",
      "Alvin",
      "Amarillo"
    ]
  },
  {
    "state": "Utah",
    "code": "UT",
    "slug": "utah",
    "sourceUrl": "https://www.att.com/local/fiber/utah",
    "retrievedAt": "2026-10-22T11:30:47.080Z",
    "cities": [
      "Alpine",
      "American Fork",
      "Bountiful",
      "Brigham City",
      "Cedar City",
      "Cedar Valley",
      "Centerville",
      "Clearfield",
      "Clinton",
      "Cottonwood Heights",
      "Draper",
      "Eagle Mountain"
    ]
  },
  {
    "state": "Washington",
    "code": "WA",
    "slug": "washington",
    "sourceUrl": "https://www.att.com/local/fiber/washington",
    "retrievedAt": "2026-10-22T11:31:27.685Z",
    "cities": [
      "Airway Heights",
      "Auburn",
      "Bainbridge Island",
      "Battle Ground",
      "Belfair",
      "Bellevue",
      "Bellingham",
      "Black Diamond",
      "Bonney Lake",
      "Bremerton",
      "Brush Prairie",
      "Buckley"
    ]
  },
  {
    "state": "Wisconsin",
    "code": "WI",
    "slug": "wisconsin",
    "sourceUrl": "https://www.att.com/local/fiber/wisconsin",
    "retrievedAt": "2026-10-22T11:27:00.286Z",
    "cities": [
      "Allouez",
      "Appleton",
      "Ashwaubenon",
      "Bay View",
      "Bayside",
      "Bellevue",
      "Beloit",
      "Black Creek",
      "Brookfield",
      "Brown Deer",
      "Butler",
      "Caledonia"
    ]
  }
];

export const getFiberState = (slug: string) => fiberStates.find((s) => s.slug === slug);
