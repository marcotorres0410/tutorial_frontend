import { TestBed } from '@angular/core/testing';

import { Client } from './client.service';

describe('Client', () => {
  let service: Client;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Client);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
