import type { Language } from '@/game/types';

/**
 * Pick the correct localized string based on language setting.
 * Usage: t('Bản Đồ', 'Map', lang)
 */
export function t(vi: string, en: string, lang: Language): string {
  return lang === 'en' ? en : vi;
}

/**
 * Pick a localized label from an item that has `label` (Vietnamese) and optional `labelEn`.
 * Falls back to `label` if `labelEn` is missing.
 */
export function tLabel(item: { label: string; labelEn?: string }, lang: Language): string {
  if (lang === 'en' && item.labelEn) return item.labelEn;
  return item.label;
}

/* ── Navigation Labels ─────────────────────────── */
export const NAV = {
  map:        { vi: '🗺️ Bản Đồ',      en: '🗺️ Map' },
  island:     { vi: '🏡 Đảo Rừng',     en: '🏡 Island' },
  stickers:   { vi: '⭐ Bộ Sưu Tập',   en: '⭐ Stickers' },
  freePlay:   { vi: '🎈 Chơi Tự Do',   en: '🎈 Free Play' },
  settings:   { vi: '⚙️ Phụ Huynh',    en: '⚙️ Parents' },
} as const;

/* ── Game UI Labels ────────────────────────────── */
export const GAME_UI = {
  playNow:      { vi: 'CHƠI NGAY 🚀',        en: 'PLAY NOW 🚀' },
  start:        { vi: 'Bắt đầu 🎯',          en: 'Start 🎯' },
  replay:       { vi: 'Chơi lại ↺',           en: 'Replay ↺' },
  tryFree:      { vi: 'Chơi thử 🎮',          en: 'Try Free 🎮' },
  locked:       { vi: 'Bấm để mở khóa chơi thử ngay', en: 'Tap to try this level' },
  unlocked:     { vi: 'Sẵn sàng bắt đầu giải cứu bạn thú', en: 'Ready to start rescue' },
  current:      { vi: 'Nhiệm vụ tiếp theo đang chờ bé giải cứu!', en: 'Next mission is waiting for you!' },
  completed:    { vi: 'Đã giải cứu thành công!', en: 'Rescue complete!' },
  challenge:    { vi: 'Thử thách',             en: 'Challenge' },
  mission:      { vi: 'Màn',                   en: 'Level' },
  comingSoon:   { vi: 'Sắp ra mắt',            en: 'Coming Soon' },
  futureWorlds: { vi: 'Các Thế Giới Tương Lai (Coming Soon)', en: 'Future Worlds (Coming Soon)' },
} as const;

/* ── Home Page ─────────────────────────────────── */
export const HOME = {
  worldBadge:    { vi: 'Thế giới: Rừng Vui Vẻ', en: 'World: Happy Forest' },
  subtitle:      { vi: 'Cùng các bạn thú vượt qua thử thách, sửa cầu, tìm thức ăn và khôi phục lại khu rừng xanh ngát!', en: 'Help animal friends overcome challenges, fix bridges, find food and restore the lush green forest!' },
  progressLabel: { vi: 'Hành Trình Giải Cứu',  en: 'Rescue Journey' },
  rescued:       { vi: 'Bạn thú đã về nhà',     en: 'Animals rescued' },
  missionsCleared: { vi: 'Nhiệm vụ hoàn thành', en: 'Missions complete' },
  startAdventure: { vi: '🚀 Bắt Đầu Phiêu Lưu', en: '🚀 Start Adventure' },
  continueAdventure: { vi: '🚀 Tiếp Tục Phiêu Lưu', en: '🚀 Continue Adventure' },
  exploreMap:    { vi: '🗺️ Khám Phá Bản Đồ',   en: '🗺️ Explore Map' },
  eduTitle:      { vi: '🎓 Giá Trị Giáo Dục & Hướng Dẫn Phụ Huynh', en: '🎓 Educational Values & Parents Guide' },
} as const;

/* ── Levels Page ───────────────────────────────── */
export const LEVELS = {
  title:          { vi: 'Bản Đồ Thám Hiểm 🗺️', en: 'Adventure Map 🗺️' },
  subtitle:       { vi: 'Chạm vào bất kỳ màn chơi nào để giải cứu các bạn thú đáng yêu!', en: 'Tap any level to rescue adorable animal friends!' },
  completedCount: { vi: 'Đã hoàn thành',        en: 'Completed' },
  freeMode:       { vi: '🔓 Mở tất cả',         en: '🔓 Unlock all' },
  freeModeOff:    { vi: '🔒 Khóa lại',          en: '🔒 Lock' },
  allWorlds:      { vi: 'Tất Cả',               en: 'All' },
} as const;

/* ── Settings Page ─────────────────────────────── */
export const SETTINGS = {
  title:        { vi: 'Góc Phụ Huynh & Cài Đặt', en: 'Parents & Settings' },
  subtitle:     { vi: 'Không gian điều chỉnh trải nghiệm học tập an toàn cho bé', en: 'Customize safe learning experience for your child' },
  soundTitle:   { vi: 'Âm Thanh & Lời Thoại',    en: 'Sound & Voice' },
  soundOn:      { vi: 'Bật âm thanh',             en: 'Sound on' },
  soundOff:     { vi: 'Tắt âm thanh',             en: 'Sound off' },
  langTitle:    { vi: 'Ngôn Ngữ Giọng Đọc',       en: 'Voice Language' },
  ageTitle:     { vi: 'Nhóm Tuổi Của Bé',         en: "Child's Age Group" },
  skillsTitle:  { vi: 'Kỹ Năng Bé Đã Rèn Luyện', en: 'Skills Practiced' },
  skillsDesc:   { vi: 'Ghi nhận các thử thách tích cực mà bé đã tương tác:', en: 'Positive challenges your child has interacted with:' },
  securityTitle: { vi: 'Khu Vực Bảo Mật Phụ Huynh', en: 'Parent Security Zone' },
  securityDesc:  { vi: 'Mọi hành động nhạy cảm đều được bảo vệ bởi Parent Gate (câu hỏi toán người lớn) để bé không vô tình bấm nhầm.', en: 'Sensitive actions are protected by Parent Gate (adult math question) so children cannot accidentally trigger them.' },
  progressLabel: { vi: 'Tiến Độ Hiện Tại',        en: 'Current Progress' },
  resetLabel:    { vi: 'Xóa Tiến Trình Chơi',     en: 'Reset Game Progress' },
  resetDesc:     { vi: 'Khởi tạo lại trò chơi từ đầu để bé chơi lại từ đầu hành trình.', en: 'Start over from the beginning of the adventure.' },
  resetBtn:      { vi: '🔒 Mở Parent Gate để Reset', en: '🔒 Open Parent Gate to Reset' },
  resetSuccess:  { vi: '✓ Đã làm mới tiến trình thành công!', en: '✓ Progress reset successfully!' },
  completedCount: { vi: 'Đã hoàn thành', en: 'Completed' },
  completedMissions: { vi: 'nhiệm vụ', en: 'missions' },
} as const;

/* ── Animal Home Page ──────────────────────────── */
export const ANIMAL_HOME = {
  title:       { vi: 'Ngôi Nhà Động Vật',  en: 'Animal Home' },
  subtitle:    { vi: 'Khu vườn bình yên nơi các bạn thú đã được cứu cùng sum vầy sinh sống!', en: 'A peaceful garden where rescued animals live happily together!' },
  rescued:     { vi: 'Đã đón về',          en: 'Rescued' },
  animalCount: { vi: 'bạn thú',            en: 'animals' },
  atHome:      { vi: 'Đã về nhà 🏡',       en: 'Home safe 🏡' },
  notRescued:  { vi: 'Chưa cứu 🔒',        en: 'Not rescued 🔒' },
  waiting:     { vi: 'Đang chờ được cứu...', en: 'Waiting to be rescued...' },
  chatLabel:   { vi: 'trò chuyện:',         en: 'says:' },
  decoTitle:   { vi: 'Vật Phẩm Trang Trí Khu Rừng', en: 'Forest Decoration Items' },
  decorated:   { vi: 'Đã trang trí',       en: 'Placed' },
  decoLocked:  { vi: 'Khóa',               en: 'Locked' },
} as const;

/* ── Stickers Page ─────────────────────────────── */
export const STICKERS = {
  title:     { vi: 'Bộ Sưu Tập Huy Hiệu', en: 'Sticker Collection' },
  subtitle:  { vi: 'Mỗi huy hiệu kể một câu chuyện thú vị!', en: 'Each sticker tells an exciting story!' },
  collected: { vi: 'Đã sưu tầm',           en: 'Collected' },
  notYet:    { vi: 'Chưa mở khóa',         en: 'Locked' },
} as const;

/* ── Free Play Page ────────────────────────────── */
export const FREE_PLAY = {
  title:    { vi: 'Chơi Tự Do', en: 'Free Play' },
  subtitle: { vi: 'Chọn bất kỳ thử thách yêu thích để chơi lại!', en: 'Pick any favorite challenge to replay!' },
} as const;

/**
 * Helper to pick from a label pair object.
 */
export function pick(pair: { vi: string; en: string }, lang: Language): string {
  return lang === 'en' ? pair.en : pair.vi;
}
