# 🎮 Bubble Sort Visualization Game - Professional Edition

A beautiful, interactive bubble sort visualization game built with Python and Pygame, featuring professional Odoo-inspired design and smooth animations.

## ✨ Features

### 🎨 **Professional Design**
- **Odoo-inspired color palette** with gradients and modern UI
- **Smooth animations** with gradient effects on bars
- **Glass-morphism UI elements** with transparency and blur effects
- **Responsive design** that scales with different array sizes

### 🎯 **Interactive Gameplay**
- **Real-time visualization** of bubble sort algorithm
- **Step-by-step mode** for educational purposes
- **Adjustable parameters** (array size: 10-100, speed: 1-200ms)
- **Live statistics** showing passes, comparisons, swaps, and time
- **Visual feedback** with color-coded bar states

### 🎮 **Controls**
- **Mouse Controls:**
  - Click buttons to generate, sort, reset, or step
  - Drag sliders to adjust array size and sorting speed
- **Keyboard Shortcuts:**
  - `SPACE` - Start/Stop sorting
  - `R` - Reset the array
  - `G` - Generate new random array

### 🌈 **Visual Elements**
- **Color-coded bars:**
  - 🔵 Blue (Default) - Unsorted elements
  - 🟡 Yellow (Comparing) - Elements being compared
  - 🔴 Red (Swapping) - Elements being swapped
  - 🟢 Green (Sorted) - Elements in final position
- **Gradient backgrounds** and smooth transitions
- **Animated swaps** with smooth position interpolation
- **Value labels** on bars (when space allows)

## 🚀 Installation & Running

### Method 1: Using the Launcher (Recommended)
```bash
cd day-1
python run_game.py
```

### Method 2: Manual Installation
```bash
cd day-1
pip install pygame==2.5.2
python bubble_sort_game.py
```

## 📊 Algorithm Visualization

The game visualizes the **Bubble Sort** algorithm:

1. **Compare** adjacent elements (highlighted in yellow)
2. **Swap** if they're in wrong order (highlighted in red)
3. **Mark as sorted** when in final position (highlighted in green)
4. **Repeat** until entire array is sorted

### Time Complexity
- **Best Case:** O(n) - when array is already sorted
- **Average Case:** O(n²)
- **Worst Case:** O(n²) - when array is reverse sorted

### Space Complexity
- **O(1)** - only uses constant extra space

## 🎓 Educational Value

Perfect for:
- **Learning sorting algorithms** visually
- **Understanding algorithm complexity** through real-time statistics
- **Teaching programming concepts** with interactive demonstrations
- **Algorithm analysis** with step-by-step execution

## 🛠️ Technical Details

- **Framework:** Pygame 2.5.2
- **Language:** Python 3.7+
- **Resolution:** 1200x800 (responsive)
- **FPS:** 60 for smooth animations
- **Architecture:** Object-oriented design with clean separation of concerns

## 📁 File Structure

```
day-1/
├── bubble_sort_game.py    # Main game implementation
├── run_game.py           # Launcher with auto-installation
├── requirements.txt      # Python dependencies
└── README.md            # This documentation
```

## 🎯 Future Enhancements

Potential improvements for future versions:
- Multiple sorting algorithms (Quick Sort, Merge Sort, etc.)
- Sound effects and music
- Leaderboard system
- Export visualization as video
- Network multiplayer mode
- Custom array input

## 🤝 Contributing

Feel free to contribute improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📜 License

This project is part of the DevSecOps-Mega-Project educational series.

---

**Enjoy learning algorithms with beautiful visualizations! 🎮✨**
