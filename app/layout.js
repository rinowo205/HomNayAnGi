import './globals.css';

export const metadata = {
  title: 'Hôm Nay Ăn Gì?',
  description: 'Quay một món, tìm quán gần bạn và đi ăn.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
