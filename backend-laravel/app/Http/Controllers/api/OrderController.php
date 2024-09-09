<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('user')->get();
        // dd($orders);
        foreach ($orders as $order) {
            $productIds = json_decode($order->product_id, true);
            // var_dump($productIds);
            $Product = Product::whereIn('id', $productIds)->get();
            $order['product_id'] = $Product->values()->all();
            $showOrders[] = $order;
        }
        return response()->json($showOrders);

    }
    public function select($id)
    {
        $orders = Order::with('user')->where('user_id', $id)->get();
        $productIds = json_decode($orders->first()->product_id, true);
        $Product = Product::whereIn('id', $productIds)->get();
        foreach ($orders as $order) {
            $order['product_id'] = $Product->values()->all();
            $showOrders[] = $order;
        }
        return response()->json($showOrders);
    }
    public function newOrder(Request $request)
    {
        try {
            // Lấy dữ liệu từ request
            $orderData = [
                'user_id' => $request->input('user_id'),
                'address' => $request->input('address'),
                'total_price' => $request->input('total_price'),
                'subtotal_price' => $request->input('subtotal_price'),
                'delivery_price' => $request->input('delivery_price'),
                'discount' => $request->input('discount'),
                'payment_status' => $request->input('payment_status', 'Paid'), // giá trị mặc định là 'Paid'
                'order_status' => $request->input('order_status', 'Processing'), // giá trị mặc định là 'Processing'
                'created_at' => now(), // Lấy thời gian hiện tại
                'note' => $request->input('note')
            ];

            // Tạo đơn hàng mới
            $order = Order::create($orderData);

            // Lưu danh sách sản phẩm (giả sử bảng order_product là bảng pivot)
            $productIds = $request->input('product_id');
            if (is_array($productIds)) {
                $order->products()->attach($productIds);
            }

            // Trả về phản hồi JSON với mã đơn hàng vừa tạo
            return response()->json(['id' => $order->id], 201);
        } catch (\Exception $e) {
            // Ghi lỗi vào log
            Log::error('Order creation failed: ' . $e->getMessage());

            return response()->json(['error' => 'Order creation failed', 'message' => $e->getMessage()], 500);
        }
    }
}