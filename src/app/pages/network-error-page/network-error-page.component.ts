import { Component } from '@angular/core';

@Component({
  selector: 'app-network-error-page',
  imports: [],
  template: `
    <div style="padding-left:16px">
      <h2>Uh oh!</h2>
      <p>Seems your luck's run out.</p>
      <p>Try refreshing the page, or trying again later.</p>
      <img src="facepalm.png" alt="Facepalm" />
    </div>
  `,
})
export class NetworkErrorPageComponent {}
