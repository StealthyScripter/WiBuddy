import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { BaseHttpService, BaseMockService } from './base_service';

import { MarketInsight, Priority } from '../models.interface';

// --------------------------------------------------
// REAL HTTP SERVICE
// --------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class TrendsService extends BaseHttpService<MarketInsight> {
  constructor(http: HttpClient) {
    super(`${environment.apiUrl}/trends`, http);
  }
}

// --------------------------------------------------
// MOCK SERVICE
// --------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class MockTrendsService extends BaseMockService<MarketInsight> {
  constructor() {
    super([
      {
        id: '1',
        name: 'AI Engineering',
        trend: 'rising',
        demand: Priority.HIGH,
        marketLevel: 92,
        jobListingCount: 1243,
        dateCreated: new Date().toISOString(),
        lastUpdated: 'July 2'
      }
    ]);
  }
}

// --------------------------------------------------
// FACTORY SERVICE
// --------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class TrendsServiceFactory {
  static getService(http: HttpClient) {
    if (environment.production) {
      return new TrendsService(http);
    }
    return new MockTrendsService();
  }
}
