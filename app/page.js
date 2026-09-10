'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

function commonsImage(fileName) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1200`;
}

const FOOD_IMAGES = {
  phobo: '/foods/pho-bo.jpg',
  phoga: '/foods/pho-ga.webp',
  buncha: '/foods/bun-cha.webp',
  banhmi: 'https://unsplash.com/photos/sCAN9M2uaS0/download?force=true&w=1200',
  bunBoHue: 'https://unsplash.com/photos/rcHHKG01IPY/download?force=true&w=1200',
  chickenRice: 'https://unsplash.com/photos/UEky3sy-y5Q/download?force=true&w=1200',
  pizza: 'https://unsplash.com/photos/Wz3u9_GtkWc/download?force=true&w=1200',
  sushi: 'https://unsplash.com/photos/o0OFVcIeCOg/download?force=true&w=1200',
  spaghetti: 'https://unsplash.com/photos/coJsSbM4yDc/download?force=true&w=1200',
  comTam: '/foods/com-tam.webp',
  banhCuon: commonsImage('Bánh cuốn trứng ở BL ng30th10n2020 (2).jpg'),
  bunRieu: commonsImage('Tô bún riêu (canh bún) ng12th8n2022 (1).jpg'),
  bunThitNuong: commonsImage('Bun thit nuong.jpg'),
  huTieu: commonsImage('Tô hủ tiếu Mỹ Tho, ng14th8n2022 (chén gan thêm) (2).jpg'),
  banhCanhCua: commonsImage('Tô bánh canh cua ở Q1 ng6th1n2022 (bánh canh bột gạo năng) (1).jpg'),
  goiCuon: commonsImage('Gỏi cuốn.jpg'),
  boKho: commonsImage('Bo kho mien Bac.jpg'),
  bunDau: commonsImage('Bún đậu mắm tôm quán 3 chị em tại Nguyễn Sơn năm 2016 (3).jpg'),
  banhXeo: commonsImage('BanhXeoatSaigon.jpg'),
  bunMam: commonsImage('Bún mắm Bạc Liêu tại đường Nguyễn Sơn tháng 7 năm 2016 (3).jpg'),
  xoiGa: commonsImage('Xôi Gà Trứng Non Lạp Xướng (Sticky rice with chicken and eggs, and chinese sausages).jpg'),
  chaCa: commonsImage('Chả cá Lã Vọng.jpg'),
  bunThang: commonsImage('Bún thang.JPG'),
  xoiXeo: commonsImage('Xôi xéo.jpg'),
  banhDaCua: commonsImage('Bánh đa cua Hải Phòng (27.2 (2).jpg'),
  banhTom: commonsImage('Bánh tôm.jpg'),
  nemCuaBe: commonsImage('Nem cua bể Hà Nội tại Nguyễn Sơn, Tân Phú, tháng 9 năm 2018 (3).jpg'),
  miQuang: '/foods/mi-quang.webp',
  caoLau: commonsImage('Cao lầu.jpg'),
  comHen: commonsImage('Com-hen-hue.jpg'),
  banhBeo: commonsImage('Banh beo.jpg'),
  nemLui: commonsImage('Nem lụi.jpg'),
  banhNam: commonsImage('Bánh Nậm.jpg'),
  banhTrangThitHeo: commonsImage('Bánh tráng cuốn thịt heo.jpg'),
  banhKhot: commonsImage('Bánh khọt.jpg'),
  bunBoNamBo: commonsImage('Bun Bo Nam Bo.jpg'),
  bunNuocLeo: commonsImage('Bun nuoc leo.jpg'),
  banhCan: commonsImage('Bánh căn 1.jpg'),
  bunChaCa: commonsImage('Bun cha ca.jpg'),
  phaLau: commonsImage('Phá lấu as served in Vietnam.jpeg'),
  banhHoi: commonsImage('Bánh hỏi trình bày trên đĩa.jpg'),
};

const DISHES = [
  { name: 'Phở bò', category: 'Bún / Mì / Phở', price: '45–80k', fromPrice: 45000, image: FOOD_IMAGES.phobo, regions: ['north', 'all'] },
  { name: 'Phở gà', category: 'Bún / Mì / Phở', price: '45–80k', fromPrice: 45000, image: FOOD_IMAGES.phoga, regions: ['north', 'all'] },
  { name: 'Bún chả', category: 'Món Việt', price: '40–70k', fromPrice: 40000, image: FOOD_IMAGES.buncha, regions: ['north'] },
  { name: 'Bánh mì', category: 'Món Việt', price: '20–45k', fromPrice: 20000, image: FOOD_IMAGES.banhmi, regions: ['all'] },
  { name: 'Bún bò Huế', category: 'Bún / Mì / Phở', price: '45–75k', fromPrice: 45000, image: FOOD_IMAGES.bunBoHue, regions: ['central'] },
  { name: 'Cơm gà', category: 'Cơm', price: '45–90k', fromPrice: 45000, image: FOOD_IMAGES.chickenRice, regions: ['central', 'all'] },
  { name: 'Cơm tấm', category: 'Cơm', price: '40–85k', fromPrice: 40000, image: FOOD_IMAGES.comTam, regions: ['south'] },
  { name: 'Bánh cuốn', category: 'Món Việt', price: '30–60k', fromPrice: 30000, image: FOOD_IMAGES.banhCuon, regions: ['north', 'all'] },
  { name: 'Bún riêu', category: 'Bún / Mì / Phở', price: '35–65k', fromPrice: 35000, image: FOOD_IMAGES.bunRieu, regions: ['north', 'all'] },
  { name: 'Bún thịt nướng', category: 'Bún / Mì / Phở', price: '40–75k', fromPrice: 40000, image: FOOD_IMAGES.bunThitNuong, regions: ['central', 'south'] },
  { name: 'Hủ tiếu', category: 'Bún / Mì / Phở', price: '35–70k', fromPrice: 35000, image: FOOD_IMAGES.huTieu, regions: ['south'] },
  { name: 'Bánh canh cua', category: 'Bún / Mì / Phở', price: '45–95k', fromPrice: 45000, image: FOOD_IMAGES.banhCanhCua, regions: ['south'] },
  { name: 'Gỏi cuốn', category: 'Món Việt', price: '30–60k', fromPrice: 30000, image: FOOD_IMAGES.goiCuon, regions: ['all'] },
  { name: 'Bò kho', category: 'Món Việt', price: '45–90k', fromPrice: 45000, image: FOOD_IMAGES.boKho, regions: ['all'] },
  { name: 'Bún đậu mắm tôm', category: 'Món Việt', price: '40–90k', fromPrice: 40000, image: FOOD_IMAGES.bunDau, regions: ['north'] },
  { name: 'Bánh xèo', category: 'Món Việt', price: '40–100k', fromPrice: 40000, image: FOOD_IMAGES.banhXeo, regions: ['central', 'south', 'all'] },
  { name: 'Bún mắm', category: 'Bún / Mì / Phở', price: '45–80k', fromPrice: 45000, image: FOOD_IMAGES.bunMam, regions: ['south'] },
  { name: 'Xôi gà', category: 'Món Việt', price: '30–60k', fromPrice: 30000, image: FOOD_IMAGES.xoiGa, regions: ['all'] },
  { name: 'Chả cá Lã Vọng', category: 'Món Việt', price: '90–180k', fromPrice: 90000, image: FOOD_IMAGES.chaCa, regions: ['north'] },
  { name: 'Bún thang', category: 'Bún / Mì / Phở', price: '45–80k', fromPrice: 45000, image: FOOD_IMAGES.bunThang, regions: ['north'] },
  { name: 'Xôi xéo', category: 'Món Việt', price: '20–45k', fromPrice: 20000, image: FOOD_IMAGES.xoiXeo, regions: ['north'] },
  { name: 'Bánh đa cua', category: 'Bún / Mì / Phở', price: '40–75k', fromPrice: 40000, image: FOOD_IMAGES.banhDaCua, regions: ['north'] },
  { name: 'Bánh tôm', category: 'Món Việt', price: '60–120k', fromPrice: 60000, image: FOOD_IMAGES.banhTom, regions: ['north'] },
  { name: 'Nem cua bể', category: 'Món Việt', price: '50–100k', fromPrice: 50000, image: FOOD_IMAGES.nemCuaBe, regions: ['north', 'all'] },
  { name: 'Mì Quảng', category: 'Bún / Mì / Phở', price: '40–75k', fromPrice: 40000, image: FOOD_IMAGES.miQuang, regions: ['central'] },
  { name: 'Cao lầu', category: 'Bún / Mì / Phở', price: '45–80k', fromPrice: 45000, image: FOOD_IMAGES.caoLau, regions: ['central'] },
  { name: 'Cơm hến', category: 'Cơm', price: '30–60k', fromPrice: 30000, image: FOOD_IMAGES.comHen, regions: ['central'] },
  { name: 'Bánh bèo', category: 'Món Việt', price: '30–65k', fromPrice: 30000, image: FOOD_IMAGES.banhBeo, regions: ['central'] },
  { name: 'Nem lụi', category: 'Món Việt', price: '45–90k', fromPrice: 45000, image: FOOD_IMAGES.nemLui, regions: ['central'] },
  { name: 'Bánh nậm', category: 'Món Việt', price: '30–60k', fromPrice: 30000, image: FOOD_IMAGES.banhNam, regions: ['central'] },
  { name: 'Bánh tráng cuốn thịt heo', category: 'Món Việt', price: '60–120k', fromPrice: 60000, image: FOOD_IMAGES.banhTrangThitHeo, regions: ['central', 'all'] },
  { name: 'Bún chả cá', category: 'Bún / Mì / Phở', price: '40–75k', fromPrice: 40000, image: FOOD_IMAGES.bunChaCa, regions: ['central'] },
  { name: 'Bánh căn', category: 'Món Việt', price: '30–70k', fromPrice: 30000, image: FOOD_IMAGES.banhCan, regions: ['central'] },
  { name: 'Bánh hỏi', category: 'Món Việt', price: '40–85k', fromPrice: 40000, image: FOOD_IMAGES.banhHoi, regions: ['central', 'south'] },
  { name: 'Bánh khọt', category: 'Món Việt', price: '40–90k', fromPrice: 40000, image: FOOD_IMAGES.banhKhot, regions: ['south'] },
  { name: 'Bún bò Nam Bộ', category: 'Bún / Mì / Phở', price: '50–90k', fromPrice: 50000, image: FOOD_IMAGES.bunBoNamBo, regions: ['south'] },
  { name: 'Bún nước lèo', category: 'Bún / Mì / Phở', price: '40–75k', fromPrice: 40000, image: FOOD_IMAGES.bunNuocLeo, regions: ['south'] },
  { name: 'Phá lấu', category: 'Món Việt', price: '35–75k', fromPrice: 35000, image: FOOD_IMAGES.phaLau, regions: ['south'] },
  { name: 'Pizza', category: 'Đồ Tây', price: '90–220k', fromPrice: 90000, image: FOOD_IMAGES.pizza, regions: [] },
  { name: 'Sushi', category: 'Đồ Nhật', price: '120–280k', fromPrice: 120000, image: FOOD_IMAGES.sushi, regions: [] },
  { name: 'Mì Ý', category: 'Đồ Tây', price: '80–180k', fromPrice: 80000, image: FOOD_IMAGES.spaghetti, regions: [] },
];

const DISTANCES = [1, 3, 5];
const BUDGETS = ['< 50k', '< 100k', '< 200k', 'Kệ giá'];
const BUDGET_LIMITS = { '< 50k': 50000, '< 100k': 100000, '< 200k': 200000, 'Kệ giá': null };
const CATEGORIES = ['Tất cả', 'Cơm', 'Bún / Mì / Phở', 'Món Việt', 'Đồ Nhật', 'Đồ Tây'];
const REGION_OPTIONS = [
  { id: 'auto', label: 'Theo vị trí' },
  { id: 'all', label: 'Cả nước' },
  { id: 'north', label: 'Miền Bắc' },
  { id: 'central', label: 'Miền Trung' },
  { id: 'south', label: 'Miền Nam' },
];
const REGION_LABELS = { north: 'Miền Bắc', central: 'Miền Trung', south: 'Miền Nam' };
const REEL_DURATION = 5000;
const REEL_WINNER_INDEX = 64;
const REEL_ITEM_COUNT = 72;
const HISTORY_STORAGE_KEY = 'hom-nay-an-gi:history:v1';
const BLOCKED_STORAGE_KEY = 'hom-nay-an-gi:blocked:v1';
const BLOCK_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_HISTORY = 6;

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function pickReelDish(pool, excludedNames) {
  const candidates = pool.filter((dish) => !excludedNames.has(dish.name));
  const source = candidates.length ? candidates : pool;
  return source[Math.floor(Math.random() * source.length)];
}

function buildReel(pool, winner) {
  const items = [];

  for (let index = 0; index < REEL_ITEM_COUNT; index += 1) {
    if (index === REEL_WINNER_INDEX) {
      items.push(winner);
      continue;
    }

    const excludedNames = new Set();
    const previousDish = items[index - 1];
    if (previousDish) excludedNames.add(previousDish.name);
    if (index === REEL_WINNER_INDEX - 1) excludedNames.add(winner.name);

    items.push(pickReelDish(pool, excludedNames));
  }

  return { items, winnerIndex: REEL_WINNER_INDEX };
}

function weightedPool(dishes, regionMode, detectedRegion) {
  if (regionMode !== 'auto' || !detectedRegion) return dishes;
  return dishes.flatMap((dish) => {
    if (dish.regions.includes(detectedRegion)) return [dish, dish, dish, dish];
    if (dish.regions.includes('all')) return [dish, dish];
    return [dish];
  });
}

function formatHistoryTime(timestamp) {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  } catch {
    return '';
  }
}

function grabFoodUrl(searchText) {
  const value = encodeURIComponent(searchText);
  return `https://food.grab.com/vn/vi/restaurants?search=${value}&searchParameter=${value}&support-deeplink=true`;
}

function shopeeFoodUrl(searchText) {
  return `https://shopeefood.vn/ha-noi/danh-sach-dia-diem-giao-tan-noi?q=${encodeURIComponent(searchText)}`;
}

export default function Home() {
  const [distance, setDistance] = useState(3);
  const [budget, setBudget] = useState('< 100k');
  const [category, setCategory] = useState('Tất cả');
  const [regionMode, setRegionMode] = useState('auto');
  const [detectedRegion, setDetectedRegion] = useState(null);
  const [detectedArea, setDetectedArea] = useState(null);
  const [regionState, setRegionState] = useState('idle');
  const [selectedDish, setSelectedDish] = useState(null);
  const [places, setPlaces] = useState([]);
  const [source, setSource] = useState(null);
  const [attributions, setAttributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [preferenceNotice, setPreferenceNotice] = useState('');
  const [placeSort, setPlaceSort] = useState('recommended');
  const [locationState, setLocationState] = useState('idle');
  const [spinning, setSpinning] = useState(false);
  const [reelItems, setReelItems] = useState(DISHES);
  const [reelOffset, setReelOffset] = useState(0);
  const [reelTransitioning, setReelTransitioning] = useState(false);
  const [blockedDishes, setBlockedDishes] = useState({});
  const [history, setHistory] = useState([]);

  const reelViewportRef = useRef(null);
  const reelStripRef = useRef(null);

  const baseEligibleDishes = useMemo(() => {
    const limit = BUDGET_LIMITS[budget];
    return DISHES.filter((dish) => {
      const categoryMatched = category === 'Tất cả' || dish.category === category;
      const budgetMatched = limit == null || dish.fromPrice <= limit;
      const regionMatched =
        regionMode === 'auto' ||
        regionMode === 'all' ||
        dish.regions.includes(regionMode) ||
        dish.regions.includes('all');
      return categoryMatched && budgetMatched && regionMatched;
    });
  }, [budget, category, regionMode]);

  const eligibleDishes = useMemo(
    () => baseEligibleDishes.filter((dish) => !blockedDishes[dish.name]),
    [baseEligibleDishes, blockedDishes]
  );

  const blockedCount = useMemo(() => Object.keys(blockedDishes).length, [blockedDishes]);

  const sortedPlaces = useMemo(() => {
    const copy = [...places];
    if (placeSort === 'recommended') {
      return copy.sort(
        (a, b) =>
          (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0) ||
          (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity)
      );
    }
    return copy.sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));
  }, [places, placeSort]);

  useEffect(() => {
    const now = Date.now();
    try {
      const storedBlocked = JSON.parse(window.localStorage.getItem(BLOCKED_STORAGE_KEY) || '{}');
      const activeBlocked = Object.fromEntries(
        Object.entries(storedBlocked).filter(([, blockedUntil]) => Number(blockedUntil) > now)
      );
      setBlockedDishes(activeBlocked);
      window.localStorage.setItem(BLOCKED_STORAGE_KEY, JSON.stringify(activeBlocked));
    } catch {
      window.localStorage.removeItem(BLOCKED_STORAGE_KEY);
    }

    try {
      const storedHistory = JSON.parse(window.localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
      setHistory(Array.isArray(storedHistory) ? storedHistory.slice(0, MAX_HISTORY) : []);
    } catch {
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    setReelItems(
      eligibleDishes.length
        ? eligibleDishes
        : baseEligibleDishes.length
          ? baseEligibleDishes
          : DISHES
    );
    setReelOffset(0);
    setReelTransitioning(false);
  }, [eligibleDishes, baseEligibleDishes]);

  function saveHistory(dish) {
    const entry = {
      name: dish.name,
      category: dish.category,
      price: dish.price,
      image: dish.image,
      createdAt: Date.now(),
    };
    setHistory((current) => {
      const next = [entry, ...current.filter((item) => item.name !== dish.name)].slice(0, MAX_HISTORY);
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function blockDish(dishName) {
    const next = { ...blockedDishes, [dishName]: Date.now() + BLOCK_DURATION_MS };
    setBlockedDishes(next);
    window.localStorage.setItem(BLOCKED_STORAGE_KEY, JSON.stringify(next));
    setPreferenceNotice(`${dishName} sẽ không xuất hiện trong vòng quay trong 7 ngày trên trình duyệt này.`);
  }

  function clearBlockedDishes() {
    setBlockedDishes({});
    window.localStorage.removeItem(BLOCKED_STORAGE_KEY);
    setPreferenceNotice('Đã đưa toàn bộ món bị ẩn trở lại vòng quay.');
  }

  function clearHistory() {
    setHistory([]);
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  }

  async function detectRegion(coords) {
    if (!coords) return null;
    setRegionState('detecting');
    try {
      const response = await fetch('/api/region', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coords),
      });
      const data = await response.json();
      const region = data?.region || null;
      setDetectedRegion(region);
      setDetectedArea(data?.area || null);
      setRegionState(region ? 'ready' : 'unknown');
      return region;
    } catch {
      setDetectedRegion(null);
      setDetectedArea(null);
      setRegionState('unknown');
      return null;
    }
  }

  async function findPlaces(dish, coords) {
    if (!coords) {
      setPlaces([]);
      setSource('none');
      setAttributions([]);
      setNotice('Cần cho phép vị trí để xem địa điểm tham khảo gần bạn.');
      return;
    }

    try {
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dish: dish.name,
          latitude: coords.latitude,
          longitude: coords.longitude,
          radiusMeters: distance * 1000,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Không lấy được danh sách quán');

      setPlaces(data.places || []);
      setSource(data.source || 'openstreetmap');
      setAttributions(data.attributions || []);
      setPlaceSort('recommended');
      setNotice(
        (data.places || []).length
          ? ''
          : 'OpenStreetMap chưa có địa điểm nào ghi rõ món này trong bán kính đã chọn. Bạn vẫn có thể tìm trực tiếp trên GrabFood hoặc ShopeeFood ở phía trên.'
      );
    } catch {
      setPlaces([]);
      setSource('error');
      setAttributions([]);
      setPlaceSort('recommended');
      setNotice('Nguồn bản đồ miễn phí đang bận. Bạn vẫn có thể tìm món trực tiếp trên GrabFood hoặc ShopeeFood.');
    }
  }

  function getPosition() {
    setLocationState('requesting');
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationState('unavailable');
        return resolve(null);
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationState('granted');
          resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        },
        () => {
          setLocationState('denied');
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 120000 }
      );
    });
  }

  async function spin() {
    if (spinning || eligibleDishes.length === 0) {
      if (!spinning) {
        setPreferenceNotice('Không còn món phù hợp. Hãy nới tầm giá, đổi nhóm món hoặc hiện lại món đã ẩn.');
      }
      return;
    }

    setSpinning(true);
    setPreferenceNotice('');

    let coordsPromise;
    let currentRegion = detectedRegion;
    if (regionMode === 'auto' && !detectedRegion) {
      const coords = await getPosition();
      coordsPromise = Promise.resolve(coords);
      currentRegion = await detectRegion(coords);
    } else {
      coordsPromise = getPosition();
    }

    const selectionPool = weightedPool(eligibleDishes, regionMode, currentRegion);
    const hasAlternative = selectedDish && selectionPool.some((dish) => dish.name !== selectedDish.name);
    const rerollPool = hasAlternative
      ? selectionPool.filter((dish) => dish.name !== selectedDish.name)
      : selectionPool;
    const dish = rerollPool[Math.floor(Math.random() * rerollPool.length)];
    const { items, winnerIndex } = buildReel(selectionPool, dish);

    setSelectedDish(null);
    setPlaces([]);
    setNotice('');
    setSource(null);
    setAttributions([]);
    setLoading(false);
    setReelTransitioning(false);
    setReelOffset(0);
    setReelItems(items);

    await new Promise((resolve) =>
      window.requestAnimationFrame(() => window.requestAnimationFrame(resolve))
    );

    const viewport = reelViewportRef.current;
    const strip = reelStripRef.current;
    const firstCard = strip?.querySelector('.reel-card');

    if (viewport && strip && firstCard) {
      const cardWidth = firstCard.getBoundingClientRect().width;
      const styles = window.getComputedStyle(strip);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
      const viewportWidth = viewport.getBoundingClientRect().width;
      const targetOffset = viewportWidth / 2 - (winnerIndex * (cardWidth + gap) + cardWidth / 2);
      setReelTransitioning(true);
      setReelOffset(targetOffset);
    }

    await sleep(REEL_DURATION + 100);
    setSpinning(false);
    setReelTransitioning(false);
    setSelectedDish(dish);
    saveHistory(dish);
    setLoading(true);

    const coords = await coordsPromise;
    await findPlaces(dish, coords);
    setLoading(false);
    window.setTimeout(
      () => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      120
    );
  }

  const locationLabel = {
    idle: 'Chưa dùng vị trí',
    requesting: 'Đang lấy vị trí…',
    granted: 'Đã lấy vị trí',
    denied: 'Chưa cấp vị trí',
    unavailable: 'Không hỗ trợ vị trí',
  }[locationState];

  const sourceLabel = {
    geoapify: 'GEOAPIFY + OSM',
    openstreetmap: 'OPENSTREETMAP',
    none: 'CẦN VỊ TRÍ',
    error: 'TẠM GIÁN ĐOẠN',
  }[source];

  const regionHint =
    regionMode !== 'auto'
      ? `Đang lọc theo ${REGION_OPTIONS.find((item) => item.id === regionMode)?.label || 'khu vực đã chọn'}.`
      : regionState === 'detecting'
        ? 'Đang xác định vùng ẩm thực từ vị trí của bạn…'
        : detectedRegion
          ? `Đang ưu tiên món ${REGION_LABELS[detectedRegion]}${detectedArea ? ` theo vị trí ${detectedArea}` : ''}.`
          : 'Theo vị trí sẽ tự ưu tiên món Bắc / Trung / Nam khi bạn quay.';

  const noEligibleDishes = eligibleDishes.length === 0;
  const displayedPlaces = sortedPlaces;

  return (
    <main className="page-shell">
      <header className="site-header shell">
        <a className="brand" href="#top">Hôm Nay Ăn Gì?</a>
        <div className="header-status">
          <span className={`location-state ${locationState}`}>{locationLabel}</span>
          <span className="version-badge">v1.0</span>
        </div>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <span className="eyebrow">Không biết ăn gì?</span>
          <h1>Quay một vòng.<br />Chốt một món.</h1>
          <p className="hero-text">Chọn khoảng cách, tầm giá, gu ăn và vùng ẩm thực.</p>
          <button className="primary-cta" onClick={spin} disabled={spinning || noEligibleDishes}>
            {spinning ? 'CHỜ XÍU…' : noEligibleDishes ? 'CHƯA CÓ MÓN PHÙ HỢP' : 'QUAY MÓN NGAY'}
          </button>
        </div>

        <div className="food-grid" aria-label="Món ăn gợi ý">
          <figure className="food-tile food-tile-large">
            <img src={FOOD_IMAGES.buncha} alt="Bún chả" />
            <figcaption><strong>Bún chả</strong><span>40–70k</span></figcaption>
          </figure>
          <figure className="food-tile">
            <img src={FOOD_IMAGES.miQuang} alt="Mì Quảng" />
            <figcaption><strong>Mì Quảng</strong><span>40–75k</span></figcaption>
          </figure>
          <figure className="food-tile">
            <img src={FOOD_IMAGES.comTam} alt="Cơm tấm" />
            <figcaption><strong>Cơm tấm</strong><span>40–85k</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="filter-panel shell" aria-label="Bộ lọc món ăn">
        <div className="filter-group">
          <div className="filter-label"><span>01</span><strong>Đi bao xa?</strong></div>
          <div className="option-row">
            {DISTANCES.map((item) => (
              <button key={item} disabled={spinning} className={distance === item ? 'choice active' : 'choice'} onClick={() => setDistance(item)}>{item} km</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-label"><span>02</span><strong>Tầm giá?</strong></div>
          <div className="option-row">
            {BUDGETS.map((item) => (
              <button key={item} disabled={spinning} className={budget === item ? 'choice active' : 'choice'} onClick={() => setBudget(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="filter-group filter-group-wide">
          <div className="filter-label">
            <span>03</span><strong>Đang thèm gì?</strong>
            <small>{eligibleDishes.length} món phù hợp{blockedCount ? ` · ${blockedCount} món đang ẩn` : ''}</small>
            {blockedCount > 0 && <button className="inline-action" onClick={clearBlockedDishes} disabled={spinning}>Hiện lại</button>}
          </div>
          <div className="option-row wrap">
            {CATEGORIES.map((item) => (
              <button key={item} disabled={spinning} className={category === item ? 'choice active' : 'choice'} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="filter-group filter-group-wide region-filter-group">
          <div className="filter-label"><span>04</span><strong>Ăn kiểu vùng nào?</strong></div>
          <div className="option-row wrap">
            {REGION_OPTIONS.map((item) => (
              <button key={item.id} disabled={spinning} className={regionMode === item.id ? 'choice active' : 'choice'} onClick={() => setRegionMode(item.id)}>{item.label}</button>
            ))}
          </div>
          <p className="region-hint">{regionHint}</p>
          {noEligibleDishes && <p className="filter-empty">Không có món nào khớp bộ lọc hiện tại. Hãy tăng tầm giá, đổi nhóm món, đổi vùng hoặc hiện lại món đã ẩn.</p>}
        </div>
      </section>

      <section className="case-section shell">
        <div className="case-card">
          <div className="case-header">
            <div>
              <span className="kicker">Food Case</span>
              <h2>{spinning ? 'Chờ xíu, món ngon sắp được chốt…' : noEligibleDishes ? 'Chỉnh bộ lọc để có món rồi quay.' : 'Món nào dừng đúng vạch thì ăn món đó.'}</h2>
              <p>5 giây · nhiều vòng · kết quả chỉ hiện sau khi reel dừng.</p>
            </div>
            <button className="spin-button" onClick={spin} disabled={spinning || noEligibleDishes}>{spinning ? 'CHỜ XÍU…' : 'QUAY'}</button>
          </div>

          <div className={spinning ? 'reel-viewport spinning' : 'reel-viewport'} ref={reelViewportRef}>
            <div className="reel-fade reel-fade-left" />
            <div className="reel-fade reel-fade-right" />
            <div className="center-marker"><span>CHỐT</span></div>
            <div className="reel-strip" ref={reelStripRef} style={{ transform: `translate3d(${reelOffset}px,0,0)`, transition: reelTransitioning ? `transform ${REEL_DURATION}ms cubic-bezier(.06,.78,.14,1)` : 'none' }}>
              {reelItems.map((dish, index) => (
                <article className="reel-card" key={`${dish.name}-${index}`}>
                  <img src={dish.image} alt={dish.name} />
                  <div className="reel-card-body"><span className="dish-category">{dish.category}</span><strong>{dish.name}</strong><span className="dish-price">{dish.price}</span></div>
                </article>
              ))}
            </div>
          </div>
          <div className="case-footer"><span>{budget}</span><span>{distance} km</span><span>{category}</span><span>{regionMode === 'auto' && detectedRegion ? REGION_LABELS[detectedRegion] : REGION_OPTIONS.find((item) => item.id === regionMode)?.label}</span></div>
        </div>
      </section>

      {selectedDish && (
        <section className="result shell" id="result">
          <article className="winner-card">
            <img src={selectedDish.image} alt={selectedDish.name} />
            <div className="winner-copy">
              <span className="kicker">Hôm nay ăn</span>
              <h2>{selectedDish.name}</h2>
              <p>{selectedDish.category} · khoảng {selectedDish.price}</p>
              <div className="winner-actions">
                <button className="secondary-cta" onClick={spin} disabled={spinning || noEligibleDishes}>Quay lại món khác</button>
                <button className="quiet-cta" onClick={() => blockDish(selectedDish.name)} disabled={Boolean(blockedDishes[selectedDish.name])}>{blockedDishes[selectedDish.name] ? 'Đã ẩn 7 ngày' : 'Ẩn món này 7 ngày'}</button>
              </div>
              {preferenceNotice && <p className="preference-notice">{preferenceNotice}</p>}
            </div>
          </article>

          <div className="delivery-search-panel">
            <div>
              <span className="delivery-search-kicker">Đặt món trực tiếp</span>
              <strong>Tìm “{selectedDish.name}” trên nền tảng giao đồ ăn</strong>
              <p>GrabFood và ShopeeFood sẽ tự dùng danh sách quán, menu và khu vực giao hàng của chính họ nên phù hợp hơn để kiểm tra món nào thực sự đang bán.</p>
            </div>
            <div className="delivery-search-actions">
              <a className="platform-search grab-search" href={grabFoodUrl(selectedDish.name)} target="_blank" rel="noreferrer">Tìm trên GrabFood</a>
              <a className="platform-search shopee-search" href={shopeeFoodUrl(selectedDish.name)} target="_blank" rel="noreferrer">Tìm trên ShopeeFood</a>
            </div>
          </div>

          {!loading && (
            <section className="place-block">
              <div className="place-heading">
                <div>
                  <span className="kicker">Quán gần bạn trên bản đồ</span>
                  <h3>{`${places.length} chỗ tham khảo`}</h3>
                  <p>OpenStreetMap chỉ dùng để tham khảo địa điểm gần bạn. Muốn biết quán nào đang bán và giao được món này, dùng GrabFood hoặc ShopeeFood ở phía trên.</p>
                </div>
                {sourceLabel && <span className="source-tag">{sourceLabel}</span>}
              </div>

              <div className="place-toolbar">
                <span>Sắp xếp:</span>
                <button className={placeSort === 'recommended' ? 'sort active' : 'sort'} onClick={() => setPlaceSort('recommended')}>Phù hợp món</button>
                <button className={placeSort === 'near' ? 'sort active' : 'sort'} onClick={() => setPlaceSort('near')}>Gần nhất</button>
              </div>

              {notice && <div className="notice">{notice}</div>}

              <div className="place-list">
                {displayedPlaces.map((place, index) => (
                  <article className="place-row" key={place.id || index}>
                    <img src={selectedDish.image} alt={`Ảnh minh họa ${selectedDish.name}`} />
                    <div className="place-content">
                      <div className="place-title-row">
                        <span className="place-rank">{String(index + 1).padStart(2, '0')}</span>
                        <div><h4>{place.name}</h4><p>{place.address}</p></div>
                      </div>
                      <div className="place-meta">
                        <span>{place.distanceMeters != null ? `${(place.distanceMeters / 1000).toFixed(1)} km` : 'Chưa có khoảng cách'}</span>
                        <span>{source === 'geoapify' ? 'Geoapify / OSM' : 'OpenStreetMap'}</span>
                      </div>
                    </div>
                    <div className="place-actions delivery-actions">
                      <a className="map-link" href={place.mapsUrl} target="_blank" rel="noreferrer">Maps</a>
                    </div>
                  </article>
                ))}
              </div>

              {attributions.length > 0 && (
                <div className="data-attribution">Nguồn dữ liệu:{' '}{attributions.map((item, index) => <span key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.label}</a>{index < attributions.length - 1 ? ' · ' : ''}</span>)}</div>
              )}

              <p className="delivery-note">GrabFood và ShopeeFood được mở qua trang tìm kiếm web theo món vừa quay; app không gọi API nội bộ và không scrape dữ liệu của hai nền tảng.</p>
            </section>
          )}
        </section>
      )}

      {history.length > 0 && (
        <section className="history-section shell" aria-label="Lịch sử quay gần đây">
          <div className="history-heading">
            <div><span className="kicker">Gần đây</span><h3>Mấy món vừa quay</h3></div>
            <button className="inline-action" onClick={clearHistory}>Xóa lịch sử</button>
          </div>
          <div className="history-grid">
            {history.map((item) => (
              <article className="history-card" key={`${item.name}-${item.createdAt}`}>
                <img src={item.image} alt={item.name} />
                <div><strong>{item.name}</strong><span>{item.category} · {item.price}</span><small>{formatHistoryTime(item.createdAt)}</small></div>
              </article>
            ))}
          </div>
          <p className="history-note">Lịch sử và món bị ẩn chỉ lưu trên trình duyệt này, không cần tài khoản hay database.</p>
        </section>
      )}

      <footer className="shell footer"><strong>Hôm Nay Ăn Gì?</strong><span>OpenStreetMap · GrabFood · ShopeeFood · không database</span></footer>
    </main>
  );
}
