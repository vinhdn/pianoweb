import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ Piano Beauty để được tư vấn và hỗ trợ mua đàn piano.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Liên hệ với chúng tôi</h1>
      <p className="text-gray-500 text-center mb-10">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-lg mb-4">Thông tin liên hệ</h2>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-medium">Địa chỉ</p>
                <p className="text-gray-600 text-sm">123 Đường Piano, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-medium">Điện thoại</p>
                <a href="tel:0901234567" className="text-[#c8a96e] hover:underline text-sm">090 123 4567</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:info@pianobeauty.vn" className="text-[#c8a96e] hover:underline text-sm">
                  info@pianobeauty.vn
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="font-medium">Giờ mở cửa</p>
                <p className="text-gray-600 text-sm">Thứ 2 – Thứ 7: 8:00 – 18:00</p>
                <p className="text-gray-600 text-sm">Chủ nhật: 9:00 – 17:00</p>
              </div>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <h2 className="font-bold text-lg">Gửi tin nhắn</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c8a96e] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                placeholder="090 123 4567"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c8a96e] text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              placeholder="email@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c8a96e] text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
            <textarea
              required
              rows={5}
              placeholder="Bạn cần tư vấn về sản phẩm nào?"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c8a96e] text-sm resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1a1a2e] text-white py-3 rounded-lg font-semibold hover:bg-[#16213e] transition-colors"
          >
            Gửi tin nhắn
          </button>
        </form>
      </div>
    </div>
  );
}
