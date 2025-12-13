import { TestBed } from '@angular/core/testing';

import { LifecycleLoggerService } from './lifecycle-logger.service';

describe('LifecycleLoggerService', () => {
  let service: LifecycleLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LifecycleLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
