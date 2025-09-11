import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Crown,
  Zap,
  User,
  Award,
  Filter,
  Search,
} from "lucide-react";
import { useStudent } from "../contexts/StudentContext";
import GlassCard from "../components/GlassCard";
import SoundPlayer from "../utils/sounds";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "avatars" | "achievements" | "powerups";
  rarity: "common" | "rare" | "epic" | "legendary";
  imageUrl: string;
  owned?: boolean;
}

const PointsShop: React.FC = () => {
  const { currentStudent, purchaseItem, getOwnedItems } = useStudent();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const ownedItems = getOwnedItems();

  const shopItems: ShopItem[] = [
    // Avatars
    {
      id: "avatar-1",
      name: "Eco Warrior",
      description: "A fierce environmental protector avatar",
      price: 150,
      category: "avatars",
      rarity: "rare",
      imageUrl:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      owned: ownedItems.includes("avatar-1"),
    },
    {
      id: "avatar-2",
      name: "Nature Guardian",
      description: "Connected to the earth and all living things",
      price: 200,
      category: "avatars",
      rarity: "epic",
      imageUrl:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      owned: ownedItems.includes("avatar-2"),
    },
    {
      id: "avatar-3",
      name: "Solar Champion",
      description: "Powered by renewable energy",
      price: 300,
      category: "avatars",
      rarity: "legendary",
      imageUrl:
        "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      owned: ownedItems.includes("avatar-3"),
    },

    // Achievements
    {
      id: "achievement-1",
      name: "Green Thumb",
      description: "Special badge for plant lovers",
      price: 100,
      category: "achievements",
      rarity: "common",
      imageUrl:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=150",
      owned: ownedItems.includes("achievement-1"),
    },
    {
      id: "achievement-2",
      name: "Climate Hero",
      description: "Exclusive title for climate action leaders",
      price: 250,
      category: "achievements",
      rarity: "epic",
      imageUrl:
        "https://images.pexels.com/photos/683535/pexels-photo-683535.jpeg?auto=compress&cs=tinysrgb&w=150",
      owned: ownedItems.includes("achievement-2"),
    },
    {
      id: "achievement-3",
      name: "Earth Savior",
      description: "The ultimate environmental achievement",
      price: 500,
      category: "achievements",
      rarity: "legendary",
      imageUrl:
        "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=150",
      owned: ownedItems.includes("achievement-3"),
    },

    // Power-ups
    {
      id: "powerup-1",
      name: "Double Points",
      description: "2x points for next 3 challenges",
      price: 75,
      category: "powerups",
      rarity: "common",
      imageUrl:
        "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=150",
      owned: ownedItems.includes("powerup-1"),
    },
    {
      id: "powerup-2",
      name: "Streak Shield",
      description: "Protects your streak for 7 days",
      price: 125,
      category: "powerups",
      rarity: "rare",
      imageUrl:
        "https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=150",
      owned: ownedItems.includes("powerup-2"),
    },
    {
      id: "powerup-3",
      name: "Instant Level Up",
      description: "Immediately advance to next level",
      price: 400,
      category: "powerups",
      rarity: "legendary",
      imageUrl:
        "https://images.pexels.com/photos/9875415/pexels-photo-9875415.jpeg?auto=compress&cs=tinysrgb&w=150",
      owned: ownedItems.includes("powerup-3"),
    },
  ];

  const categories = [
    { id: "all", name: "All Items", icon: ShoppingBag },
    { id: "avatars", name: "Avatars", icon: User },
    { id: "achievements", name: "Achievements", icon: Award },
    { id: "powerups", name: "Power-ups", icon: Zap },
  ];

  const filteredItems = shopItems.filter((item) => {
    const categoryMatch =
      selectedCategory === "all" || item.category === selectedCategory;
    const searchMatch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-400 bg-gray-400/20";
      case "rare":
        return "text-blue-400 bg-blue-400/20";
      case "epic":
        return "text-purple-400 bg-purple-400/20";
      case "legendary":
        return "text-[#F8D991] bg-[#F8D991]/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400/30";
      case "rare":
        return "border-blue-400/30";
      case "epic":
        return "border-purple-400/30";
      case "legendary":
        return "border-[#F8D991]/30";
      default:
        return "border-gray-400/30";
    }
  };

  const handlePurchase = (item: ShopItem) => {
    SoundPlayer.play("purchase");
    const success = purchaseItem(item.id, item.price);
    if (success) {
      console.log("Successfully purchased:", item.name);
    } else {
      console.log("Purchase failed:", item.name);
    }
  };

  const canAfford = (item: ShopItem) => 
    currentStudent.ecoPoints >= item.price && !item.owned;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">🛍️ Points Shop</h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Spend your hard-earned eco points on amazing rewards and power-ups!
        </p>
      </motion.div>

      {/* Points Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F8D991] to-[#F6B080] rounded-full flex items-center justify-center">
              <Star className="h-8 w-8 text-[#091D23]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#F8D991]">
                {currentStudent.ecoPoints.toLocaleString()}
              </h2>
              <p className="text-white/70">Available Points</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-white/70" />
              <div className="flex space-x-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#E1664C] ${
                        selectedCategory === category.id
                          ? "bg-[#E1664C] text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => {
          const affordable = canAfford(item);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <GlassCard
                className={`p-4 border-2 ${getRarityBorder(item.rarity)} ${
                  !affordable ? "opacity-60" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />

                  {/* Rarity Badge */}
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getRarityColor(
                      item.rarity
                    )}`}
                  >
                    {item.rarity}
                  </div>

                  {/* Category Icon */}
                  <div className="absolute top-2 left-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                    {item.category === "avatars" && (
                      <User className="h-4 w-4 text-white" />
                    )}
                    {item.category === "achievements" && (
                      <Award className="h-4 w-4 text-white" />
                    )}
                    {item.category === "powerups" && (
                      <Zap className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-[#F8D991]">
                    <Star className="h-4 w-4" />
                    <span className="font-bold">{item.price}</span>
                  </div>

                  {item.rarity === "legendary" && (
                    <Crown className="h-5 w-5 text-[#F8D991]" />
                  )}
                </div>

                <button
                  onClick={() => handlePurchase(item)}
                  disabled={!affordable || item.owned}
                  className={`w-full py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#E1664C] ${
                    item.owned
                      ? "bg-green-600 text-white cursor-not-allowed"
                    : affordable
                      ? "bg-gradient-to-r from-[#F8D991] to-[#F6B080] text-[#091D23] hover:shadow-lg hover:shadow-[#F8D991]/25"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {item.owned ? "Owned" : affordable ? "Purchase" : "Not Enough Points"}
                </button>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <GlassCard className="p-8">
            <ShoppingBag className="h-16 w-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No items found
            </h3>
            <p className="text-white/70">
              Try adjusting your search or filter criteria
            </p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default PointsShop;
