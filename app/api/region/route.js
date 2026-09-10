const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

const REGION_BY_AREA = {
  north: [
    'ha noi', 'hanoi', 'hai phong', 'quang ninh', 'bac ninh', 'hung yen', 'ninh binh',
    'phu tho', 'tuyen quang', 'lao cai', 'thai nguyen', 'cao bang', 'lang son', 'son la',
    'dien bien', 'lai chau',
    // Legacy province names kept as aliases because OSM/Nominatim data may still expose them.
    'ha giang', 'yen bai', 'bac kan', 'bac giang', 'hai duong', 'thai binh', 'ha nam',
    'nam dinh', 'vinh phuc', 'hoa binh',
  ],
  central: [
    'thanh hoa', 'nghe an', 'ha tinh', 'quang tri', 'hue', 'thua thien hue', 'da nang',
    'quang ngai', 'gia lai', 'khanh hoa', 'dak lak', 'dac lak', 'lam dong',
    // Legacy province names kept as aliases after the 2025 provincial reorganisation.
    'quang binh', 'quang nam', 'kon tum', 'binh dinh', 'phu yen', 'ninh thuan',
    'binh thuan', 'dak nong', 'dac nong',
  ],
  south: [
    'ho chi minh', 'hcmc', 'sai gon', 'saigon', 'dong nai', 'tay ninh', 'vinh long',
    'dong thap', 'ca mau', 'an giang', 'can tho',
    // Legacy province names kept as aliases after the 2025 provincial reorganisation.
    'binh duong', 'ba ria vung tau', 'binh phuoc', 'long an', 'tien giang', 'ben tre',
    'tra vinh', 'hau giang', 'soc trang', 'bac lieu', 'kien giang',
  ],
};

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase();
}

function detectRegion(address = {}, displayName = '') {
  if (address.country_code && address.country_code !== 'vn') return null;

  const haystack = normalizeText([
    address.state,
    address.province,
    address.region,
    address.city,
    address.municipality,
    address.county,
    address.town,
    displayName,
  ].filter(Boolean).join(' '));

  for (const [region, names] of Object.entries(REGION_BY_AREA)) {
    if (names.some((name) => haystack.includes(name))) return region;
  }

  return null;
}

function areaLabel(address = {}) {
  return address.city || address.municipality || address.state || address.province || address.region || address.county || null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const latitude = Number(body?.latitude);
    const longitude = Number(body?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return Response.json({ error: 'Tọa độ không hợp lệ.' }, { status: 400 });
    }

    const url = new URL(NOMINATIM_REVERSE_URL);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('lat', latitude.toFixed(2));
    url.searchParams.set('lon', longitude.toFixed(2));
    url.searchParams.set('zoom', '5');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('accept-language', 'vi');

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HomNayAnGi/1.0 (+https://hom-nay-an-gi-app-rinowo205-projects.vercel.app)',
        Referer: 'https://hom-nay-an-gi-app-rinowo205-projects.vercel.app/',
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return Response.json({ region: null, area: null, source: 'nominatim' });
    }

    const data = await response.json();
    return Response.json({
      region: detectRegion(data.address || {}, data.display_name || ''),
      area: areaLabel(data.address || {}),
      source: 'nominatim',
    });
  } catch {
    return Response.json({ region: null, area: null, source: 'nominatim' });
  }
}
