#!/bin/bash

# Script khởi động nhanh Pomodoro Timer App

echo "🍅 Khởi động Pomodoro Timer App..."
echo ""

# Kiểm tra node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Đang cài đặt dependencies..."
    npm install
fi

# Hỏi người dùng muốn chạy trên platform nào
echo "Chọn platform để chạy:"
echo "1) Android (qua USB hoặc emulator)"
echo "2) iOS (cần macOS)"
echo "3) Web"
echo "4) Expo Go (quét QR code)"
echo ""
read -p "Nhập lựa chọn (1-4): " choice

case $choice in
    1)
        echo "🤖 Đang khởi động trên Android..."
        npx expo start --android
        ;;
    2)
        echo "🍎 Đang khởi động trên iOS..."
        npx expo start --ios
        ;;
    3)
        echo "🌐 Đang khởi động trên Web..."
        npx expo start --web
        ;;
    4)
        echo "📱 Đang khởi động Expo Go..."
        echo "Hãy quét QR code bằng app Expo Go trên điện thoại của bạn!"
        npx expo start
        ;;
    *)
        echo "❌ Lựa chọn không hợp lệ!"
        exit 1
        ;;
esac
