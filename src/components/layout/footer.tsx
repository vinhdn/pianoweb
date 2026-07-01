import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a3a5c] text-white mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#c9a84c] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <div className="font-bold text-lg">Piano Beauty</div>
                <div className="text-xs text-white/60">Đàn Piano Chính Hãng</div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Chuyên phân phối đàn piano acoustic, piano điện, grand piano chính hãng từ các thương hiệu hàng đầu thế giới.
            </p>
            <div className="flex gap-3">
                {[
                { href: "https://facebook.com", label: "f" },
                { href: "https://youtube.com", label: "▶" },
                { href: "https://instagram.com", label: "◉" },
              ].map(({ href, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#c9a84c] transition-colors text-xs font-bold">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-[#c9a84c] mb-4">Sản Phẩm</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/danh-muc/dan-piano-co" className="hover:text-[#c9a84c] transition-colors">Đàn Piano Cơ</Link></li>
              <li><Link href="/danh-muc/dan-piano-dien" className="hover:text-[#c9a84c] transition-colors">Đàn Piano Điện</Link></li>
              <li><Link href="/danh-muc/dan-grand-piano" className="hover:text-[#c9a84c] transition-colors">Grand Piano</Link></li>
              <li><Link href="/danh-muc/dan-organ" className="hover:text-[#c9a84c] transition-colors">Đàn Organ</Link></li>
              <li><Link href="/khuyen-mai" className="hover:text-[#c9a84c] transition-colors">Khuyến Mãi</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold text-[#c9a84c] mb-4">Hỗ Trợ</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/chinh-sach/bao-hanh" className="hover:text-[#c9a84c] transition-colors">Chính Sách Bảo Hành</Link></li>
              <li><Link href="/chinh-sach/van-chuyen" className="hover:text-[#c9a84c] transition-colors">Chính Sách Vận Chuyển</Link></li>
              <li><Link href="/chinh-sach/doi-tra" className="hover:text-[#c9a84c] transition-colors">Chính Sách Đổi Trả</Link></li>
              <li><Link href="/chinh-sach/bao-mat" className="hover:text-[#c9a84c] transition-colors">Chính Sách Bảo Mật</Link></li>
              <li><Link href="/huong-dan/dat-hang" className="hover:text-[#c9a84c] transition-colors">Hướng Dẫn Đặt Hàng</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[#c9a84c] mb-4">Liên Hệ</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#c9a84c]" />
                <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#c9a84c]" />
                <a href="tel:0909123456" className="hover:text-[#c9a84c] transition-colors">0909 123 456</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#c9a84c]" />
                <a href="mailto:info@pianobeauty.vn" className="hover:text-[#c9a84c] transition-colors">info@pianobeauty.vn</a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-lg text-xs text-white/60">
              <p className="font-medium text-white/80 mb-1">Giờ làm việc:</p>
              <p>Thứ 2 - Thứ 7: 8:00 - 20:00</p>
              <p>Chủ nhật: 9:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© 2024 Piano Beauty. Tất cả quyền được bảo lưu.</p>
          <p>Thiết kế bởi Piano Beauty Team</p>
        </div>
      </div>
    </footer>
  );
}
