import { Component } from '@angular/core';

import { FeedPage } from '../feed/feed';
import { VenuesPage } from '../venues/venues';
import { MePage } from '../me/me';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FeedPage;
  tab2Root = VenuesPage;
  tab3Root = MePage;

  constructor() {

  }
}
