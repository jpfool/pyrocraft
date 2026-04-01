export const COLORS = {
  gold: '#c9a84c',
  goldLight: '#e8c97a',
  goldDark: '#8a6a1e',
  black: '#08080a',
  dark: '#0e0e12',
  card: '#13131a',
  border: '#2a2820',
  text: '#f0ead6',
  muted: '#8a8070',
  red: '#cc2a2a'
};

export const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'aerial', label: 'Aerial' },
  { value: 'ground', label: 'Ground' },
  { value: 'sparkler', label: 'Sparklers' },
  { value: 'gift', label: 'Gift Sets' }
];

export const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A–Z' }
];

export const ORDER_STATUS_LABELS = {
  pending: 'Order Placed',
  confirmed: 'Order Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export const ORDER_STATUS_ICONS = {
  pending: '📦',
  confirmed: '✅',
  processing: '🔄',
  shipped: '🚚',
  delivered: '✅',
  cancelled: '❌'
};
