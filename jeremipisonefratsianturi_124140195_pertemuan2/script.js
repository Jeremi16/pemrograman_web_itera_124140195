// Dashboard Mahasiswa - Tugas 2 Pemrograman Web
// Fitur: CRUD daftar tugas + localStorage, jam, cuaca (Open-Meteo), kutipan (DummyJSON)

const STORAGE_KEY = 'dashboard_tasks_v1';
const API = {
  cuaca: 'https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true&timezone=Asia%2FJakarta',
  quote: 'https://dummyjson.com/quotes/random',
  todos: 'https://jsonplaceholder.typicode.com/todos?_limit=5',
};

// ---------- Helper (arrow functions) ----------
const $ = (id) => document.getElementById(id);

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const todayISO = () => new Date().toISOString().slice(0, 10);

const formatTanggal = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Tanpa deadline';

const weatherLabel = (code) => {
  if (code === 0) return 'Cerah';
  if (code <= 3) return 'Berawan';
  if (code <= 48) return 'Berkabut';
  if (code <= 67) return 'Hujan';
  if (code <= 77) return 'Salju';
  if (code <= 82) return 'Hujan lebat';
  return 'Badai petir';
};

// ---------- Model ----------
class TaskItem {
  constructor({ id = Date.now(), judul, matkul = '', deadline = '', prioritas = 'Sedang', selesai = false }) {
    this.id = id;
    this.judul = judul;
    this.matkul = matkul;
    this.deadline = deadline;
    this.prioritas = prioritas;
    this.selesai = selesai;
  }

  // Mengembalikan instance baru agar state tetap immutable
  toggle() {
    return new TaskItem({ ...this, selesai: !this.selesai });
  }

  get isOverdue() {
    return !this.selesai && this.deadline !== '' && this.deadline < todayISO();
  }

  static fromJSON(obj) {
    return new TaskItem(obj);
  }
}

// ---------- Controller ----------
class DashboardApp {
  constructor() {
    this.tasks = [];
    this.filter = 'semua';
    this.editingId = null;
  }

  async init() {
    this.bindEvents();
    this.startClock();
    this.fetchQuote();
    this.fetchWeather();

    const tersimpan = this.load();
    this.tasks = tersimpan ?? (await this.seedTasks());
    this.save();
    this.render();
  }

  // localStorage
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return null;
      return JSON.parse(raw).map(TaskItem.fromJSON);
    } catch (err) {
      console.warn('Data localStorage rusak, mulai dari kosong.', err);
      return [];
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  // Data eksternal (async/await)
  async seedTasks() {
    try {
      const res = await fetch(API.todos);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const todos = await res.json();
      return todos.map(({ id, title, completed }) =>
        new TaskItem({ id, judul: title, matkul: 'Contoh (JSONPlaceholder)', selesai: completed }));
    } catch (err) {
      console.warn('Gagal memuat data awal:', err);
      return [];
    }
  }

  async fetchQuote() {
    const el = $('quote');
    try {
      const res = await fetch(API.quote);
      const { quote, author } = await res.json();
      el.innerHTML = `"${escapeHtml(quote)}"<small>- ${escapeHtml(author)}</small>`;
    } catch {
      el.innerHTML = `"Belajar sedikit setiap hari lebih baik daripada tidak sama sekali."<small>- Anonim</small>`;
    }
  }

  async fetchWeather() {
    const el = $('cuaca');
    el.textContent = 'Memuat cuaca...';
    try {
      const res = await fetch(API.cuaca);
      const { current_weather: { temperature, windspeed, weathercode, time } } = await res.json();
      el.innerHTML = `
        <div class="temp">${temperature}°C</div>
        <p>${weatherLabel(weathercode)} - Angin ${windspeed} km/j</p>
        <p>Lampung Selatan - update ${time.slice(11)}</p>`;
    } catch {
      el.innerHTML = `<p>Gagal memuat cuaca. Periksa koneksi internet.</p>`;
    }
  }

  startClock() {
    const tick = () => {
      const now = new Date();
      $('jam').textContent = now.toLocaleTimeString('id-ID');
      $('tanggal').textContent = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };
    tick();
    setInterval(tick, 1000);
  }

  // CRUD (immutable dengan spread / map / filter)
  addTask(data) {
    this.tasks = [new TaskItem(data), ...this.tasks];
    this.commit();
  }

  updateTask(id, data) {
    this.tasks = this.tasks.map((t) => (t.id === id ? new TaskItem({ ...t, ...data }) : t));
    this.commit();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.commit();
  }

  toggleTask(id) {
    this.tasks = this.tasks.map((t) => (t.id === id ? t.toggle() : t));
    this.commit();
  }

  commit() {
    this.save();
    this.render();
  }

  // Form
  readForm() {
    return {
      judul: $('judul').value.trim(),
      matkul: $('matkul').value.trim(),
      deadline: $('deadline').value,
      prioritas: $('prioritas').value,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = this.readForm();

    let pesanError = '';
    if (data.judul === '') pesanError = 'Judul tugas wajib diisi.';
    else if (data.judul.length < 3) pesanError = 'Judul minimal 3 karakter.';

    $('errJudul').textContent = pesanError;
    $('judul').classList.toggle('invalid', pesanError !== '');
    if (pesanError) return;

    if (this.editingId !== null) {
      this.updateTask(this.editingId, data);
    } else {
      this.addTask(data);
    }
    this.resetForm();
  }

  startEdit(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    const { judul, matkul, deadline, prioritas } = task;
    $('judul').value = judul;
    $('matkul').value = matkul;
    $('deadline').value = deadline;
    $('prioritas').value = prioritas;

    this.editingId = id;
    $('formTitle').textContent = 'Edit Tugas';
    $('btnSubmit').textContent = 'Simpan';
    $('btnBatal').classList.remove('hidden');
    $('judul').focus();
  }

  resetForm() {
    $('taskForm').reset();
    this.editingId = null;
    $('formTitle').textContent = 'Tambah Tugas';
    $('btnSubmit').textContent = 'Tambah';
    $('btnBatal').classList.add('hidden');
    $('errJudul').textContent = '';
    $('judul').classList.remove('invalid');
  }

  // Events
  bindEvents() {
    $('taskForm').addEventListener('submit', (e) => this.handleSubmit(e));
    $('btnBatal').addEventListener('click', () => this.resetForm());
    $('btnQuote').addEventListener('click', () => this.fetchQuote());
    $('btnCuaca').addEventListener('click', () => this.fetchWeather());

    $('filter').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      this.filter = btn.dataset.filter;
      document.querySelectorAll('#filter .btn').forEach((b) => b.classList.toggle('active', b === btn));
      this.render();
    });

    // Event delegation untuk tombol di setiap item
    $('taskList').addEventListener('click', (e) => {
      const item = e.target.closest('.task');
      if (!item) return;
      const id = Number(item.dataset.id);
      const { action } = e.target.dataset;

      if (action === 'toggle') this.toggleTask(id);
      if (action === 'edit') this.startEdit(id);
      if (action === 'hapus' && confirm('Hapus tugas ini?')) this.deleteTask(id);
    });

    $('btnReset').addEventListener('click', () => {
      if (!confirm('Hapus semua tugas dari penyimpanan?')) return;
      this.tasks = [];
      this.resetForm();
      this.commit();
    });
  }

  // Render (template literals)
  get visibleTasks() {
    if (this.filter === 'belum') return this.tasks.filter((t) => !t.selesai);
    if (this.filter === 'selesai') return this.tasks.filter((t) => t.selesai);
    return this.tasks;
  }

  renderTask({ id, judul, matkul, deadline, prioritas, selesai, isOverdue }) {
    return `
      <li class="task ${selesai ? 'done' : ''}" data-id="${id}">
        <input type="checkbox" data-action="toggle" ${selesai ? 'checked' : ''} aria-label="Tandai selesai">
        <div class="task-info">
          <p class="task-title">${escapeHtml(judul)}<span class="badge ${prioritas}">${prioritas}</span></p>
          <p class="task-meta">
            ${matkul ? `${escapeHtml(matkul)} - ` : ''}
            <span class="${isOverdue ? 'overdue' : ''}">${formatTanggal(deadline)}${isOverdue ? ' (terlambat)' : ''}</span>
          </p>
        </div>
        <div class="task-actions">
          <button class="btn btn-small" data-action="edit" type="button">Edit</button>
          <button class="btn btn-small btn-danger" data-action="hapus" type="button">Hapus</button>
        </div>
      </li>`;
  }

  render() {
    const list = this.visibleTasks;
    $('taskList').innerHTML = list.length
      ? list.map((t) => this.renderTask(t)).join('')
      : `<li class="empty">Belum ada tugas di sini.</li>`;
    $('count').textContent = list.length;

    const total = this.tasks.length;
    const selesai = this.tasks.filter((t) => t.selesai).length;
    const terlambat = this.tasks.filter((t) => t.isOverdue).length;
    const persen = total ? Math.round((selesai / total) * 100) : 0;

    $('ringkasan').innerHTML = [
      ['Total tugas', total],
      ['Selesai', `${selesai} (${persen}%)`],
      ['Belum selesai', total - selesai],
      ['Terlambat', terlambat],
    ].map(([label, nilai]) => `<div class="row"><dt>${label}</dt><dd>${nilai}</dd></div>`).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new DashboardApp();
  app.init();
});
