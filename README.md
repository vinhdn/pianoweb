# Piano Beauty - Website Giới Thiệu Đàn Piano

Website thương mại điện tử giới thiệu sản phẩm đàn piano, xây dựng với Next.js 15, PostgreSQL và Prisma.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + Custom components |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Auth | NextAuth.js v5 |
| Icons | Lucide React |
| Deploy | Docker + Dokploy |

## Tính Năng

### Người Dùng (Frontend)
- Homepage với hero banner, sản phẩm nổi bật, danh mục
- Danh sách danh mục, duyệt sản phẩm theo danh mục
- Trang chi tiết sản phẩm với gallery ảnh, thông số kỹ thuật
- Giỏ hàng (Cart) - lưu local storage
- So sánh sản phẩm (tối đa 3 sản phẩm)
- Chia sẻ sản phẩm (Web Share API)
- Đánh giá & bình luận sản phẩm
- Tìm kiếm sản phẩm
- Đăng ký / Đăng nhập

### Admin Panel (/admin)
- Dashboard tổng quan
- Quản lý sản phẩm (CRUD + upload ảnh)
- Quản lý danh mục (CRUD + danh mục cha/con)
- Duyệt đánh giá của người dùng

### SEO
- Server-Side Rendering (SSR) cho tất cả trang sản phẩm
- Dynamic metadata (title, description, OG tags)
- JSON-LD structured data (Product schema)
- Sitemap tự động (/sitemap.xml)
- Robots.txt (/robots.txt)
- Canonical URLs

## Cài Đặt Dev

```bash
# 1. Copy env file
cp .env.example .env.local
# Điền các giá trị vào .env.local

# 2. Cài dependencies
npm install

# 3. Tạo database schema
npx prisma db push

# 4. Seed data mẫu
npm run db:seed

# 5. Chạy dev server
npm run dev
```

Admin mặc định: admin@pianobeauty.vn / Admin@123456

## Deploy Lên Dokploy (VPS)

### Bước 1: Chuẩn bị VPS
```bash
curl -fsSL https://get.docker.com | sh
```

### Bước 2: Cấu hình Environment Variables trong Dokploy
```env
POSTGRES_PASSWORD=<strong_password>
NEXTAUTH_SECRET=<random_32_char_string>
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_URL=https://yourdomain.com
```

### Bước 3: Deploy thủ công qua SSH
```bash
git clone <your-repo>
cd pianobeauty
cp .env.example .env
# Điền values vào .env
docker compose up -d --build

# Migrate database
docker compose exec app npx prisma migrate deploy

# Seed dữ liệu ban đầu
docker compose exec app npm run db:seed
```

## Cấu Trúc Thư Mục

```
src/
├── app/
│   ├── (shop)/           # Public routes
│   │   ├── page.tsx      # Homepage
│   │   ├── danh-muc/[slug]/
│   │   ├── san-pham/[slug]/
│   │   ├── gio-hang/
│   │   ├── so-sanh/
│   │   ├── search/
│   │   ├── login/
│   │   ├── register/
│   │   └── lien-he/
│   ├── admin/            # Admin panel (protected)
│   │   ├── products/
│   │   ├── categories/
│   │   └── comments/
│   ├── api/              # REST API routes
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/
│   ├── products/
│   ├── comments/
│   ├── admin/
│   └── ui/
├── lib/
├── store/
└── types/
```
