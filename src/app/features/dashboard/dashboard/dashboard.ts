import { Component, signal } from '@angular/core';
import { PageHeading } from '../../../shared/components/page-heading/page-heading';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { Table, ColumnDef } from '../../../shared/components/table/table';


interface KpiMetric {
  label: string;
  value: number;
  trendPercent: number;
  isPositive: boolean;
  bgClass: string;
  iconClass?: string;   // optional: used when the card shows an icon font
  iconSrc?: string;     // optional: used when the card shows an image
}

interface EmployeePerformance {
  name: string;
  assignedConverted: number;
  rate: number;
}

interface LeadStatus {
  type: string;
  count: number;
  color: string;
}

interface TodaysPerformance {
  name: string;
  newLeads: number;
  calls: number;
  followUp: number;
}

interface Segment {
  label: string;
  value: number;
  color: string;
  percent?: number;
}

interface LeadSource {
  label: string;
  value: number;
  color: string;
}

interface PieSlice extends LeadSource {
  percent: number;
  path: string;     // SVG path for the wedge
  labelX: number;   // percentage label position
  labelY: number;
  tx: number;       // hover offset (moves the slice outward)
  ty: number;
}
@Component({
  imports: [PageHeading, DatePipe, CommonModule, Table],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})

export class Dashboard {
  today: Date = new Date();

  readonly gap = 1.2; // white gap between segments (in % of circumference)

  data: Segment[] = [
    { label: 'Converted', value: 66, color: '#22c55e' },
    { label: 'Follow Up', value: 15, color: '#3b82f6' },
    { label: 'Negotiation Needed', value: 10, color: '#a30fd1' },
    { label: 'Rejected', value: 9, color: '#f43f5e' }
  ];

  leadSources: LeadSource[] = [
    { label: 'Google', value: 40, color: '#3b82f6' },
    { label: 'Website', value: 25, color: '#f97316' },
    { label: 'LinkedIn', value: 20, color: '#22c55e' },
    { label: 'Others', value: 15, color: '#a30fd1' }
  ];
  hovered: Segment | null = null;
  hoveredSlice: PieSlice | null = null;

  get pieSlices(): PieSlice[] {
    const cx = 50, cy = 50, r = 46;
    const labelR = r * 0.62;   // how far from the center the % label sits
    const pop = 2.5;           // how far a slice moves out on hover
    const total = this.leadSources.reduce((sum, s) => sum + s.value, 0);

    let start = -Math.PI / 2;  // start at 12 o'clock

    return this.leadSources.map(s => {
      const fraction = s.value / total;
      const angle = fraction * 2 * Math.PI;
      const end = start + angle;
      const mid = start + angle / 2;

      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const largeArc = angle > Math.PI ? 1 : 0;

      // A single 100% slice can't be drawn as one arc, so draw a full circle instead
      const path = fraction >= 0.9999
        ? `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const slice: PieSlice = {
        ...s,
        percent: Math.round(fraction * 100),
        path,
        labelX: cx + labelR * Math.cos(mid),
        labelY: cy + labelR * Math.sin(mid),
        tx: pop * Math.cos(mid),
        ty: pop * Math.sin(mid)
      };

      start = end;
      return slice;
    });
  }
  get total(): number {
    return this.data.reduce((sum, s) => sum + s.value, 0);
  }
  employeeRows: any[] = [];

  get successRate(): number {
    return Math.round((this.data[0].value / this.total) * 100);
  }

  /** Pre-computed dash values for each segment */
  get segments() {
    let start = 0;
    return this.data.map(s => {
      const percent = (s.value / this.total) * 100;
      const dash = Math.max(percent - this.gap, 0);
      const seg = {
        ...s,
        percent: Math.round(percent),
        dasharray: `${percent} ${100 - percent}`,
        dashoffset: -(start + this.gap / 2)
      };
      start += percent;
      return seg;
    });
  }

  leadStatusColumns: ColumnDef[] = [
    { key: 'type', label: 'Type', width: 220, type: 'dot', colorKey: 'color' },
    { key: 'count', label: 'Count', width: 80, align: 'right', cellClass: 'cell-strong' },
  ];


  kpiMetrics: KpiMetric[] = [
    { label: 'Assigned', value: 48, trendPercent: 12, isPositive: true, bgClass: 'bg-blue-light', iconSrc: 'assets/icons/clarity_assign-user-line.svg' },
    { label: 'Converted', value: 32, trendPercent: 18, isPositive: true, bgClass: 'bg-green-light', iconSrc: 'assets/icons/material-symbols-light_assignment-turned-in-outline.svg' },
    { label: 'Follow Up', value: 64, trendPercent: 10, isPositive: true, bgClass: 'bg-orange-light', iconSrc: 'assets/icons/ant-design_field-time-outlined.svg' },
    { label: 'Rejected', value: 8, trendPercent: 4, isPositive: false, bgClass: 'bg-pink-light', iconSrc: 'assets/icons/icon-park_folder-failed-one.svg' },
    { label: 'Negotiation', value: 15, trendPercent: 7, isPositive: true, bgClass: 'bg-purple-light', iconSrc: 'assets/icons/iconmind_content-negotiation-outline-thin.svg' }
  ];
  columns = signal<ColumnDef[]>([
    { key: 'name', label: 'Employee', align: 'left', width: 220, cellClass: 'cell-strong' },
    { key: 'newLeads', label: 'New Leads', align: 'center', width: 120 },
    { key: 'calls', label: 'Calls', align: 'center', width: 120 },
    { key: 'followUp', label: 'Follow Up', align: 'center', width: 120 },
  ]);
  employeePerformance: EmployeePerformance[] = [
    { name: 'Suresh Kumar', assignedConverted: 24, rate: 75 },
    { name: 'Suresh Kumar', assignedConverted: 24, rate: 67 },
    { name: 'Suresh Kumar', assignedConverted: 24, rate: 63 },
    { name: 'Suresh Kumar', assignedConverted: 24, rate: 60 },
    { name: 'Suresh Kumar', assignedConverted: 24, rate: 58 }
  ];

  leadStatuses: LeadStatus[] = [
    { type: 'Follow-up Due Today', count: 42, color: '#f43f5e' },
    { type: 'Overdue Follow-up', count: 28, color: '#f97316' },
    { type: 'Follow-up Completed', count: 76, color: '#10b981' },
    { type: 'Follow-up Missed', count: 12, color: '#a855f7' },
    { type: 'Lead Without Next Follow-up', count: 9, color: '#9ca3af' }
  ];

  todaysPerformance: TodaysPerformance[] = [
    { name: 'Suresh Kumar', newLeads: 20, calls: 14, followUp: 12 },
    { name: 'Suresh Kumar', newLeads: 20, calls: 14, followUp: 12 },
    { name: 'Suresh Kumar', newLeads: 20, calls: 14, followUp: 12 },
    { name: 'Suresh Kumar', newLeads: 20, calls: 14, followUp: 12 },
    { name: 'Suresh Kumar', newLeads: 20, calls: 14, followUp: 12 }
  ];


  followUpColumns: ColumnDef[] = [
    { key: 'customer', label: 'Customer', width: 160, cellClass: 'cell-strong' },
    { key: 'contact', label: 'Contact Person', width: 130, align: 'center' },
    { key: 'type', label: 'Follow Up Type', width: 130, align: 'center' },
    { key: 'date', label: 'Date', width: 120, align: 'center', cellClass: 'cell-small' }
  ];

  todaysFollowUps = [
    { customer: 'Suresh Kumar', contact: 'Karthick', type: 'Quotation', date: this.fmt(new Date(2026, 8, 29)) },
    { customer: 'Meena Textiles', contact: 'Karthick', type: 'Call', date: this.fmt(new Date(2026, 8, 29)) },
    { customer: 'Karthik Traders', contact: 'Karthick', type: 'Call', date: this.fmt(new Date(2026, 8, 29)) },
    { customer: 'Anitha R', contact: 'Karthick', type: 'Quotation', date: this.fmt(new Date(2026, 8, 29)) },
    { customer: 'Balaji Logistics', contact: 'Karthick', type: 'Call', date: this.fmt(new Date(2026, 8, 29)) }
  ];

  // Today's Task
  taskColumns: ColumnDef[] = [
    { key: 'type', label: 'Task Type', width: 120, align: 'center' },
    { key: 'customer', label: 'Customer', width: 160, cellClass: 'cell-strong' },
    { key: 'assignTo', label: 'Assign To', width: 120, align: 'center' },
    { key: 'dueDate', label: 'Due Date', width: 120, align: 'center', cellClass: 'cell-small' }
  ];

  todaysTasks = [
    { type: 'Call', customer: 'Suresh Kumar', assignTo: 'Ramya', dueDate: this.fmt(new Date(2026, 8, 29)) },
    { type: 'Follow Up', customer: 'Meena Textiles', assignTo: 'Ramya', dueDate: this.fmt(new Date(2026, 8, 29)) },
    { type: 'Quotation', customer: 'Karthik Traders', assignTo: 'Ramya', dueDate: this.fmt(new Date(2026, 8, 29)) },
    { type: 'Meeting', customer: 'Anitha R', assignTo: 'Ramya', dueDate: this.fmt(new Date(2026, 8, 29)) },
    { type: 'Call', customer: 'Balaji Logistics', assignTo: 'Ramya', dueDate: this.fmt(new Date(2026, 8, 29)) }
  ];
  employeeColumns: ColumnDef[] = [
    { key: 'name', label: 'Employee', cellClass: 'cell-strong' },
    { key: 'assignedConverted', label: 'Assigned', align: 'center' },
    { key: 'rateLabel', label: 'Converted', align: 'center' },
    { key: 'rate', label: 'Conversion Rate', type: 'progress', opacityKey: 'opacity', width: 220 },
  ];


  // Sorting, column resizing and column swapping are enabled only on this table.
  // It is a signal because the table emits (columnsChanged) when a column is resized or moved.
  // Date columns are left unsortable because they hold formatted text ("29 Sep 2026"),
  // which would sort alphabetically, not by date.
  detailedFollowUpColumns = signal<ColumnDef[]>([
    { key: 'customer', label: 'Customer', width: 150, cellClass: 'cell-strong', sortable: true },
    { key: 'contact', label: 'Contact Person', width: 130, align: 'center', sortable: true },
    { key: 'phone', label: 'Phone', width: 140, align: 'center', sortable: true },
    { key: 'nextFollowUp', label: 'Next Follow-up', width: 130, align: 'center', cellClass: 'cell-small' },
    { key: 'lastFollowUp', label: 'Last Follow-up', width: 130, align: 'center', cellClass: 'cell-small' },
    {
      key: 'status', label: 'Status', width: 120, align: 'center', type: 'badge', sortable: true,
      // status text -> pill colour class (defined in table.scss)
      badgeTypeMap: {
        'Due Today': 'badge-pill-rose',
        'Overdue': 'badge-pill-orange',
        'Completed': 'badge-pill-green',
        'Scheduled': 'badge-pill-blue',
        'Missed': 'badge-pill-rose'
      }
    },
    { key: 'assignedTo', label: 'Assigned To', width: 110, align: 'center', cellClass: 'cell-small', sortable: true },
    { key: 'remarks', label: 'Remarks', width: 150, align: 'center', cellClass: 'cell-small', sortable: true }
  ]);

  detailedFollowUps = [
    {
      customer: 'Suresh Kumar', contact: 'Karthick', phone: '+91 9876543210',
      nextFollowUp: this.fmt(new Date(2026, 8, 29)), lastFollowUp: this.fmt(new Date(2026, 8, 25)),
      status: 'Due Today', assignedTo: 'Ramesh', remarks: 'Call for quotation'
    },
    {
      customer: 'Meena Textiles', contact: 'Karthick', phone: '+91 9876543210',
      nextFollowUp: this.fmt(new Date(2026, 8, 29)), lastFollowUp: this.fmt(new Date(2026, 8, 25)),
      status: 'Overdue', assignedTo: 'Ramesh', remarks: 'Pending response'
    },
    {
      customer: 'Karthik Traders', contact: 'Karthick', phone: '+91 9876543210',
      nextFollowUp: this.fmt(new Date(2026, 8, 29)), lastFollowUp: this.fmt(new Date(2026, 8, 25)),
      status: 'Completed', assignedTo: 'Ramesh', remarks: 'Share proposal'
    },
    {
      customer: 'Anitha R', contact: 'Karthick', phone: '+91 9876543210',
      nextFollowUp: this.fmt(new Date(2026, 8, 29)), lastFollowUp: this.fmt(new Date(2026, 8, 25)),
      status: 'Scheduled', assignedTo: 'Ramesh', remarks: 'Quotation sent'
    },
    {
      customer: 'Balaji Logistics', contact: 'Karthick', phone: '+91 9876543210',
      nextFollowUp: this.fmt(new Date(2026, 8, 29)), lastFollowUp: this.fmt(new Date(2026, 8, 25)),
      status: 'Missed', assignedTo: 'Ramesh', remarks: 'Reschedule'
    }
  ];


  // The reusable table shows plain values, so dates are formatted up front: "29 Sep 2026"
  private fmt(date: Date): string {
    return formatDate(date, 'dd MMM yyyy', 'en-US');
  }

  ngOnInit(): void {
    this.employeeRows = this.rankedEmployees.map(e => ({
      ...e,
      rateLabel: `${e.rate}%`
    }));
  }

  get rankedEmployees() {
    const sorted = [...this.employeePerformance].sort((a, b) => b.rate - a.rate);
    const max = sorted[0]?.rate ?? 0;
    const min = sorted[sorted.length - 1]?.rate ?? 0;
    const range = max - min || 1;   // avoids dividing by zero when all rates are equal

    return sorted.map(emp => ({
      ...emp,
      // top performer = 1.0, lowest = 0.25
      opacity: 0.25 + 0.75 * ((emp.rate - min) / range)
    }));
  }
}
