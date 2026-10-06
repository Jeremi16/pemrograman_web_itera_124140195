// Mini POS - Kasir Kantin Kampus
// Kompetensi: validasi form + kalkulator otomatis + keranjang localStorage

const STORAGE_KEY = 'minipos_cart_v1';
const MIN_HARGA = 500;
const MIN_TOTAL_DISKON = 50000;
const DISKON_RATE = 0.1;
const KODE_PROMO_VALID = 'HEMAT10';

// State utama keranjang: [{ id, nama, harga, qty }]
let cart = [];

// ---------- Util ----------
function formatRupiah(nilai) {
  const n = Number(nilai) || 0;
  return 'Rp ' + n.toLocaleString('id-ID');
}

function getEl(id) {
  return document.getElementById(id);
}

// ---------- LocalStorage (serialisasi JSON) ----------
function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
  try {
    const mentah = localStorage.getItem(STORAGE_KEY);
    if (!mentah) return [];
    const data = JSON.parse(mentah);
    if (!Array.isArray(data)) return [];
    // Sanitasi ringan agar data rusak tidak merusak render
    return data.filter(
      (item) =>
        item &&
        typeof item.nama === 'string' &&
        Number.isFinite(Number(item.harga)) &&
        Number.isFinite(Number(item.qty))
    );
  } catch (e) {
    console.warn('Gagal membaca localStorage, keranjang dikosongkan.', e);
    return [];
  }
}

// ---------- Validasi Form ----------
function validateNama(nama) {
  if (!nama || nama.trim() === '') return 'Nama barang wajib diisi.';
  if (nama.trim().length < 3) return 'Nama barang minimal 3 karakter (contoh: "Teh").';
  return '';
}

function validateHarga(hargaStr) {
  if (hargaStr === '' || hargaStr === null || hargaStr === undefined)
    return 'Harga satuan wajib diisi.';
  const harga = Number(hargaStr);
  if (!Number.isFinite(harga)) return 'Harga harus berupa angka.';
  if (harga <= 0) return 'Harga harus angka positif (tidak boleh 0 / negatif).';
  if (harga < MIN_HARGA) return `Harga minimal Rp ${MIN_HARGA.toLocaleString('id-ID')}.`;
  return '';
}

function validateQty(qtyStr) {
  if (qtyStr === '' || qtyStr === null || qtyStr === undefined)
    return 'Qty wajib diisi.';
  const qty = Number(qtyStr);
  if (!Number.isFinite(qty)) return 'Qty harus berupa angka.';
  if (!Number.isInteger(qty)) return 'Qty harus bilangan bulat (contoh: 1, 2, 3).';
  if (qty < 1) return 'Qty minimal 1.';
  return '';
}

function tampilkanError(inputEl, msgEl, pesan) {
  msgEl.textContent = pesan;
  if (pesan) inputEl.classList.add('invalid');
  else inputEl.classList.remove('invalid');
}

// ---------- Kalkulator ----------
function hitungSubtotal(harga, qty) {
  return Number(harga) * Number(qty);
}

function hitungTotal() {
  return cart.reduce((sum, item) => sum + hitungSubtotal(item.harga, item.qty), 0);
}

// Kombinasi: otomatis 10% saat total >= 50rb, input HEMAT10 sebagai penguat/override.
function hitungDiskon(total, kodePromo) {
  const kode = (kodePromo || '').trim().toUpperCase();
  const infoPromo = getEl('infoPromo');

  if (total < MIN_TOTAL_DISKON) {
    if (kode !== '') {
      infoPromo.textContent = `Kode "${kode}" tersimpan, tapi diskon baru aktif saat total ≥ ${formatRupiah(MIN_TOTAL_DISKON)}.`;
      infoPromo.className = 'info-msg';
    } else {
      infoPromo.textContent = `Belanja ≥ ${formatRupiah(MIN_TOTAL_DISKON)} otomatis dapat diskon 10% (atau pakai kode HEMAT10).`;
      infoPromo.className = 'info-msg';
    }
    return 0;
  }

  // total >= 50rb
  if (kode === '') {
    infoPromo.textContent = 'Diskon otomatis 10% aktif (total ≥ Rp 50.000).';
    infoPromo.className = 'info-msg ok';
    return Math.round(total * DISKON_RATE);
  }
  if (kode === KODE_PROMO_VALID) {
    infoPromo.textContent = 'Kode HEMAT10 valid - diskon 10% diterapkan.';
    infoPromo.className = 'info-msg ok';
    return Math.round(total * DISKON_RATE);
  }
  infoPromo.textContent = `Kode "${kode}" tidak valid. Gunakan HEMAT10 atau kosongkan untuk diskon otomatis.`;
  infoPromo.className = 'info-msg error';
  return 0;
}

function hitungKembalian(uangBayar, totalAkhir) {
  return Number(uangBayar) - Number(totalAkhir);
}

// ---------- Render ----------
function renderCart() {
  const tbody = getEl('bodyKeranjang');
  const emptyState = getEl('emptyState');
  tbody.innerHTML = '';

  cart.forEach((item, index) => {
    const subtotal = hitungSubtotal(item.harga, item.qty);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(item.nama)}</td>
      <td class="num">${formatRupiah(item.harga)}</td>
      <td class="num">${item.qty}</td>
      <td class="num">${formatRupiah(subtotal)}</td>
      <td><button class="btn btn-small" data-hapus="${item.id}" type="button">Hapus</button></td>
    `;
    tbody.appendChild(tr);
  });

  const isEmpty = cart.length === 0;
  emptyState.style.display = isEmpty ? 'block' : 'none';
  getEl('jumlahItem').textContent = `${cart.length} item`;

  recalcRingkasan();
  saveCart();
}

function recalcRingkasan() {
  const total = hitungTotal();
  const kodePromo = getEl('kodePromo').value;
  const diskon = hitungDiskon(total, kodePromo);
  const totalAkhir = total - diskon;

  getEl('totalBelanja').textContent = formatRupiah(total);
  getEl('nominalDiskon').textContent = formatRupiah(diskon);
  getEl('totalAkhir').textContent = formatRupiah(totalAkhir);

  // Kalkulator uang bayar & kembalian (realtime)
  const bayarStr = getEl('uangBayar').value;
  const kembalianBox = getEl('kembalianBox');
  const nominalKembalian = getEl('nominalKembalian');
  const infoKembalian = getEl('infoKembalian');
  const errBayar = getEl('errBayar');

  kembalianBox.classList.remove('kurang');
  infoKembalian.className = '';
  errBayar.textContent = '';

  if (cart.length === 0) {
    nominalKembalian.textContent = formatRupiah(0);
    infoKembalian.textContent = 'Keranjang kosong - tambahkan barang dulu.';
    return;
  }

  if (bayarStr === '' || bayarStr === null) {
    nominalKembalian.textContent = formatRupiah(0);
    infoKembalian.textContent = 'Masukkan nominal uang yang diterima kasir.';
    return;
  }

  const bayar = Number(bayarStr);
  if (!Number.isFinite(bayar) || bayar < 0) {
    errBayar.textContent = 'Uang bayar harus berupa angka positif.';
    nominalKembalian.textContent = formatRupiah(0);
    return;
  }

  const kembalian = hitungKembalian(bayar, totalAkhir);
  if (kembalian < 0) {
    nominalKembalian.textContent = formatRupiah(0);
    kembalianBox.classList.add('kurang');
    infoKembalian.textContent = `Uang belum mencukupi, kurang ${formatRupiah(Math.abs(kembalian))}.`;
    infoKembalian.className = 'error';
  } else {
    nominalKembalian.textContent = formatRupiah(kembalian);
    infoKembalian.textContent = kembalian === 0 ? 'Uang pas. Terima kasih!' : 'Transaksi valid - kembalian di atas.';
    infoKembalian.className = 'ok';
  }
}

function escapeHtml(teks) {
  return String(teks)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// ---------- Aksi ----------
function handleTambah(event) {
  event.preventDefault();

  const inputNama = getEl('namaBarang');
  const inputHarga = getEl('hargaBarang');
  const inputQty = getEl('qtyBarang');

  const errNama = validateNama(inputNama.value);
  const errHarga = validateHarga(inputHarga.value);
  const errQty = validateQty(inputQty.value);

  tampilkanError(inputNama, getEl('errNama'), errNama);
  tampilkanError(inputHarga, getEl('errHarga'), errHarga);
  tampilkanError(inputQty, getEl('errQty'), errQty);

  // Cegah barang masuk keranjang jika ada yang tidak valid
  if (errNama || errHarga || errQty) return;

  cart.push({
    id: Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
    nama: inputNama.value.trim(),
    harga: Number(inputHarga.value),
    qty: Number(inputQty.value),
  });

  renderCart();

  // Reset otomatis saat berhasil
  getEl('formBarang').reset();
  inputNama.focus();
}

function hapusItem(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
}

function resetTransaksi() {
  if (cart.length === 0 && getEl('uangBayar').value === '' && getEl('kodePromo').value === '') return;
  const yakin = confirm('Kosongkan seluruh keranjang & bersihkan localStorage?');
  if (!yakin) return;
  cart = [];
  getEl('kodePromo').value = '';
  getEl('uangBayar').value = '';
  renderCart();
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  cart = loadCart();

  getEl('formBarang').addEventListener('submit', handleTambah);
  getEl('bodyKeranjang').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-hapus]');
    if (btn) hapusItem(btn.getAttribute('data-hapus'));
  });
  getEl('btnReset').addEventListener('click', resetTransaksi);

  // Validasi hilang saat user mengetik ulang + hitung ulang realtime
  ['namaBarang', 'hargaBarang', 'qtyBarang'].forEach((id) => {
    getEl(id).addEventListener('input', (e) => {
      e.target.classList.remove('invalid');
      const map = { namaBarang: 'errNama', hargaBarang: 'errHarga', qtyBarang: 'errQty' };
      getEl(map[id]).textContent = '';
    });
  });
  getEl('kodePromo').addEventListener('input', recalcRingkasan);
  getEl('uangBayar').addEventListener('input', recalcRingkasan);

  renderCart();
});
