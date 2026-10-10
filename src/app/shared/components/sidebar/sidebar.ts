import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';
interface MenuItem {
  label: string;
  route: string;
  lightIcon: string;
  darkIcon: string;
  badge?: string;
  showStatusDot?: boolean;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}


@Component({
  imports: [CommonModule, RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.scss',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  activeNav = 'Dashboard';

  setActive(navItem: string): void {
    this.activeNav = navItem;
  }

  menuSections: MenuSection[] = [

    // Dashboard
    {
      items: [
        {
          label: 'Dashboard',
          route: '/marketing-dashboard',
          lightIcon: 'assets/icons/Icon.svg',
          darkIcon: 'assets/icons/Container (10).svg'
        }
      ]
    },

    // Leads
    {
      title: 'LEADS',
      items: [
        {
          label: 'Create Lead',
          route: '/create-lead',
          lightIcon: 'assets/icons/Container (1).svg',
          darkIcon: 'assets/icons/Container (11).svg'
        },
        {
          label: 'Assign Lead',
          route: '/assign-lead',
          lightIcon: 'assets/icons/Container (2).svg',
          darkIcon: 'assets/icons/Container (12).svg'
        },
        {
          label: 'My Leads',
          route: '/leads',
          lightIcon: 'assets/icons/Container (3).svg',
          darkIcon: 'assets/icons/Container (13).svg',
          badge: '14 Today'
        }
      ]
    },

    // Enquiries
    {
      title: 'ENQUIRIES',
      items: [
        {
          label: 'Enquiry & Quotation',
          route: '/enquiry-quotation',
          lightIcon: 'assets/icons/Container (4).svg',
          darkIcon: 'assets/icons/Container (14).svg'
        }
      ]
    },

    // Vehicle Operations
    {
      title: 'VEHICLE OPERATIONS',
      items: [
        {
          label: 'Vehicle Assignment',
          route: '/vehicle-assignment',
          lightIcon: 'assets/icons/Container (5).svg',
          darkIcon: 'assets/icons/Container (15).svg'
        },
        {
          label: 'Vehicle Verification',
          route: '/vehicle-verification',
          lightIcon: 'assets/icons/Container (6).svg',
          darkIcon: 'assets/icons/Container (16).svg',
          showStatusDot: true
        }
      ]
    },

    // Transport Execution
    {
      title: 'TRANSPORT EXECUTION',
      items: [
        {
          label: 'LR Generation',
          route: '/lr-generation',
          lightIcon: 'assets/icons/Container (7).svg',
          darkIcon: 'assets/icons/Container (17).svg'
        },
        {
          label: 'Dispatch',
          route: '/dispatch',
          lightIcon: 'assets/icons/Container (8).svg',
          darkIcon: 'assets/icons/Container (18).svg'
        },
        {
          label: 'Delivery Entry',
          route: '/delivery-entry',
          lightIcon: 'assets/icons/Icon (2).svg',
          darkIcon: 'assets/icons/Icon (7).svg'
        },
        {
          label: 'POD Updation',
          route: '/pod-updation',
          lightIcon: 'assets/icons/Icon (3).svg',
          darkIcon: 'assets/icons/Vector.svg'
        }
      ]
    },

    // ✅ NEW: Master
    {
      title: 'MASTER',
      items: [
        {
          label: 'Origin Branch',
          route: '/masters/origin-branch',
          lightIcon: 'assets/icons/origin-branch-light.svg',
          darkIcon: 'assets/icons/origin-branch-dark.svg'
        },
        {
          label: 'Client Master',
          route: '/masters/client-master',
          lightIcon: 'assets/icons/client-master-light.svg',
          darkIcon: 'assets/icons/client-master-dark.svg'
        },
        {
          label: 'Broker Master',
          route: '/masters/broker-master',
          lightIcon: 'assets/icons/broker-master-light.svg',
          darkIcon: 'assets/icons/broker-master-dark.svg'
        },
        {
          label: 'Driver Master',
          route: '/masters/driver-master',
          lightIcon: 'assets/icons/driver-master-light.svg',
          darkIcon: 'assets/icons/driver-master-dark.svg'
        }
      ]
    },

    // Administration
    {
      title: 'ADMINISTRATION',
      items: [
        {
          label: 'Users & Roles',
          route: '/users-roles',
          lightIcon: 'assets/icons/Icon (4).svg',
          darkIcon: 'assets/icons/Icon (8).svg'
        },
        {
          label: 'Settings',
          route: '/settings',
          lightIcon: 'assets/icons/Icon (5).svg',
          darkIcon: 'assets/icons/Container (19).svg'
        }
      ]
    }
  ];
  onClose(): void {
    this.closeSidebar.emit();
  }
}
