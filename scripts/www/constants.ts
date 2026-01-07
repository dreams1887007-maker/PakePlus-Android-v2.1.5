import { Transaction, Asset, CategoryItem } from './types';

// Helper to get flat list for legacy support or analytics if needed
export const CATEGORY_NAMES = {
  expense: [
    '餐饮', '交通', '购物', '生活缴费', '居住', '医疗', '娱乐', '教育', '家庭', '其他'
  ],
  income: [
    '工资', '兼职', '理财', '礼金', '其他'
  ]
};

export const EXPENSE_CATEGORIES_TREE: CategoryItem[] = [
  {
    id: 'food',
    name: '餐饮',
    icon: 'Utensils',
    color: 'bg-orange-100 text-orange-600',
    children: [
      { id: 'breakfast', name: '早餐', icon: 'Coffee' },
      { id: 'lunch', name: '午餐', icon: 'Soup' },
      { id: 'dinner', name: '晚餐', icon: 'UtensilsCrossed' },
      { id: 'drinks', name: '饮料', icon: 'Wine' },
      { id: 'snacks', name: '零食', icon: 'Cookie' },
    ]
  },
  {
    id: 'transport',
    name: '交通',
    icon: 'Car',
    color: 'bg-blue-100 text-blue-600',
    children: [
      { id: 'public', name: '公共交通', icon: 'Bus', children: [
          { id: 'subway', name: '地铁', icon: 'Train' },
          { id: 'bus', name: '公交', icon: 'Bus' },
      ]},
      { id: 'taxi', name: '打车', icon: 'Car' },
      { id: 'private', name: '私家车', icon: 'Car', children: [
          { id: 'fuel', name: '加油', icon: 'Fuel' },
          { id: 'parking', name: '停车', icon: 'ParkingCircle' },
      ]},
      { id: 'travel', name: '长途旅行', icon: 'Plane', children: [
          { id: 'flight', name: '机票', icon: 'Plane' },
          { id: 'train_ticket', name: '火车票', icon: 'Train' },
      ]},
    ]
  },
  {
    id: 'shopping',
    name: '购物',
    icon: 'ShoppingBag',
    color: 'bg-pink-100 text-pink-600',
    children: [
      { id: 'clothes', name: '服饰', icon: 'Shirt' },
      { id: 'digital', name: '数码', icon: 'Monitor' },
      { id: 'home_supplies', name: '日用', icon: 'ShoppingCart' },
      { id: 'beauty', name: '美妆', icon: 'Scissors' },
    ]
  },
  {
    id: 'utilities',
    name: '生活缴费',
    icon: 'Zap',
    color: 'bg-yellow-100 text-yellow-600',
    children: [
      { id: 'water', name: '水费', icon: 'Droplets' },
      { id: 'electric', name: '电费', icon: 'Zap' },
      { id: 'internet', name: '宽带', icon: 'Wifi' },
      { id: 'phone', name: '话费', icon: 'Phone' },
    ]
  },
  {
    id: 'housing',
    name: '居住',
    icon: 'Building2',
    color: 'bg-indigo-100 text-indigo-600',
    children: [
      { id: 'rent', name: '房租', icon: 'Building2' },
      { id: 'furniture', name: '家具', icon: 'Armchair' },
      { id: 'repair', name: '维修', icon: 'Hammer' },
    ]
  },
  {
    id: 'medical',
    name: '医疗',
    icon: 'Pill',
    color: 'bg-red-100 text-red-600',
    children: [
      { id: 'drug', name: '药品', icon: 'Pill' },
      { id: 'hospital', name: '就医', icon: 'Stethoscope' },
    ]
  },
  {
    id: 'entertainment',
    name: '娱乐',
    icon: 'Gamepad2',
    color: 'bg-purple-100 text-purple-600',
    children: [
      { id: 'game', name: '游戏', icon: 'Gamepad2' },
      { id: 'movie', name: '电影', icon: 'Film' },
      { id: 'membership', name: '会员订阅', icon: 'Ticket' },
    ]
  },
  {
    id: 'education',
    name: '教育',
    icon: 'GraduationCap',
    color: 'bg-teal-100 text-teal-600',
    children: [
      { id: 'books', name: '书籍', icon: 'BookOpen' },
      { id: 'course', name: '课程', icon: 'GraduationCap' },
    ]
  },
  {
    id: 'family',
    name: '家庭',
    icon: 'Home',
    color: 'bg-green-100 text-green-600',
    children: [
      { id: 'baby', name: '母婴', icon: 'Baby' },
      { id: 'pet', name: '宠物', icon: 'Dog' },
    ]
  },
  {
    id: 'other',
    name: '其他',
    icon: 'MoreHorizontal',
    color: 'bg-gray-100 text-gray-600',
  }
];

export const INCOME_CATEGORIES_TREE: CategoryItem[] = [
  { id: 'salary', name: '工资', icon: 'Banknote', color: 'bg-indigo-100 text-indigo-600' },
  { id: 'part_time', name: '兼职', icon: 'Briefcase', color: 'bg-blue-100 text-blue-600' },
  { id: 'investment', name: '理财', icon: 'TrendingUp', color: 'bg-red-100 text-red-600' },
  { id: 'gift', name: '礼金', icon: 'Gift', color: 'bg-pink-100 text-pink-600' },
  { id: 'other_income', name: '其他', icon: 'MoreHorizontal', color: 'bg-gray-100 text-gray-600' },
];

export const CATEGORIES = {
  expense: CATEGORY_NAMES.expense,
  income: CATEGORY_NAMES.income
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 2500.00,
    type: 'expense',
    category: '居住',
    subCategory: '房租',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    note: '房租'
  },
  {
    id: '2',
    amount: 54.20,
    type: 'expense',
    category: '餐饮',
    subCategory: '零食',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    note: '超市购物'
  },
  {
    id: '3',
    amount: 12000.00,
    type: 'income',
    category: '工资',
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    note: '月薪'
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: '1',
    name: '微信钱包',
    type: 'wechat',
    balance: 1250.50
  },
  {
    id: '2',
    name: '支付宝',
    type: 'alipay',
    balance: 5430.00
  },
  {
    id: '3',
    name: '招商银行',
    type: 'bank',
    balance: 25000.00,
    accountNumber: '8888'
  }
];
