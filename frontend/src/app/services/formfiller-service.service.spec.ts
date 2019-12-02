import { TestBed } from '@angular/core/testing';

import { FormfillerService } from './formfiller.service';

describe('FormfillerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormfillerService = TestBed.get(FormfillerService);
    expect(service).toBeTruthy();
  });
});
