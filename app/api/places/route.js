const GEOAPIFY_PLACES_URL = 'https://api.geoapify.com/v2/places';
const OVERPASS_URL = 'https://overpass.private.coffee/api/interpreter';

const DISH_SEARCH = {
  'Phở bò': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['pho', 'pho bo'] },
  'Bún chả': { categories: ['catering.restaurant.vietnamese'], terms: ['bun cha'] },
  'Bánh mì': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.sandwich'], terms: ['banh mi'] },
  'Bún bò Huế': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun bo', 'bun bo hue'] },
  'Cơm gà': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.chicken'], terms: ['com ga', 'chicken rice'] },
  'Cơm tấm': { categories: ['catering.restaurant.vietnamese'], terms: ['com tam', 'broken rice'] },
  'Bánh cuốn': { categories: ['catering.restaurant.vietnamese'], terms: ['banh cuon'] },
  'Bún riêu': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun rieu'] },
  'Bún thịt nướng': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun thit nuong'] },
  'Hủ tiếu': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['hu tieu'] },
  'Bánh canh cua': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['banh canh cua', 'banh canh'] },
  'Gỏi cuốn': { categories: ['catering.restaurant.vietnamese'], terms: ['goi cuon', 'summer roll'] },
  'Bò kho': { categories: ['catering.restaurant.vietnamese'], terms: ['bo kho'] },
  'Bún đậu mắm tôm': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun dau mam tom', 'bun dau', 'mam tom'] },
  'Bánh xèo': { categories: ['catering.restaurant.vietnamese'], terms: ['banh xeo'] },
  'Bún mắm': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun mam'] },
  'Xôi gà': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.chicken'], terms: ['xoi ga', 'sticky rice chicken'] },
  'Chả cá Lã Vọng': { categories: ['catering.restaurant.vietnamese'], terms: ['cha ca', 'la vong'] },
  'Bún thang': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun thang'] },
  'Xôi xéo': { categories: ['catering.restaurant.vietnamese'], terms: ['xoi xeo'] },
  'Bánh đa cua': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['banh da cua', 'banh da'] },
  'Bánh tôm': { categories: ['catering.restaurant.vietnamese'], terms: ['banh tom', 'ho tay'] },
  'Nem cua bể': { categories: ['catering.restaurant.vietnamese'], terms: ['nem cua be', 'nem cua'] },
  'Mì Quảng': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['mi quang'] },
  'Cao lầu': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['cao lau'] },
  'Cơm hến': { categories: ['catering.restaurant.vietnamese'], terms: ['com hen'] },
  'Bánh bèo': { categories: ['catering.restaurant.vietnamese'], terms: ['banh beo'] },
  'Nem lụi': { categories: ['catering.restaurant.vietnamese'], terms: ['nem lui'] },
  'Bánh nậm': { categories: ['catering.restaurant.vietnamese'], terms: ['banh nam'] },
  'Bánh tráng cuốn thịt heo': { categories: ['catering.restaurant.vietnamese'], terms: ['banh trang cuon thit heo', 'thit heo'] },
  'Bún chả cá': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun cha ca', 'cha ca'] },
  'Bánh căn': { categories: ['catering.restaurant.vietnamese'], terms: ['banh can'] },
  'Bánh hỏi': { categories: ['catering.restaurant.vietnamese'], terms: ['banh hoi'] },
  'Bánh khọt': { categories: ['catering.restaurant.vietnamese'], terms: ['banh khot'] },
  'Bún bò Nam Bộ': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun bo nam bo'] },
  'Bún nước lèo': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun nuoc leo'] },
  'Phá lấu': { categories: ['catering.restaurant.vietnamese'], terms: ['pha lau'] },
  Pizza: { categories: ['catering.restaurant.pizza', 'catering.restaurant.italian'], terms: ['pizza'] },
  Sushi: { categories: ['catering.restaurant.sushi', 'catering.restaurant.japanese'], terms: ['sushi'] },
  'Mì Ý': { categories: ['catering.restaurant.italian'], terms: ['mi y', 'pasta', 'spaghetti', 'italian'] },
};

function toRad(value) {
  return (value * Math.PI) / 180;
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase();
}

function dishMatchScore(dish, values = []) {
  const search = DISH_SEARCH[dish] || { terms: [dish] };
  const haystack = normalizeText(values.filter(Boolean).join(' '));
  return search.terms.reduce(
    (score, term) => score + (haystack.includes(normalizeText(term)) ? 1 : 0),
    0
  );
}

function mapsUrl(name, latitude, longitude) {
  const query = Number.isFinite(latitude) && Number.isFinite(longitude)
    ? `${name} ${latitude},${longitude}`
    : name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function sortMatchedPlaces(places) {
  return places
    .filter((place) => place.relevanceScore > 0)
    .sort(
      (a, b) =>
        b.relevanceScore - a.relevanceScore ||
        (a.distanceMeters ?? Number.MAX_SAFE_INTEGER) -
          (b.distanceMeters ?? Number.MAX_SAFE_INTEGER)
    )
    .slice(0, 10);
}

async function findWithGeoapify({ dish, latitude, longitude, radiusMeters, apiKey }) {
  const search = DISH_SEARCH[dish] || { categories: ['catering.restaurant'], terms: [dish] };
  const url = new URL(GEOAPIFY_PLACES_URL);
  url.searchParams.set('categories', search.categories.join(','));
  url.searchParams.set('filter', `circle:${longitude},${latitude},${radiusMeters}`);
  url.searchParams.set('bias', `proximity:${longitude},${latitude}`);
  url.searchParams.set('limit', '40');
  url.searchParams.set('lang', 'vi');
  url.searchParams.set('apiKey', apiKey);

  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Geoapify ${response.status}`);

  const data = await response.json();
  const places = (data.features || [])
    .map((feature) => {
      const properties = feature.properties || {};
      const latitudeValue = Number(properties.lat ?? feature.geometry?.coordinates?.[1]);
      const longitudeValue = Number(properties.lon ?? feature.geometry?.coordinates?.[0]);
      const name = String(properties.name || properties.address_line1 || '').trim();
      if (!name) return null;

      const categories = Array.isArray(properties.categories) ? properties.categories : [];
      const distanceMeters = Number.isFinite(Number(properties.distance))
        ? Math.round(Number(properties.distance))
        : Number.isFinite(latitudeValue) && Number.isFinite(longitudeValue)
          ? haversineMeters(latitude, longitude, latitudeValue, longitudeValue)
          : null;
      const relevanceScore = dishMatchScore(dish, [name, ...categories]);

      return {
        id: properties.place_id || `${longitudeValue}-${latitudeValue}-${name}`,
        name,
        address: properties.formatted || properties.address_line2 || 'Địa chỉ chưa được cập nhật',
        distanceMeters,
        latitude: latitudeValue,
        longitude: longitudeValue,
        categories,
        relevanceScore,
        mapsUrl: mapsUrl(name, latitudeValue, longitudeValue),
      };
    })
    .filter(Boolean);

  return sortMatchedPlaces(places);
}

function overpassAddress(tags = {}) {
  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ');
  const area = [tags['addr:district'], tags['addr:city']].filter(Boolean).join(', ');
  return [street, area].filter(Boolean).join(', ') || 'Địa chỉ chưa được cập nhật trên OpenStreetMap';
}

async function findWithOverpass({ dish, latitude, longitude, radiusMeters }) {
  const query = `[out:json][timeout:12];
(
  nwr(around:${radiusMeters},${latitude},${longitude})["amenity"~"^(restaurant|fast_food|food_court)$"];
);
out center tags;`;

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'User-Agent': 'HomNayAnGi/1.0',
    },
    body: `data=${encodeURIComponent(query)}`,
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`Overpass ${response.status}`);

  const data = await response.json();
  const places = (data.elements || [])
    .map((element) => {
      const tags = element.tags || {};
      const name = String(tags['name:vi'] || tags.name || '').trim();
      if (!name) return null;

      const latitudeValue = Number(element.lat ?? element.center?.lat);
      const longitudeValue = Number(element.lon ?? element.center?.lon);
      if (!Number.isFinite(latitudeValue) || !Number.isFinite(longitudeValue)) return null;

      const cuisine = tags.cuisine || '';
      const searchableValues = [
        tags['name:vi'],
        tags.name,
        tags.alt_name,
        tags.short_name,
        tags.brand,
        tags.operator,
        tags.description,
        cuisine,
      ];
      const relevanceScore = dishMatchScore(dish, searchableValues);

      return {
        id: `osm-${element.type}-${element.id}`,
        name,
        address: overpassAddress(tags),
        distanceMeters: haversineMeters(latitude, longitude, latitudeValue, longitudeValue),
        latitude: latitudeValue,
        longitude: longitudeValue,
        categories: [tags.amenity, cuisine].filter(Boolean),
        relevanceScore,
        mapsUrl: mapsUrl(name, latitudeValue, longitudeValue),
      };
    })
    .filter(Boolean);

  return sortMatchedPlaces(places);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const dish = String(body?.dish || '').trim();
    const latitude = Number(body?.latitude);
    const longitude = Number(body?.longitude);
    const radiusMeters = Math.min(Math.max(Number(body?.radiusMeters) || 3000, 500), 5000);

    if (!dish) return Response.json({ error: 'Thiếu tên món.' }, { status: 400 });

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return Response.json({ source: 'none', places: [], reason: 'location_required', attributions: [] });
    }

    const geoapifyKey = process.env.GEOAPIFY_API_KEY;
    if (geoapifyKey) {
      try {
        const places = await findWithGeoapify({ dish, latitude, longitude, radiusMeters, apiKey: geoapifyKey });
        if (places.length) {
          return Response.json({
            source: 'geoapify',
            places,
            attributions: [
              { label: 'Powered by Geoapify', url: 'https://www.geoapify.com/' },
              { label: '© OpenStreetMap contributors', url: 'https://www.openstreetmap.org/copyright' },
            ],
          });
        }
      } catch {
        // Fall through to OpenStreetMap.
      }
    }

    const places = await findWithOverpass({ dish, latitude, longitude, radiusMeters });
    return Response.json({
      source: 'openstreetmap',
      places,
      attributions: [
        { label: '© OpenStreetMap contributors', url: 'https://www.openstreetmap.org/copyright' },
      ],
    });
  } catch {
    return Response.json({ error: 'Không lấy được danh sách quán lúc này. Hãy thử lại sau.' }, { status: 502 });
  }
}


// Search aliases for regional dishes added to the reel. Keep terms shorter than the display name
// so OSM/Geoapify places do not need to include the locality suffix to be considered relevant.
Object.assign(DISH_SEARCH, {
  'Bún cá Hải Phòng': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun ca hai phong', 'bun ca'] },
  'Bánh mì cay Hải Phòng': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.sandwich'], terms: ['banh mi cay', 'banh mi que'] },
  'Chả mực Hạ Long': { categories: ['catering.restaurant.vietnamese'], terms: ['cha muc ha long', 'cha muc'] },
  'Cơm cháy Ninh Bình': { categories: ['catering.restaurant.vietnamese'], terms: ['com chay ninh binh', 'com chay'] },
  'Dê tái chanh Ninh Bình': { categories: ['catering.restaurant.vietnamese'], terms: ['de tai chanh', 'de nui'] },
  'Phở chua Lạng Sơn': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['pho chua'] },
  'Bánh cuốn Cao Bằng': { categories: ['catering.restaurant.vietnamese'], terms: ['banh cuon cao bang', 'banh cuon'] },
  'Thắng cố': { categories: ['catering.restaurant.vietnamese'], terms: ['thang co'] },
  'Bánh khoái Huế': { categories: ['catering.restaurant.vietnamese'], terms: ['banh khoai'] },
  'Bánh bột lọc Huế': { categories: ['catering.restaurant.vietnamese'], terms: ['banh bot loc', 'bot loc'] },
  'Bánh ram ít Huế': { categories: ['catering.restaurant.vietnamese'], terms: ['banh ram it', 'ram it'] },
  'Bánh canh Nam Phổ': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['banh canh nam pho', 'nam pho'] },
  'Bánh ướt thịt nướng': { categories: ['catering.restaurant.vietnamese'], terms: ['banh uot thit nuong', 'banh uot'] },
  'Bánh bao bánh vạc': { categories: ['catering.restaurant.vietnamese'], terms: ['banh bao banh vac', 'white rose'] },
  'Hoành thánh Hội An': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['hoanh thanh', 'wonton'] },
  'Cơm gà Tam Kỳ': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.chicken'], terms: ['com ga tam ky', 'com ga'] },
  'Bánh cống Cần Thơ': { categories: ['catering.restaurant.vietnamese'], terms: ['banh cong can tho', 'banh cong'] },
  'Nem nướng miền Tây': { categories: ['catering.restaurant.vietnamese'], terms: ['nem nuong mien tay', 'nem nuong'] },
  'Hủ tiếu Sa Đéc': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['hu tieu sa dec', 'sa dec'] },
  'Lẩu mắm Châu Đốc': { categories: ['catering.restaurant.vietnamese'], terms: ['lau mam chau doc', 'lau mam'] },
  'Cá lóc nướng trui': { categories: ['catering.restaurant.vietnamese'], terms: ['ca loc nuong trui'] },
  'Bột chiên Sài Gòn': { categories: ['catering.restaurant.vietnamese'], terms: ['bot chien sai gon', 'bot chien'] },
  'Bún cá Châu Đốc': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun ca chau doc', 'bun ca'] },
  'Miến gà Hà Nội': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['mien ga ha noi', 'mien ga'] },
  'Mì vằn thắn Hà Nội': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['mi van than', 'van than'] },
  'Xôi ngũ sắc Hà Giang': { categories: ['catering.restaurant.vietnamese'], terms: ['xoi ngu sac', 'five colour sticky rice'] },
  'Cháo ấu tẩu Hà Giang': { categories: ['catering.restaurant.vietnamese'], terms: ['chao au tau', 'au tau'] },
  'Bánh tam giác mạch Hà Giang': { categories: ['catering.restaurant.vietnamese'], terms: ['banh tam giac mach', 'buckwheat cake'] },
  'Thắng dền Hà Giang': { categories: ['catering.restaurant.vietnamese'], terms: ['thang den'] },
  'Bánh chưng gù Hà Giang': { categories: ['catering.restaurant.vietnamese'], terms: ['banh chung gu'] },
  'Thịt trâu gác bếp': { categories: ['catering.restaurant.vietnamese'], terms: ['trau gac bep', 'thit trau gac bep'] },
  'Lẩu cá hồi Sa Pa': { categories: ['catering.restaurant.vietnamese'], terms: ['lau ca hoi', 'ca hoi sa pa', 'salmon'] },
  'Cơm lam Bắc Mê': { categories: ['catering.restaurant.vietnamese'], terms: ['com lam bac me', 'com lam'] },
  'Bún cá sứa Nha Trang': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun ca sua', 'bun sua'] },
  'Nem nướng Nha Trang': { categories: ['catering.restaurant.vietnamese'], terms: ['nem nuong nha trang', 'nem nuong'] },
  'Bò nướng Lạc Cảnh': { categories: ['catering.restaurant.vietnamese'], terms: ['bo lac canh', 'lac canh'] },
  'Gỏi cá Nam Ô': { categories: ['catering.restaurant.vietnamese'], terms: ['goi ca nam o', 'nam o'] },
  'Bánh ép Huế': { categories: ['catering.restaurant.vietnamese'], terms: ['banh ep hue', 'banh ep'] },
  'Cơm âm phủ Huế': { categories: ['catering.restaurant.vietnamese'], terms: ['com am phu', 'am phu'] },
  'Cơm gà Hội An': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.chicken'], terms: ['com ga hoi an', 'com ga'] },
  'Bánh xoài Hội An': { categories: ['catering.restaurant.vietnamese'], terms: ['banh xoai hoi an', 'banh xoai'] },
  'Bánh hỏi lòng heo': { categories: ['catering.restaurant.vietnamese'], terms: ['banh hoi long heo', 'banh hoi'] },
  'Bánh ít lá gai': { categories: ['catering.restaurant.vietnamese'], terms: ['banh it la gai', 'banh it'] },
  'Bún cá bông điên điển Châu Đốc': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun ca bong dien dien', 'bun ca chau doc'] },
  'Bánh bò thốt nốt': { categories: ['catering.restaurant.vietnamese'], terms: ['banh bo thot not', 'thot not'] },
  'Cá kho tộ': { categories: ['catering.restaurant.vietnamese'], terms: ['ca kho to'] },
  'Bò lá lốt Sài Gòn': { categories: ['catering.restaurant.vietnamese'], terms: ['bo la lot', 'la lot'] },
  'Ốc Sài Gòn': { categories: ['catering.restaurant.vietnamese'], terms: ['oc sai gon', 'quan oc'] },
  'Bún kèn Phú Quốc': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun ken', 'bun ken phu quoc'] },
  'Bún quậy Phú Quốc': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['bun quay', 'bun quay phu quoc'] },
  'Gỏi cá trích Phú Quốc': { categories: ['catering.restaurant.vietnamese'], terms: ['goi ca trich', 'ca trich'] },
  'Cá sòng nướng Phú Quốc': { categories: ['catering.restaurant.vietnamese'], terms: ['ca song nuong', 'ca song'] },
  'Bánh canh Bến Có': { categories: ['catering.restaurant.vietnamese', 'catering.restaurant.noodle'], terms: ['banh canh ben co', 'ben co'] },
});
