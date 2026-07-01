import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-[#c8a96e] font-bold text-lg mb-4">Piano Beauty</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Chuyên cung cấp đàn piano chính hãng chất lượng cao: Yamaha, Kawai, Roland, Steinway & Sons.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Sản phẩm</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/danh-muc/piano-grand" className="hover:text-[#c8a96e] transition-colors">Piano Grand</Link></li>
              <li><Link href="/danh-muc/piano-upright" className="hover:text-[#c8a96e] transition-colors">Piano Upright</Link></li>
              <li><Link href="/danh-muc/piano-dien" className="hover:text-[#c8a96e] transition-colors">Piano Điện</Link></li>
              <li><Link href="/danh-muc/dan-organ" className="hover:text-[#c8a96e] transition-colors">Đàn Organ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/lien-he" className="hover:text-[#c8a96e] transition-colors">Liên hệ</Link></li>
              <li><Link href="/chinh-sach-bao-hanh" className="hover:text-[#c8a96e] transition-colors">Chính sách bảo hành</Link></li>
              <li><Link href="/huong-dan-mua-hang" className="hover:text-[#c8a96e] transition-colors">Hướng dẫn mua hàng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>📍 123 Đường Piano, Q.1, TP.HCM</li>
              <li>📞 <a href="tel:0901234567" className="hover:text-[#c8a96e]">090 123 4567</a></li>
              <li>✉️ <a href="mailto:info@pianobeauty.vn" className="hover:text-[#c8a96e]">info@pianobeauty.vn</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Piano Beauty. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
