import { TestBed } from '@angular/core/testing';

import { ThreeDimentionUtilService } from './three-dimention-util.service';

describe('ThreeDimentionUtilService', () => {
  let service: ThreeDimentionUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeDimentionUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
