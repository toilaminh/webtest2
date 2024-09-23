# webtest2
Dự án kiểm tra vòng 2 Fullstack Dev

# Hướng dẫn chạy source code

(Chú ý: Máy cần có NodeJS. Link cài NodeJS: https://nodejs.org/en/download/prebuilt-installer)

BƯỚC 1 : Clone dự án này về máy: https://github.com/toilaminh/webtest2.git

BƯỚC 2 : Tạo tài khoản BITRIX24

BƯỚC 3 : Kích hoạt trạng thái dùng thử của tài khoản BITRIX24

BƯỚC 4 : Tạo 1 ứng dụng cục bộ bằng cách vào "Ứng dụng" -> "Tài nguyên cho nhà phát triển" -> "Khác" -> "Ứng dụng cục bộ"

BƯỚC 5 : Tạo 1 tài khoản ngrok và tải ngrok về máy, thiết lập auth cho ngrok vừa tải về bằng mã auth của tài khoản ngrok vừa lập

BƯỚC 6 : Lấy link Static mà ngrok cung cấp("Getting stared" -> "Setup & Installation" -> "Connect" -> "Deploy your app online" -> "Static domain" -> "Visit your domain", copy link), vào Ứng dụng mới tạo trong Bitrix và paste vào phần "Đường dẫn xử lý của bạn", thêm vào sau link vừa copy đoạn sau '/callback' -> Lưu

BƯỚC 7 : Mở file server_in4.json, lần lượt lấy thông tin ứng dụng và domain ngrok để thay thế:
            + bitrix_domain : Lấy miền bitrix tài khoản của bạn dán vào miền này
            + client_id     : Lấy "ID Ứng dụng (client_id)" của ứng dụng vừa tạo và dán vào miền này
            + client_secret : Lấy "Khóa ứng dụng (client_secret)" của ứng dụng vừa tạo và dán vào đây
            + redirect_uri  : Đây là url chuyển hướng cho web. Lấy link của ngrok đã cấp cho bạn và dán vào đây

BƯỚC 8 : Mở terminal tại thư mục của dự án, chạy dòng lệnh "node server.js"

BƯỚC 9 : Tại trang web ngrok, vào phần ("Getting stared" -> "Setup & Installation" -> "Connect" -> "Deploy your app online" -> "Static domain"), copy đoạn mã mà trang web cung cấp cho tài khoản của bạn và thay số cuối bằng số 3000. Ví dụ:
            + Ngrok cho sẵn đoạn mã : ngrok http --domain=abcxyz.app 80
            + Mã bạn thay           : ngrok http --domain=abcxyz.app 3000

BƯỚC 10 : Dùng đoạn mã trên, mở ứng dụng ngrok và paste đoạn mã vừa copy vào và chạy

Sau khi chạy, bạn vào link mà ngrok cung cấp và bắt đầu dùng ứng dụng

# Lưu ý khi dùng ứng dụng

1. Khi thêm liên lạc, phải điền đầy đủ thông tin mới cho thêm liên lạc mới

2. Khi chỉnh sửa thông tin liên lạc, chỉ có trường nào được điền mới bị thay đổi

3. Tài khoản bitrix24 kích hoạt dùng thử chỉ có 15 ngày. Sau 15 ngày, các dữ liệu crm sẽ không được phép truy cập được bằng web nữa

ngrok http --domain=suited-goshawk-gradually.ngrok-free.app 3000