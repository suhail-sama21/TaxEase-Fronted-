import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metric-card.html'
})
export class MetricCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() trendText: string = '';
  @Input() trendType: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() theme: 'blue' | 'amber' | 'green' | 'red' = 'blue';

  get themeClasses() {
    const themes = {
      blue: { border: 'before:bg-app-primary', iconBg: 'bg-[#1f2937]', iconColor: 'text-app-primary' },
      amber: { border: 'before:bg-[#e3b341]', iconBg: 'bg-[#1e1a0e]', iconColor: 'text-[#e3b341]' },
      green: { border: 'before:bg-[#3fb950]', iconBg: 'bg-[#0d1f12]', iconColor: 'text-[#3fb950]' },
      red: { border: 'before:bg-[#f85149]', iconBg: 'bg-[#1e0f0f]', iconColor: 'text-[#f85149]' }
    };
    return themes[this.theme];
  }
}