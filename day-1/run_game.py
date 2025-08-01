#!/usr/bin/env python3
"""
Bubble Sort Visualization Game Launcher
Professional Edition with Enhanced Graphics and Animations
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    try:
        import pygame
        print("✅ Pygame is already installed!")
        return True
    except ImportError:
        print("📦 Installing pygame...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pygame==2.5.2"])
            print("✅ Pygame installed successfully!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install pygame. Please install it manually:")
            print("   pip install pygame")
            return False

def main():
    print("🎮 Bubble Sort Visualization Game - Professional Edition")
    print("=" * 60)
    
    # Check and install requirements
    if not install_requirements():
        return
    
    # Import and run the game
    try:
        from bubble_sort_game import BubbleSortGame
        print("🚀 Starting the game...")
        print("\n📋 Game Controls:")
        print("   • Click 'Generate' to create a new random array")
        print("   • Click 'Start Sort' to begin bubble sort animation")
        print("   • Click 'Step' to perform one sorting step")
        print("   • Click 'Reset' to stop and reset")
        print("   • Use sliders to adjust array size and speed")
        print("   • Press SPACE to start/stop sorting")
        print("   • Press 'R' to reset")
        print("   • Press 'G' to generate new array")
        print("\n🎯 Features:")
        print("   • Real-time visualization with smooth animations")
        print("   • Professional Odoo-inspired design")
        print("   • Interactive controls and statistics")
        print("   • Gradient effects and smooth transitions")
        print("   • Customizable array size (10-100 elements)")
        print("   • Adjustable sorting speed")
        
        game = BubbleSortGame()
        game.run()
        
    except ImportError as e:
        print(f"❌ Error importing game: {e}")
        print("Make sure all files are in the same directory.")
    except Exception as e:
        print(f"❌ Error running game: {e}")

if __name__ == "__main__":
    main()
