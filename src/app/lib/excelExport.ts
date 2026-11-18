/**
 * Excel Export Utility for Sellers
 *
 * Handles exporting order data to Excel format
 */

import * as XLSX from 'xlsx';
import { Capacitor } from '@capacitor/core';

async function saveWorkbook(workbook: XLSX.WorkBook, fullFilename: string) {
  if (Capacitor.isNativePlatform()) {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    const writeResult = await Filesystem.writeFile({
      path: fullFilename,
      data: base64,
      directory: Directory.Documents,
      recursive: true,
    });
    try {
      await Share.share({
        title: 'Export Pesanan',
        text: `File ${fullFilename} berhasil disimpan`,
        url: writeResult.uri,
        dialogTitle: 'Bagikan / Simpan File Excel',
      });
    } catch {
      // user cancelled share — file already saved locally
    }
  } else {
    // Browser: regular download via blob
    const wbout = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fullFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

interface OrderExportData {
  order_id: string;
  customer_name: string;
  customer_email: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
  payment_method: string;
  delivery_date: string;
  delivery_address: string;
  special_requests?: string;
  created_at: string;
}

/**
 * Export orders to Excel file
 */
export async function exportOrdersToExcel(orders: OrderExportData[], filename: string = 'orders-export') {
  try {
    // Prepare data for Excel
    const excelData = orders.map((order, index) => ({
      'No': index + 1,
      'Order ID': order.order_id.substring(0, 8),
      'Tanggal Order': formatDate(order.created_at),
      'Nama Customer': order.customer_name,
      'Email Customer': order.customer_email,
      'Produk': order.product_name,
      'Jumlah': order.quantity,
      'Harga Satuan': formatCurrency(order.price),
      'Total': formatCurrency(order.total),
      'Status': translateStatus(order.status),
      'Metode Pembayaran': translatePaymentMethod(order.payment_method),
      'Tanggal Pengiriman': formatDateTime(order.delivery_date),
      'Alamat Pengiriman': order.delivery_address,
      'Permintaan Khusus': order.special_requests || '-'
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 5 },  // No
      { wch: 12 }, // Order ID
      { wch: 18 }, // Tanggal Order
      { wch: 20 }, // Nama Customer
      { wch: 25 }, // Email Customer
      { wch: 25 }, // Produk
      { wch: 8 },  // Jumlah
      { wch: 15 }, // Harga Satuan
      { wch: 15 }, // Total
      { wch: 12 }, // Status
      { wch: 18 }, // Metode Pembayaran
      { wch: 18 }, // Tanggal Pengiriman
      { wch: 30 }, // Alamat Pengiriman
      { wch: 30 }  // Permintaan Khusus
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Add summary sheet
    const summaryData = generateSummary(orders);
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${timestamp}.xlsx`;

    // Download file (web) or save+share (native Android)
    await saveWorkbook(workbook, fullFilename);

    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
}

/**
 * Generate summary statistics
 */
function generateSummary(orders: OrderExportData[]) {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalRevenue / totalOrders || 0;

  // Group by status
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by payment method
  const paymentCounts = orders.reduce((acc, order) => {
    acc[order.payment_method] = (acc[order.payment_method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const summary = [
    { 'Metrik': 'Total Pesanan', 'Nilai': totalOrders },
    { 'Metrik': 'Total Pendapatan', 'Nilai': formatCurrency(totalRevenue) },
    { 'Metrik': 'Rata-rata Nilai Pesanan', 'Nilai': formatCurrency(averageOrderValue) },
    { 'Metrik': '', 'Nilai': '' },
    { 'Metrik': 'STATUS PESANAN', 'Nilai': '' },
    ...Object.entries(statusCounts).map(([status, count]) => ({
      'Metrik': `  ${translateStatus(status)}`,
      'Nilai': count
    })),
    { 'Metrik': '', 'Nilai': '' },
    { 'Metrik': 'METODE PEMBAYARAN', 'Nilai': '' },
    ...Object.entries(paymentCounts).map(([method, count]) => ({
      'Metrik': `  ${translatePaymentMethod(method)}`,
      'Nilai': count
    }))
  ];

  return summary;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Format tanggal + jam (untuk tanggal pengiriman/pengambilan)
 */
function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const datePart = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return `${datePart}, ${timePart}`;
  } catch {
    return dateString;
  }
}

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Translate payment method to a friendly Indonesian label.
 * Menangani cash, transfer, transfer dana, transfer bank, e-wallet, dll.
 */
function translatePaymentMethod(method?: string): string {
  if (!method) return '-';
  const key = method.toString().trim().toLowerCase();
  const map: Record<string, string> = {
    'cash': 'Tunai (Cash)',
    'tunai': 'Tunai (Cash)',
    'cod': 'Tunai (Cash)',
    'bank_transfer': 'Transfer Bank',
    'transfer_bank': 'Transfer Bank',
    'transfer bank': 'Transfer Bank',
    'bank': 'Transfer Bank',
    'transfer': 'Transfer',
    'e_wallet': 'Transfer Dana / E-Wallet',
    'ewallet': 'Transfer Dana / E-Wallet',
    'e-wallet': 'Transfer Dana / E-Wallet',
    'dana': 'Transfer Dana',
    'transfer_dana': 'Transfer Dana',
    'transfer dana': 'Transfer Dana',
    'gopay': 'Transfer Dana / E-Wallet',
    'ovo': 'Transfer Dana / E-Wallet',
    'credit_card': 'Kartu Kredit',
    'kartu_kredit': 'Kartu Kredit',
    'paid': 'Lunas',
    'unpaid': 'Belum Dibayar',
  };
  return map[key] || method;
}

/**
 * Translate status to Indonesian
 */
function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    'pending': 'Menunggu',
    'confirmed': 'Dikonfirmasi',
    'processing': 'Diproses',
    'ready': 'Siap',
    'delivered': 'Terkirim',
    'completed': 'Selesai',
    'cancelled': 'Dibatalkan'
  };
  return translations[status] || status;
}

/**
 * Export filtered data by date range
 */
export function exportOrdersByDateRange(
  orders: OrderExportData[],
  startDate: Date,
  endDate: Date,
  filename?: string
) {
  const filtered = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= startDate && orderDate <= endDate;
  });

  const dateRange = `${startDate.toLocaleDateString('id-ID')}_to_${endDate.toLocaleDateString('id-ID')}`;
  const fullFilename = filename || `orders_${dateRange}`;

  return exportOrdersToExcel(filtered, fullFilename);
}

/**
 * Export product performance report
 */
export async function exportProductPerformance(orders: OrderExportData[], filename: string = 'product-performance') {
  try {
    // Group by product
    const productStats = orders.reduce((acc, order) => {
      if (!acc[order.product_name]) {
        acc[order.product_name] = {
          name: order.product_name,
          totalOrders: 0,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      acc[order.product_name].totalOrders += 1;
      acc[order.product_name].totalQuantity += order.quantity;
      acc[order.product_name].totalRevenue += order.total;
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by revenue
    const productsArray = Object.values(productStats)
      .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue);

    // Prepare data for Excel
    const excelData = productsArray.map((product: any, index) => ({
      'No': index + 1,
      'Nama Produk': product.name,
      'Total Pesanan': product.totalOrders,
      'Total Quantity': product.totalQuantity,
      'Total Pendapatan': formatCurrency(product.totalRevenue),
      'Rata-rata per Order': formatCurrency(product.totalRevenue / product.totalOrders)
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Performance');

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${timestamp}.xlsx`;

    // Download (web) or save+share (native Android)
    await saveWorkbook(workbook, fullFilename);

    return true;
  } catch (error) {
    console.error('Error exporting product performance:', error);
    return false;
  }
}
