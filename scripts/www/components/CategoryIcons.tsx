import React from 'react';
import { 
  Utensils, Coffee, Soup, UtensilsCrossed, Wine, Cookie, // Food
  Bus, Train, Car, Fuel, ParkingCircle, Plane, // Transport
  ShoppingBag, Shirt, Monitor, Home, Palette, ShoppingCart, // Shopping
  Zap, Droplets, Wifi, Phone, // Utilities
  Building2, Armchair, Hammer, // Housing
  Pill, Stethoscope, Activity, // Medical
  Gamepad2, Film, Ticket, Music, // Entertainment
  GraduationCap, BookOpen, PenTool, // Education
  Banknote, Briefcase, TrendingUp, Gift, MoreHorizontal, // Income & Others
  HelpCircle, CircleDollarSign, Baby, Dog, Scissors
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  // Food
  'Utensils': Utensils,
  'Coffee': Coffee,
  'Soup': Soup,
  'UtensilsCrossed': UtensilsCrossed,
  'Wine': Wine,
  'Cookie': Cookie,
  
  // Transport
  'Bus': Bus,
  'Train': Train,
  'Car': Car,
  'Fuel': Fuel,
  'ParkingCircle': ParkingCircle,
  'Plane': Plane,

  // Shopping
  'ShoppingBag': ShoppingBag,
  'Shirt': Shirt,
  'Monitor': Monitor,
  'Home': Home, // Also used for Housing main
  'Palette': Palette,
  'ShoppingCart': ShoppingCart,
  'Scissors': Scissors, // Beauty

  // Utilities
  'Zap': Zap,
  'Droplets': Droplets,
  'Wifi': Wifi,
  'Phone': Phone,

  // Housing
  'Building2': Building2,
  'Armchair': Armchair,
  'Hammer': Hammer,

  // Medical
  'Pill': Pill,
  'Stethoscope': Stethoscope,
  'Activity': Activity,

  // Entertainment
  'Gamepad2': Gamepad2,
  'Film': Film,
  'Ticket': Ticket,
  'Music': Music,

  // Education & Family
  'GraduationCap': GraduationCap,
  'BookOpen': BookOpen,
  'PenTool': PenTool,
  'Baby': Baby,
  'Dog': Dog,

  // Income
  'Banknote': Banknote,
  'Briefcase': Briefcase,
  'TrendingUp': TrendingUp,
  'Gift': Gift,
  'CircleDollarSign': CircleDollarSign,

  // Misc
  'MoreHorizontal': MoreHorizontal,
};

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className }) => {
  const IconComponent = ICON_MAP[iconName] || HelpCircle;
  return <IconComponent className={className} />;
};
