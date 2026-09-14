import { Component, OnInit } from '@angular/core';
import { NzTableSortFn } from 'ng-zorro-antd/table';

export interface OffLimitRow {
  clientName: string;
  assignmentNumber: string;
  teams: string[];
  regions: string[];
  scopeSub: string;
  scopeText: string;
  startDate: string;    // YYYY-MM-DD
  lastUpdated: string;  // YYYY-MM-DD
  endDate: string;      // YYYY-MM-DD  (hidden by default)
  overview: string;     // hidden by default
}

@Component({
  selector: 'app-off-limits-register',
  templateUrl: './off-limits-register.component.html',
  styleUrls: ['./off-limits-register.component.scss'],
})
export class OffLimitsRegisterComponent implements OnInit {
  /** Region tabs — categories only, no cities/countries. */
  regionTabs = ['All', 'Global', 'North America', 'Europe', 'Asia', 'EMEA', 'APAC'];
  activeRegion = 'All';

  selectedTeam = 'All Teams';
  searchText = '';

  showEndDate = false;   // optional column, hidden by default
  showOverview = false;  // optional column, hidden by default
  expandedScope: string | null = null;

  teamOptions: string[] = [];

  stats = [
    { label: 'Total Contracts YTD', value: '142' },
    { label: 'Number of Restrictions', value: '38' },
    { label: 'Contracts with Restrictions', value: '27' },
    { label: '% of Contracts with Restrictions', value: '19%' },
  ];

  /**
   * Placeholder data — replace with the register API feed.
   * NOTE: teams here reuse the values already present in the app;
   * wire teamOptions/tag colours to the canonical Team list if defined elsewhere.
   */
  allData: OffLimitRow[] = [
    { clientName: 'ABC Consultants', assignmentNumber: 'SH0003560',
      teams: ['SH Leadership', 'Global Insurance'], regions: ['APAC'],
      scopeSub: 'Global Real Assets',
      scopeText: 'Real Estate Strategic Advisory — restriction applies to this sub-practice only, not the wider team.',
      startDate: '2026-08-20', lastUpdated: '2026-09-05', endDate: '2028-08-30', overview: 'This is overview comment.' },
    { clientName: 'LSEG Technology', assignmentNumber: 'SH0003068',
      teams: ['SH Consulting'], regions: ['Europe'],
      scopeSub: 'Trading & Risk Technology',
      scopeText: 'Restriction applies to all approaches within the specified business area.',
      startDate: '2026-08-14', lastUpdated: '2026-09-01', endDate: '2028-08-14', overview: 'Restriction applies to all approaches within the specified business area.' },
    { clientName: 'Meridian Capital Partners', assignmentNumber: 'SH0004120',
      teams: ['Executive Search'], regions: ['North America'],
      scopeSub: 'Private Equity',
      scopeText: 'Deal origination and portfolio operations team only; excludes fundraising and IR.',
      startDate: '2026-06-02', lastUpdated: '2026-08-22', endDate: '2028-06-02', overview: 'Portfolio operations leadership off-limits for 24 months.' },
    { clientName: 'Nordström Advisory', assignmentNumber: 'SH0004455',
      teams: ['Interim', 'Legal'], regions: ['Europe', 'EMEA'],
      scopeSub: 'Finance Transformation',
      scopeText: 'Interim CFO and finance transformation practice; permanent placements are unaffected.',
      startDate: '2026-05-18', lastUpdated: '2026-07-30', endDate: '2027-05-18', overview: 'Interim engagements only.' },
    { clientName: 'Halcyon Life Sciences', assignmentNumber: 'SH0004980',
      teams: ['Executive Search'], regions: ['North America', 'Europe'],
      scopeSub: 'Oncology Franchise',
      scopeText: 'R&D and clinical leadership across the oncology franchise; commercial roles excluded.',
      startDate: '2026-07-11', lastUpdated: '2026-09-06', endDate: '2029-07-11', overview: 'Clinical leadership restriction, oncology only.' },
    { clientName: 'Orion Global Bank', assignmentNumber: 'SH0005012',
      teams: ['SH Leadership'], regions: ['Global'],
      scopeSub: 'Group ExCo',
      scopeText: 'Group executive committee and direct reports — all regions, all functions.',
      startDate: '2026-03-09', lastUpdated: '2026-08-15', endDate: '2028-03-09', overview: 'Firm-wide executive restriction.' },
    { clientName: 'Sakura Holdings', assignmentNumber: 'SH0005190',
      teams: ['SH Consulting'], regions: ['Asia', 'APAC'],
      scopeSub: 'Consumer & Retail',
      scopeText: 'Consumer and retail advisory covering the Japan and Greater China desks.',
      startDate: '2026-04-27', lastUpdated: '2026-08-19', endDate: '2027-10-27', overview: 'Regional consumer advisory restriction.' },
    { clientName: 'Atlas Infrastructure', assignmentNumber: 'SH0005301',
      teams: ['Executive Search', 'Legal'], regions: ['EMEA'],
      scopeSub: 'Energy Transition',
      scopeText: 'Energy transition and renewables coverage team; conventional power excluded.',
      startDate: '2026-02-14', lastUpdated: '2026-07-02', endDate: '2028-02-14', overview: 'Renewables coverage only.' },
    { clientName: 'Vantage Wealth Group', assignmentNumber: 'SH0005478',
      teams: ['Interim'], regions: ['North America'],
      scopeSub: 'Wealth Operations',
      scopeText: 'Wealth management operations — client-facing advisor roles are restricted.',
      startDate: '2026-06-30', lastUpdated: '2026-09-03', endDate: '2028-06-30', overview: 'Advisor roles restricted.' },
  ];

  displayData: OffLimitRow[] = [];

  ngOnInit(): void {
    const teams = new Set<string>();
    this.allData.forEach(r => r.teams.forEach(t => teams.add(t)));
    this.teamOptions = ['All Teams', ...Array.from(teams)];
    this.applyFilters();
  }

  setRegion(region: string): void {
    this.activeRegion = region;
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.searchText.trim().toLowerCase();
    this.displayData = this.allData.filter(r => {
      const okRegion = this.activeRegion === 'All' || r.regions.includes(this.activeRegion);
      const okTeam = this.selectedTeam === 'All Teams' || r.teams.includes(this.selectedTeam);
      const okQuery = !q
        || r.clientName.toLowerCase().includes(q)
        || r.assignmentNumber.toLowerCase().includes(q)
        || r.scopeText.toLowerCase().includes(q)
        || r.scopeSub.toLowerCase().includes(q);
      return okRegion && okTeam && okQuery;
    });
  }

  reset(): void {
    this.activeRegion = 'All';
    this.selectedTeam = 'All Teams';
    this.searchText = '';
    this.expandedScope = null;
    this.applyFilters();
  }

  toggleScope(id: string): void {
    this.expandedScope = this.expandedScope === id ? null : id;
  }

  /* ---- Consistent colour coding for Team / Region tags ---- */
  private slug(v: string): string {
    return v.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  teamTagClass(team: string): string {
    return 'ol-tag-team-' + this.slug(team);
  }
  regionTagClass(region: string): string {
    return 'ol-tag-region-' + this.slug(region);
  }

  /* ---- nz-table sort functions (client-side) ---- */
  sortClientName: NzTableSortFn<OffLimitRow> = (a, b) => a.clientName.localeCompare(b.clientName);
  sortAssignment: NzTableSortFn<OffLimitRow> = (a, b) => a.assignmentNumber.localeCompare(b.assignmentNumber);
  sortStartDate: NzTableSortFn<OffLimitRow> = (a, b) => a.startDate.localeCompare(b.startDate);
  sortLastUpdated: NzTableSortFn<OffLimitRow> = (a, b) => a.lastUpdated.localeCompare(b.lastUpdated);
}
