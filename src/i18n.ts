import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: "Campus Food Map",
        subtitle: "University Area Dining",
      },
      search: {
        placeholder: "Search by name or cuisine…",
        listening: "Listening...",
        voiceTooltip: "Voice Search",
        aiTooltip: "AI Assistant",
        clearTooltip: "Clear search",
      },
      filter: {
        title: "Filters",
        openNow: "Open Now",
        studentDeals: "Student Deals",
        wifi: "WiFi Included",
        favorites: "Favorites",
        noise: {
          label: "Noise Level",
          All: "All",
          Quiet: "Quiet",
          Moderate: "Moderate",
          Loud: "Loud"
        },
        reset: "Reset Filters"
      },
      list: {
        found_one: "Found {{count}} restaurant",
        found_other: "Found {{count}} restaurants",
        empty: "No restaurants found.",
        tryAdjusting: "Try adjusting your filters or search query."
      },
      card: {
        reviews: "reviews",
        est: "Est.",
        min: "min",
        km: "km"
      },
      detail: {
        close: "Close",
        openNow: "Open Now",
        closed: "Closed",
        distance: "Distance",
        price: "Price",
        noise: "Noise",
        features: "Features",
        wifi: "Free WiFi",
        studentDiscount: "Student Discount",
        latestReview: "Latest Review",
        getDirections: "Get Directions",
        title: "Restaurant Details",
        comparing: "Comparing {{count}} Restaurants",
        compareBadge: "COMPARE",
        clickToAdd: "Click cards in list to add/remove",
        clearAll: "Clear all",
        noWait: "No wait",
        wait: "~{{time}} min",
        yes: "Yes",
        no: "No",
        outlets: "Outlets",
        waitLabel: "Wait"
      },
      ai: {
        title: "AI Discover",
        reject: "Reject",
        agree: "Agree",
        accepted: "Accepted",
        rejected: "Rejected",
        send: "Send",
        placeholder: "e.g. A quiet cafe with wifi...",
        listening: "Listening...",
        greeting: "What are you craving today?",
        recommendation: "I recommend {{name}}! Would you like me to select it on the map and show details?",
        followup: "No problem. What other types of food are you looking for?"
      },
      tags: {
        "Late Night Bites": "Late Night Bites",
        "Study Cafes": "Study Cafes",
        "Quick Bite": "Quick Bite",
        "Date Night": "Date Night",
        "Cheap Eats": "Cheap Eats",
        "Group Friendly": "Group Friendly"
      },
      cuisine: {
        "Chinese": "Chinese",
        "Japanese": "Japanese",
        "Korean": "Korean",
        "Western": "Western",
        "Cafe": "Cafe",
        "Fast Food": "Fast Food",
        "Bakery": "Bakery",
        "Malaysian": "Malaysian",
        "Halal": "Halal",
        "Dessert": "Dessert",
        "Italian": "Italian",
        "Mexican": "Mexican",
        "Sushi": "Sushi",
        "Middle Eastern": "Middle Eastern"
      },
      review: {
        "Perfect for late night cravings.": "Perfect for late night cravings.",
        "People here talk about the kebabs, good service...": "People here talk about the kebabs, good service...",
        "Great place for students, free wifi!": "Great place for students, free wifi!",
        "A bit crowded but the food is worth it.": "A bit crowded but the food is worth it.",
        "everything was surprising, Sandwiches are the best...": "everything was surprising, Sandwiches are the best...",
        "Affordable and delicious.": "Affordable and delicious."
      }
    }
  },
  zh: {
    translation: {
      app: {
        title: "Campus Food Map",
        subtitle: "大学城美食探索",
      },
      search: {
        placeholder: "搜索餐厅名或菜系…",
        listening: "正在聆听...",
        voiceTooltip: "语音搜索",
        aiTooltip: "AI 助手",
        clearTooltip: "清除搜索",
      },
      filter: {
        title: "筛选",
        openNow: "营业中",
        studentDeals: "学生特惠",
        wifi: "免费 WiFi",
        favorites: "收藏夹",
        noise: {
          label: "噪音情况",
          All: "全部",
          Quiet: "安静",
          Moderate: "适中",
          Loud: "嘈杂"
        },
        reset: "重置筛选"
      },
      list: {
        found_one: "找到 {{count}} 家餐厅",
        found_other: "找到 {{count}} 家餐厅",
        empty: "未找到餐厅。",
        tryAdjusting: "请尝试调整筛选条件或搜索关键词。"
      },
      card: {
        reviews: "条评价",
        est: "约",
        min: "分钟",
        km: "公里"
      },
      detail: {
        close: "关闭",
        openNow: "营业中",
        closed: "休息中",
        distance: "距离",
        price: "价格",
        noise: "噪音情况",
        features: "设施",
        wifi: "免费 WiFi",
        studentDiscount: "学生特惠",
        latestReview: "最新评价",
        getDirections: "获取导航",
        title: "餐厅详情",
        comparing: "正在对比 {{count}} 家餐厅",
        compareBadge: "对比模式",
        clickToAdd: "在列表中点击卡片可添加/移除对比",
        clearAll: "清空",
        noWait: "无需等位",
        wait: "约 {{time}} 分钟",
        yes: "提供",
        no: "无",
        outlets: "插座",
        waitLabel: "排队预估"
      },
      ai: {
        title: "AI 探索",
        reject: "拒绝",
        agree: "同意",
        accepted: "已同意",
        rejected: "已拒绝",
        send: "发送",
        placeholder: "例如：想找个安静的咖啡馆学习...",
        listening: "正在聆听...",
        greeting: "随便说说您今天想来点啥？",
        recommendation: "为您推荐：{{name}}！是否为您在地图上选中并展示详情？",
        followup: "好的，那您还想看看什么其他类型的？"
      },
      tags: {
        "Late Night Bites": "深夜食堂",
        "Study Cafes": "学习咖啡馆",
        "Quick Bite": "简餐快餐",
        "Date Night": "约会餐厅",
        "Cheap Eats": "平价美食",
        "Group Friendly": "适合聚餐"
      },
      cuisine: {
        "Chinese": "中餐",
        "Japanese": "日料",
        "Korean": "韩餐",
        "Western": "西餐",
        "Cafe": "咖啡馆",
        "Fast Food": "快餐",
        "Bakery": "烘焙",
        "Malaysian": "马来菜",
        "Halal": "清真",
        "Dessert": "甜品",
        "Italian": "意式",
        "Mexican": "墨西哥菜",
        "Sushi": "寿司",
        "Middle Eastern": "中东菜"
      },
      review: {
        "Perfect for late night cravings.": "深夜解馋的完美选择。",
        "People here talk about the kebabs, good service...": "大家都推荐这里的烤肉，服务也很好...",
        "Great place for students, free wifi!": "非常适合学生，免费WiFi！",
        "A bit crowded but the food is worth it.": "虽然有点拥挤，但食物绝对值得。",
        "everything was surprising, Sandwiches are the best...": "一切都很惊喜，三明治是最好吃的...",
        "Affordable and delicious.": "物美价廉，十分美味。"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
