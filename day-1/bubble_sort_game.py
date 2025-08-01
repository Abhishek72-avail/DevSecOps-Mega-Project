import pygame
import random
import math
import time
import sys

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 1200
WINDOW_HEIGHT = 800
FPS = 60

# Colors (Professional Odoo-inspired palette)
COLORS = {
    'primary': (113, 75, 103),      # #714B67
    'secondary': (139, 90, 140),    # #8B5A8C
    'accent': (0, 160, 157),        # #00A09D
    'success': (40, 167, 69),       # #28a745
    'warning': (255, 193, 7),       # #ffc107
    'danger': (220, 53, 69),        # #dc3545
    'light': (248, 249, 250),       # #f8f9fa
    'dark': (44, 62, 80),           # #2c3e50
    'white': (255, 255, 255),
    'black': (0, 0, 0),
    'gray': (108, 117, 125),        # #6c757d
    'light_gray': (233, 236, 239),  # #e9ecef
    'gradient_start': (102, 126, 234),  # #667eea
    'gradient_end': (118, 75, 162),     # #764ba2
}

# Bar colors for different states
BAR_COLORS = {
    'default': COLORS['accent'],
    'comparing': COLORS['warning'],
    'swapping': COLORS['danger'],
    'sorted': COLORS['success'],
    'current': COLORS['primary']
}

class BubbleSortGame:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Bubble Sort Visualization Game - Professional Edition")
        self.clock = pygame.time.Clock()
        self.font_large = pygame.font.Font(None, 48)
        self.font_medium = pygame.font.Font(None, 32)
        self.font_small = pygame.font.Font(None, 24)
        
        # Game state
        self.array = []
        self.array_size = 50
        self.sorting = False
        self.sorted_indices = set()
        self.comparing_indices = []
        self.swapping_indices = []
        self.current_pass = 0
        self.total_passes = 0
        self.comparisons = 0
        self.swaps = 0
        self.start_time = 0
        self.sort_speed = 50  # milliseconds between operations
        self.last_operation_time = 0
        
        # Animation
        self.animation_progress = 0
        self.animating_swap = False
        self.swap_positions = {}
        
        # UI elements
        self.buttons = self.create_buttons()
        self.sliders = self.create_sliders()
        
        self.generate_array()
    
    def create_buttons(self):
        button_width = 120
        button_height = 40
        button_y = WINDOW_HEIGHT - 60
        spacing = 140
        start_x = 50
        
        buttons = {
            'generate': pygame.Rect(start_x, button_y, button_width, button_height),
            'sort': pygame.Rect(start_x + spacing, button_y, button_width, button_height),
            'reset': pygame.Rect(start_x + spacing * 2, button_y, button_width, button_height),
            'step': pygame.Rect(start_x + spacing * 3, button_y, button_width, button_height),
        }
        return buttons
    
    def create_sliders(self):
        slider_width = 200
        slider_height = 20
        slider_y = WINDOW_HEIGHT - 100
        
        sliders = {
            'size': {
                'rect': pygame.Rect(WINDOW_WIDTH - 250, slider_y, slider_width, slider_height),
                'value': self.array_size,
                'min': 10,
                'max': 100,
                'dragging': False
            },
            'speed': {
                'rect': pygame.Rect(WINDOW_WIDTH - 250, slider_y - 40, slider_width, slider_height),
                'value': self.sort_speed,
                'min': 1,
                'max': 200,
                'dragging': False
            }
        }
        return sliders
    
    def generate_array(self):
        self.array = list(range(1, self.array_size + 1))
        random.shuffle(self.array)
        self.reset_sorting_state()
    
    def reset_sorting_state(self):
        self.sorting = False
        self.sorted_indices = set()
        self.comparing_indices = []
        self.swapping_indices = []
        self.current_pass = 0
        self.total_passes = 0
        self.comparisons = 0
        self.swaps = 0
        self.animation_progress = 0
        self.animating_swap = False
        self.swap_positions = {}
    
    def draw_gradient_background(self):
        for y in range(WINDOW_HEIGHT):
            ratio = y / WINDOW_HEIGHT
            r = int(COLORS['gradient_start'][0] * (1 - ratio) + COLORS['gradient_end'][0] * ratio)
            g = int(COLORS['gradient_start'][1] * (1 - ratio) + COLORS['gradient_end'][1] * ratio)
            b = int(COLORS['gradient_start'][2] * (1 - ratio) + COLORS['gradient_end'][2] * ratio)
            pygame.draw.line(self.screen, (r, g, b), (0, y), (WINDOW_WIDTH, y))
    
    def draw_bars(self):
        if not self.array:
            return
        
        bar_area_width = WINDOW_WIDTH - 100
        bar_area_height = WINDOW_HEIGHT - 200
        bar_width = bar_area_width / len(self.array)
        max_height = max(self.array)
        
        for i, value in enumerate(self.array):
            # Calculate bar dimensions
            bar_height = (value / max_height) * bar_area_height
            x = 50 + i * bar_width
            y = WINDOW_HEIGHT - 150 - bar_height
            
            # Handle swap animation
            if self.animating_swap and i in self.swap_positions:
                target_x = self.swap_positions[i]
                current_x = x + (target_x - x) * self.animation_progress
                x = current_x
            
            # Determine bar color
            color = BAR_COLORS['default']
            if i in self.sorted_indices:
                color = BAR_COLORS['sorted']
            elif i in self.swapping_indices:
                color = BAR_COLORS['swapping']
            elif i in self.comparing_indices:
                color = BAR_COLORS['comparing']
            
            # Draw bar with gradient effect
            bar_rect = pygame.Rect(x + 1, y, bar_width - 2, bar_height)
            
            # Create gradient effect
            for j in range(int(bar_height)):
                gradient_ratio = j / bar_height if bar_height > 0 else 0
                gradient_color = (
                    int(color[0] * (1 - gradient_ratio * 0.3)),
                    int(color[1] * (1 - gradient_ratio * 0.3)),
                    int(color[2] * (1 - gradient_ratio * 0.3))
                )
                pygame.draw.line(self.screen, gradient_color, 
                               (x + 1, y + j), (x + bar_width - 1, y + j))
            
            # Draw bar outline
            pygame.draw.rect(self.screen, COLORS['dark'], bar_rect, 2)
            
            # Draw value on top of bar if space allows
            if bar_width > 20:
                text = self.font_small.render(str(value), True, COLORS['white'])
                text_rect = text.get_rect(centerx=x + bar_width/2, bottom=y - 5)
                self.screen.blit(text, text_rect)
    
    def draw_ui(self):
        # Draw semi-transparent overlay for UI
        overlay = pygame.Surface((WINDOW_WIDTH, 150))
        overlay.set_alpha(200)
        overlay.fill(COLORS['dark'])
        self.screen.blit(overlay, (0, WINDOW_HEIGHT - 150))
        
        # Draw title
        title = self.font_large.render("Bubble Sort Visualization Game", True, COLORS['white'])
        title_rect = title.get_rect(centerx=WINDOW_WIDTH//2, y=20)
        self.screen.blit(title, title_rect)
        
        # Draw statistics
        stats_y = 70
        stats = [
            f"Array Size: {len(self.array)}",
            f"Pass: {self.current_pass}/{self.total_passes}",
            f"Comparisons: {self.comparisons}",
            f"Swaps: {self.swaps}",
        ]
        
        if self.start_time > 0:
            elapsed = time.time() - self.start_time
            stats.append(f"Time: {elapsed:.2f}s")
        
        for i, stat in enumerate(stats):
            text = self.font_medium.render(stat, True, COLORS['white'])
            self.screen.blit(text, (50 + i * 200, stats_y))
        
        # Draw buttons
        button_texts = {
            'generate': 'Generate',
            'sort': 'Start Sort' if not self.sorting else 'Stop',
            'reset': 'Reset',
            'step': 'Step'
        }
        
        for button_name, rect in self.buttons.items():
            # Button background
            color = COLORS['primary'] if button_name != 'sort' or not self.sorting else COLORS['danger']
            pygame.draw.rect(self.screen, color, rect)
            pygame.draw.rect(self.screen, COLORS['white'], rect, 2)
            
            # Button text
            text = self.font_medium.render(button_texts[button_name], True, COLORS['white'])
            text_rect = text.get_rect(center=rect.center)
            self.screen.blit(text, text_rect)
        
        # Draw sliders
        slider_labels = {'size': 'Array Size', 'speed': 'Speed (ms)'}
        for slider_name, slider in self.sliders.items():
            # Slider label
            label = self.font_small.render(f"{slider_labels[slider_name]}: {slider['value']}", 
                                         True, COLORS['white'])
            self.screen.blit(label, (slider['rect'].x, slider['rect'].y - 25))
            
            # Slider track
            pygame.draw.rect(self.screen, COLORS['gray'], slider['rect'])
            
            # Slider handle
            handle_pos = slider['rect'].x + (slider['value'] - slider['min']) / (slider['max'] - slider['min']) * slider['rect'].width
            handle_rect = pygame.Rect(handle_pos - 5, slider['rect'].y - 5, 10, slider['rect'].height + 10)
            pygame.draw.rect(self.screen, COLORS['accent'], handle_rect)
    
    def handle_slider(self, mouse_pos, slider_name):
        slider = self.sliders[slider_name]
        if slider['rect'].collidepoint(mouse_pos):
            relative_x = mouse_pos[0] - slider['rect'].x
            ratio = relative_x / slider['rect'].width
            ratio = max(0, min(1, ratio))
            slider['value'] = int(slider['min'] + ratio * (slider['max'] - slider['min']))
            
            if slider_name == 'size':
                self.array_size = slider['value']
                if not self.sorting:
                    self.generate_array()
            elif slider_name == 'speed':
                self.sort_speed = slider['value']
    
    def bubble_sort_step(self):
        if not self.sorting or len(self.array) <= 1:
            return False
        
        n = len(self.array)
        
        # Initialize sorting if just started
        if self.current_pass == 0 and not hasattr(self, 'i'):
            self.i = 0
            self.total_passes = n - 1
        
        # Check if current pass is complete
        if self.i >= n - 1 - self.current_pass:
            # Mark the last element of this pass as sorted
            self.sorted_indices.add(n - 1 - self.current_pass)
            self.current_pass += 1
            self.i = 0
            self.comparing_indices = []
            self.swapping_indices = []
            
            # Check if sorting is complete
            if self.current_pass >= n - 1:
                self.sorted_indices.add(0)  # Mark first element as sorted too
                self.sorting = False
                return False
        
        # Perform comparison
        if self.i < n - 1 - self.current_pass:
            self.comparing_indices = [self.i, self.i + 1]
            self.comparisons += 1
            
            # Check if swap is needed
            if self.array[self.i] > self.array[self.i + 1]:
                # Perform swap with animation
                self.swapping_indices = [self.i, self.i + 1]
                self.array[self.i], self.array[self.i + 1] = self.array[self.i + 1], self.array[self.i]
                self.swaps += 1
                
                # Setup swap animation
                self.animating_swap = True
                self.animation_progress = 0
                bar_width = (WINDOW_WIDTH - 100) / len(self.array)
                self.swap_positions = {
                    self.i: bar_width,
                    self.i + 1: -bar_width
                }
            
            self.i += 1
        
        return True
    
    def update_animation(self):
        if self.animating_swap:
            self.animation_progress += 0.2
            if self.animation_progress >= 1:
                self.animation_progress = 0
                self.animating_swap = False
                self.swap_positions = {}
                self.swapping_indices = []
    
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            
            elif event.type == pygame.MOUSEBUTTONDOWN:
                mouse_pos = pygame.mouse.get_pos()
                
                # Check button clicks
                if self.buttons['generate'].collidepoint(mouse_pos) and not self.sorting:
                    self.generate_array()
                elif self.buttons['sort'].collidepoint(mouse_pos):
                    if not self.sorting:
                        self.sorting = True
                        self.start_time = time.time()
                        self.current_pass = 0
                        self.i = 0
                    else:
                        self.sorting = False
                elif self.buttons['reset'].collidepoint(mouse_pos):
                    self.reset_sorting_state()
                elif self.buttons['step'].collidepoint(mouse_pos) and not self.sorting:
                    self.sorting = True
                    self.start_time = time.time()
                    self.bubble_sort_step()
                    self.sorting = False
                
                # Check slider interactions
                for slider_name in self.sliders:
                    if self.sliders[slider_name]['rect'].collidepoint(mouse_pos):
                        self.sliders[slider_name]['dragging'] = True
                        self.handle_slider(mouse_pos, slider_name)
            
            elif event.type == pygame.MOUSEBUTTONUP:
                for slider_name in self.sliders:
                    self.sliders[slider_name]['dragging'] = False
            
            elif event.type == pygame.MOUSEMOTION:
                mouse_pos = pygame.mouse.get_pos()
                for slider_name in self.sliders:
                    if self.sliders[slider_name]['dragging']:
                        self.handle_slider(mouse_pos, slider_name)
            
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    if not self.sorting:
                        self.sorting = True
                        self.start_time = time.time()
                        self.current_pass = 0
                        self.i = 0
                    else:
                        self.sorting = False
                elif event.key == pygame.K_r:
                    self.reset_sorting_state()
                elif event.key == pygame.K_g:
                    if not self.sorting:
                        self.generate_array()
        
        return True
    
    def run(self):
        running = True
        
        while running:
            current_time = pygame.time.get_ticks()
            
            # Handle events
            running = self.handle_events()
            
            # Update sorting
            if self.sorting and current_time - self.last_operation_time > self.sort_speed:
                if not self.bubble_sort_step():
                    self.sorting = False
                self.last_operation_time = current_time
            
            # Update animations
            self.update_animation()
            
            # Draw everything
            self.draw_gradient_background()
            self.draw_bars()
            self.draw_ui()
            
            pygame.display.flip()
            self.clock.tick(FPS)
        
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = BubbleSortGame()
    game.run()
