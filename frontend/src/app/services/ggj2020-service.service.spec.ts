import { TestBed } from '@angular/core/testing';

import { GGJ2020Service } from './ggj2020.service';

describe('GGJ2020Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GGJ2020Service = TestBed.get(GGJ2020Service);
    expect(service).toBeTruthy();
  });
});
