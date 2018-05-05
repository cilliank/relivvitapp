import { Component } from '@angular/core';

import { FeedPage } from '../feed/feed';
import { FeedPage } from '../feed/feed';
import { FeedPage } from '../feed/feed';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FeedPage;
  tab2Root = FeedPage;
  tab3Root = FeedPage;

  constructor() {

  }
}
