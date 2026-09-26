# DEMO WEB DÙNG COOKIE ĐỂ LOGIN VÀ DUY TRÌ LOGINED
Logic làm ngay trên lớp cho 59kmt: 
- Sử dụng docker compose để triển khai các service, xem chi tiết tại [docker-compose.yml](./docker-compose.yml)
- code web chỉ sử dụng html + js
- backend sử dụng nodered để truy vấn SQL tới MariaDB trả về json
- cấu hình nodered bắt buộc đăng nhập tại file [./nodered/settings.js](./nodered/settings.js), chuỗi hash lấy tại [tool này](https://tms.tnut.edu.vn/pw.php)
- web server sử dụng nginx
- cấu hình nginx tại file [./nginx/nginx.conf](./nginx/nginx.conf) để điều hướng root tới thư mục ./html, điều hướng /api/ tới nodered:1880
- sử dụng MariaDB làm cơ sở dữ liệu
- sử dụng phpMyAdmin làm công cụ để quản trị MariaDB: tạo table, trường dữ liệu, nhập dữ liệu demo,...
- dùng cloudflare để web truy cập online qua domain (cần domain xịn)

# Kết quả:
- Đã đăng nhập được bằng uid + pwd theo database
- Chưa đăng nhập thì ko xem đc thông tin mật
- Duy trì đăng nhập : Sau khi đã đăng nhập thì các lần sau xem đc thông tin mật ngay mà ko phải đăng nhập lại
- Dùng trình duyệt ẩn danh truy cập trực tiếp url mật cũng ko xem được thông tin mật


---

# HƯỚNG DẪN SỬ DỤNG DOCKER

## 1. Hệ điều hành nào dùng được docker ?
  - Windows 11 pro: cài đặt docker desktop
  - Giả lập Linux:
    + WSL (có sẵn trên Windows 11 pro): Cài Ubuntu OS
    + HyperV (có sẵn trên Windows 11 pro): Cài Ubuntu OS
    + VirtualBox : Cài đặt Ubuntu OS
    + VMWare : Cài đặt Ubuntu OS
  - Cài Ubuntu OS trên máy thật
  - VPS cài sẵn Ubuntu
  - Pi3 | Pi4 | Pi5 : Cài đặt Debian OS
## 2. Các bước cài đặt:
  - Docker desktop trên windows: https://www.docker.com/products/docker-desktop/
  - Ubuntu: 
```
# 1. Cập nhật hệ thống và cài đặt gói phụ thuộc
sudo apt update
sudo apt install -y ca-certificates curl gnupg

# 2. Thêm khóa GPG chính thức của Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. Thêm kho lưu trữ (repository) Docker vào nguồn APT
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Cập nhật APT và cài đặt Docker Compose
sudo apt update
sudo apt install -y docker-compose-plugin
```

## 3. Sử dụng docker compose:
1. tạo thư mục làm việc (nên trùng tên với repo trên github)
2. tạo file **docker-compose.yml** chứa các service cần thiết
 
### cấu trúc file docker-compose.yml như sau:
```
services:
  # 1. Tên dịch vụ (do bạn tự đặt)
  web_app:
    image: nginx:alpine                  # Sử dụng image có sẵn từ Docker Hub
    container_name: my_web_container     # Đặt tên cố định cho container (tùy chọn, nhưng phải duy nhất, phải khác nhau)
    restart: always                      # Tự động khởi động lại nếu lỗi hoặc reboot OS
    ports:
      - "8080:80"                        # Map cổng: [Cổng máy thật (Host)]:[Cổng trong Container]
    environment:
      - NODE_ENV=production              # Biến môi trường
    volumes:
      - ./html:/usr/share/nginx/html     # Mount thư mục: [Đường dẫn trên Host]:[Đường dẫn Container]
      - app_data:/var/log/nginx          # Mount Volume quy hoạch riêng
    networks:
      - my_network                       # Nối vào mạng riêng
    depends_on:
      - database                         # Chạy sau dịch vụ 'database'

  # 2. Dịch vụ thứ hai (ví dụ: Database)
  database:
    build:                              # Hoặc build từ Dockerfile thay vì dùng image
      context: ./db_folder
      dockerfile: Dockerfile
    environment:
      POSTGRES_PASSWORD: secret_password
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - my_network

# Quy hoạch Volume chung cho các container
volumes:
  app_data:
  db_data:

# Quy hoạch Mạng nội bộ giúp các container giao tiếp qua tên dịch vụ
networks:
  my_network:
    driver: bridge
```
