import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description: "Liên hệ Piano Beauty để được tư vấn về đàn piano. Gọi ngay 0909 123 456 hoặc đến 123 Nguyễn Huệ, Q1, TP.HCM",
};

export default function ContactPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#1a3a5c] mb-3">Liên Hệ Với Chúng Tôi</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Đội ngũ tư vấn của Piano Beauty luôn sẵn sàng hỗ trợ bạn chọn lựa chiếc đàn piano phù hợp nhất.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#1a3a5c]">Thông Tin Liên Hệ</h2>

          {[
            { icon: MapPin, title: "Địa chỉ", content: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh" },
            { icon: Phone, title: "Điện thoại", content: "0909 123 456" },
            { icon: Mail, title: "Email", content: "info@pianobeauty.vn" },
            { icon: Clock, title: "Giờ làm việc", content: "Thứ 2 - Thứ 7: 8:00 - 20:00\nChủ nhật: 9:00 - 18:00" },
          ].map(({ icon: Icon, title, content }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 bg-[#1a3a5c]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#1a3a5c]" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{title}</p>
                <p className="text-gray-600 text-sm whitespace-pre-line">{content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-6">Gửi Tin Nhắn</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên *</label>
                <input type="text" required className="w-full h-11 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
                <input type="tel" className="w-full h-11 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" required className="w-full h-11 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chủ Đề</label>
              <select className="w-full h-11 px-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c] bg-white">
                <option>Tư vấn chọn đàn piano</option>
                <option>Báo giá sản phẩm</option>
                <option>Bảo hành & sửa chữa</option>
                <option>Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội Dung *</label>
              <textarea required rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a5c] resize-none" placeholder="Nhập nội dung tin nhắn của bạn..." />
            </div>
            <button type="submit" className="w-full h-11 bg-[#1a3a5c] text-white rounded-lg font-medium text-sm hover:bg-[#1a3a5c]/90 transition-colors">
              Gửi Tin Nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
