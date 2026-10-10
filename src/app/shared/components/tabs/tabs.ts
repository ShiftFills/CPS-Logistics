import { Component, input, output } from '@angular/core';

export interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  imports: [],
  selector: 'app-tabs',
  styleUrl: './tabs.scss',
  templateUrl: './tabs.html',
})
export class Tabs {
  tabs = input<TabItem[]>([]);

  activeTab = input<string>('');

  tabChange = output<string>();

  onTabClick(tab: TabItem): void {

    if (tab.disabled) {
      return;
    }

    this.tabChange.emit(tab.value);
  }
}
