import { Component } from '@angular/core';

interface LandingTile {
  title: string;
  desc: string;
  icon: string;   // bootstrap-icons class
  meta: string;
  link: string;   // router link
  accent: string; // hex, from theme palette
  primary?: boolean;
}

@Component({
  selector: 'app-legaldash-landing',
  templateUrl: './legaldash-landing.component.html',
  styleUrls: ['./legaldash-landing.component.scss'],
})
export class LegaldashLandingComponent {
  /** Links mirror the routes defined in layouts/sidebar/menu.ts, plus the new Off-Limits route. */
  tiles: LandingTile[] = [
    { title: 'Contract Register', desc: 'Active, completed, pending and lost contracts across the firm.',
      icon: 'bi-list-check', meta: 'Contracts', link: '/pages/contract-register', accent: '#0B5ED7' },
    { title: 'Off-Limits Register', desc: 'Clients and companies with contractual restrictions on approaching candidates.',
      icon: 'bi-slash-circle', meta: 'Restrictions', link: '/pages/off-limits', accent: '#0B5ED7', primary: true },
    { title: 'Assignment Submission', desc: 'Submit and track assignments through the legal workflow.',
      icon: 'bi-upload', meta: 'Submissions', link: '/pages/consultant-submission', accent: '#2dcb73' },
    { title: 'Change Request', desc: 'Raise and track changes to register records.',
      icon: 'bi-pencil', meta: 'Requests', link: '/pages/change-request', accent: '#f1963b' },
    { title: 'Trusted User', desc: 'Manage trusted users and access groups.',
      icon: 'bi-person-check-fill', meta: 'Access', link: '/pages/trustedUser', accent: '#8561f9' },
    { title: 'Agreement Template', desc: 'Standard legal agreement templates for engagements.',
      icon: 'bi-file-earmark-richtext', meta: 'Templates', link: '/pages/agreement-template', accent: '#4ab0c1' },
  ];
}
