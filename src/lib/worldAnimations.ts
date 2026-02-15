export interface WorldElement {
  emoji: string;
  x: number; // percent
  y: number; // percent
  size: number; // rem
  appearsAtStar: number;
  animation: string; // CSS class name
}

export const worldElements: Record<string, WorldElement[]> = {
  space: [
    { emoji: "🪐", x: 8, y: 15, size: 2.5, appearsAtStar: 1, animation: "animate-drift" },
    { emoji: "🌙", x: 85, y: 10, size: 2, appearsAtStar: 1, animation: "animate-float" },
    { emoji: "⭐", x: 15, y: 70, size: 1.5, appearsAtStar: 2, animation: "animate-sparkle" },
    { emoji: "🛸", x: 80, y: 65, size: 2, appearsAtStar: 3, animation: "animate-drift" },
    { emoji: "👽", x: 90, y: 40, size: 2, appearsAtStar: 4, animation: "animate-bounce-slow" },
    { emoji: "🌟", x: 5, y: 45, size: 1.8, appearsAtStar: 5, animation: "animate-sparkle" },
    { emoji: "🛰️", x: 70, y: 85, size: 2, appearsAtStar: 6, animation: "animate-drift" },
    { emoji: "💫", x: 25, y: 90, size: 1.5, appearsAtStar: 7, animation: "animate-float" },
    { emoji: "🌠", x: 50, y: 8, size: 2, appearsAtStar: 8, animation: "animate-sparkle" },
    { emoji: "🚀", x: 40, y: 80, size: 2.5, appearsAtStar: 9, animation: "animate-drift" },
  ],
  ocean: [
    { emoji: "🐟", x: 10, y: 20, size: 2, appearsAtStar: 1, animation: "animate-swim" },
    { emoji: "🫧", x: 85, y: 15, size: 1.5, appearsAtStar: 1, animation: "animate-float" },
    { emoji: "🐠", x: 80, y: 60, size: 2, appearsAtStar: 2, animation: "animate-swim" },
    { emoji: "🐚", x: 5, y: 85, size: 1.8, appearsAtStar: 3, animation: "animate-bounce-slow" },
    { emoji: "🐙", x: 90, y: 35, size: 2.5, appearsAtStar: 4, animation: "animate-bounce-slow" },
    { emoji: "🐬", x: 15, y: 55, size: 2, appearsAtStar: 5, animation: "animate-swim" },
    { emoji: "🐳", x: 70, y: 80, size: 3, appearsAtStar: 6, animation: "animate-drift" },
    { emoji: "🦈", x: 25, y: 75, size: 2, appearsAtStar: 7, animation: "animate-swim" },
    { emoji: "🫧", x: 50, y: 10, size: 1.5, appearsAtStar: 8, animation: "animate-float" },
    { emoji: "🐡", x: 40, y: 90, size: 2, appearsAtStar: 9, animation: "animate-bounce-slow" },
  ],
  forest: [
    { emoji: "🦊", x: 8, y: 75, size: 2, appearsAtStar: 1, animation: "animate-bounce-slow" },
    { emoji: "🍄", x: 88, y: 80, size: 1.8, appearsAtStar: 1, animation: "animate-bounce-slow" },
    { emoji: "🦌", x: 85, y: 20, size: 2.5, appearsAtStar: 2, animation: "animate-drift" },
    { emoji: "🐿️", x: 10, y: 30, size: 1.8, appearsAtStar: 3, animation: "animate-bounce-slow" },
    { emoji: "🦉", x: 90, y: 45, size: 2, appearsAtStar: 4, animation: "animate-float" },
    { emoji: "🌸", x: 15, y: 60, size: 1.5, appearsAtStar: 5, animation: "animate-float" },
    { emoji: "🦋", x: 75, y: 70, size: 2, appearsAtStar: 6, animation: "animate-drift" },
    { emoji: "🐛", x: 25, y: 88, size: 1.5, appearsAtStar: 7, animation: "animate-drift" },
    { emoji: "🌻", x: 50, y: 10, size: 2, appearsAtStar: 8, animation: "animate-float" },
    { emoji: "🦎", x: 40, y: 85, size: 1.8, appearsAtStar: 9, animation: "animate-bounce-slow" },
  ],
  castle: [
    { emoji: "⚔️", x: 8, y: 20, size: 2, appearsAtStar: 1, animation: "animate-bounce-slow" },
    { emoji: "🛡️", x: 88, y: 15, size: 2, appearsAtStar: 1, animation: "animate-float" },
    { emoji: "🐉", x: 85, y: 55, size: 3, appearsAtStar: 2, animation: "animate-drift" },
    { emoji: "👑", x: 10, y: 50, size: 2, appearsAtStar: 3, animation: "animate-float" },
    { emoji: "🎺", x: 90, y: 75, size: 1.8, appearsAtStar: 4, animation: "animate-bounce-slow" },
    { emoji: "🏴", x: 5, y: 80, size: 2, appearsAtStar: 5, animation: "animate-drift" },
    { emoji: "🗡️", x: 75, y: 35, size: 2, appearsAtStar: 6, animation: "animate-bounce-slow" },
    { emoji: "🎪", x: 20, y: 85, size: 2.5, appearsAtStar: 7, animation: "animate-float" },
    { emoji: "🦅", x: 50, y: 8, size: 2, appearsAtStar: 8, animation: "animate-drift" },
    { emoji: "🏆", x: 45, y: 90, size: 2.5, appearsAtStar: 9, animation: "animate-bounce-slow" },
  ],
};
