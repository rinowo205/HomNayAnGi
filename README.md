# Hôm Nay Ăn Gì?

MVP web giúp người dùng chốt món trong một vòng quay 5 giây, sau đó mở tìm kiếm món trên GrabFood/ShopeeFood và tham khảo địa điểm gần vị trí hiện tại bằng dữ liệu mở.

## Chức năng

- Không cần đăng nhập, không database.
- Lọc theo bán kính, ngân sách, nhóm món và vùng ẩm thực.
- Có 40 món; các món Việt được gắn vùng Bắc / Trung / Nam, một số món phổ biến toàn quốc được gắn `all`.
- Chế độ `Theo vị trí` dùng tọa độ trình duyệt để xác định vùng, sau đó tăng trọng số món cùng vùng trong vòng quay thay vì loại sạch món vùng khác.
- Khi người dùng chọn thẳng `Miền Bắc`, `Miền Trung` hoặc `Miền Nam`, reel lọc cứng theo vùng đã chọn và vẫn giữ các món `all`.
- Reel 5 giây, chạy qua nhiều card rồi dừng đúng món thắng.
- Không lặp lại ngay món vừa quay nếu còn món khác phù hợp.
- Có thể ẩn một món khỏi vòng quay trong 7 ngày.
- Lịch sử 6 món gần nhất lưu bằng localStorage trên trình duyệt.
- Sau khi chốt món, có nút tìm trực tiếp tên món trên GrabFood và ShopeeFood.
- OpenStreetMap/Geoapify chỉ dùng cho danh sách địa điểm tham khảo gần người dùng, không được coi là nguồn xác nhận quán có bán món.
- Nguồn địa điểm mặc định: OpenStreetMap qua Overpass, không cần API key và không cần billing Google.
- Có thể cấu hình Geoapify free tier; khi có key app ưu tiên Geoapify rồi fallback về OpenStreetMap.
- Không gọi API nội bộ, không scrape và không reverse-engineer Grab/ShopeeFood.
- Nếu người dùng không cấp vị trí, app vẫn quay món và mở được GrabFood/ShopeeFood nhưng không có danh sách địa điểm gần.

## Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000.

## Geoapify (không bắt buộc)

App chạy được mà không cần key. Nếu muốn dùng Geoapify free tier, tạo `.env.local` từ `.env.example`:

```bash
GEOAPIFY_API_KEY=your_key_here
```

Key chỉ được đọc ở server route `/api/places`, không expose ra client.

## Xác định vùng theo vị trí

Route `/api/region` reverse-geocode tọa độ qua Nominatim/OpenStreetMap để lấy tỉnh/thành rồi map về `north`, `central` hoặc `south`.

- Chỉ gọi khi người dùng chọn `Theo vị trí` và bắt đầu quay lần đầu trong session.
- Tọa độ được làm tròn 2 chữ số thập phân trước khi gửi tới Nominatim.
- Request dùng User-Agent nhận diện app và cache/revalidate 24 giờ để giảm tải dịch vụ public.
- Nếu reverse-geocode không xác định được vùng, app vẫn quay bình thường và người dùng có thể chọn vùng thủ công.

## OpenStreetMap

Khi không có `GEOAPIFY_API_KEY`, route `/api/places` dùng Overpass để tìm `restaurant`, `fast_food` và `food_court` quanh tọa độ người dùng. Kết quả hiển thị attribution OpenStreetMap theo yêu cầu dữ liệu nguồn.

## GrabFood / ShopeeFood

- GrabFood: mở trang search public theo đúng tên món vừa quay.
- ShopeeFood: mở URL search public theo đúng tên món vừa quay; hiện route đang dùng scope Hà Nội.
- App không gọi endpoint nội bộ của hai nền tảng.

## Deploy Vercel

- Framework: Next.js
- Build command: `npm run build`
- Không cần environment variable để chạy với OpenStreetMap.
- `GEOAPIFY_API_KEY` chỉ là tuỳ chọn.
