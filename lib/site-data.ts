export const rooms = [
  {
    id: 'single' as const,
    name: 'Single Bedroom',
    image: '/assets/rooms/room-single-luxury.png',
    rate: 85000,
    price: 'PKR 85,000 / night',
    short: 'Quiet mountain-facing retreat for solo guests or focused business stays.',
    desc: 'A quiet mountain-facing retreat for solo guests or business stays. Warm timber, heated comfort, and morning pine views.',
    bestFor: 'Solo retreats, short stays, and focused work above the pines',
    details: ['Queen bed', 'Mountain-facing window', 'TV', 'Climate comfort', 'WiFi', 'Valley view']
  },
  {
    id: 'double' as const,
    name: 'Double Bedroom',
    image: '/assets/rooms/room-double-luxury.png',
    rate: 105000,
    price: 'PKR 105,000 / night',
    short: 'Generous room for couples or small families, balancing privacy and lounge comfort.',
    desc: 'A spacious hill-station room for couples or small families, balancing privacy, view, and generous lounge comfort.',
    bestFor: 'Couples, small families, and relaxed weekend stays',
    details: ['Two-bed layout', 'Family-friendly', 'TV', 'Climate comfort', 'WiFi', 'Pine view']
  },
  {
    id: 'suite' as const,
    name: 'Signature Suite',
    image: '/assets/rooms/room-suite-luxury.png',
    rate: 165000,
    price: 'PKR 165,000 / night',
    short: 'Flagship suite with cinematic valley window, sitting area, and reserved hosting touches.',
    desc: 'Our flagship suite with a cinematic valley window, separate sitting area, elevated amenities, and reserved hosting touches.',
    bestFor: 'Special occasions, longer stays, and the strongest valley-view experience',
    details: ['King bed', 'Separate lounge', 'TV', 'Climate comfort', 'WiFi', 'Panoramic view']
  }
];

export const experiences = [
  {
    title: 'Snowfall arrivals',
    image: '/assets/experience/experience-snowfall-nathiagali.png',
    text: 'Winter days framed by heated interiors, brass light, and quiet pine-covered slopes.',
    detail: 'Snowfall weekends are designed around warmth: heated rooms, slower arrivals, road-condition guidance, and evenings that feel protected from the weather outside.'
  },
  {
    title: 'Green season trails',
    image: '/assets/experience/experience-trails-nathiagali.png',
    text: 'Step out toward forest walks, ridge viewpoints, and misty monsoon mornings.',
    detail: 'Green season brings soft trails, pine air, and nearby day excursions toward Dunga Gali, Mushkpuri approaches, and Ayubia forest routes.'
  },
  {
    title: 'Bonfire evenings',
    image: '/assets/experience/experience-bonfire-nathiagali.png',
    text: 'Slow dinners, local kahwa, ember-lit conversations, and crisp Nathiagali nights.',
    detail: 'Evenings lean into the theatre of the hills: lanterns, embers, blankets, warm service, and a quieter pace after the drive up.'
  }
];

export const concepts = [
  {
    title: 'Ridge Massing Study',
    text: 'Terraced pine-facing suites stepping gently with the ridge line.',
    meta: 'Stone base · timber roofline · valley glass'
  },
  {
    title: 'Courtyard Arrival Study',
    text: 'A warmer lodge language for winter arrivals, covered drop-off, and bonfire nights.',
    meta: 'Arrival court · hearth lobby · sheltered service'
  },
  {
    title: 'Panorama Deck Study',
    text: 'A glass-lined viewing structure designed around sunrise breakfasts and valley-facing evenings.',
    meta: 'Viewing deck · warm glazing · horizon line'
  }
];

export const routeStops = [
  ['Islamabad / Rawalpindi', 'Start early for a calmer hill approach and flexible weather buffer.'],
  ['Murree ridge road', 'Expect traffic variation during weekends, snowfall, and school holidays.'],
  ['Nathiagali arrival', 'The hotel team confirms final road conditions before winter travel.']
];

export const nearbyPlaces = [
  ['Dunga Gali pipeline walk', 'Forest trail'],
  ['Mushkpuri approach', 'Viewpoint'],
  ['Ayubia National Park', 'Nature reserve'],
  ['Murree interchange', 'Route marker']
];
