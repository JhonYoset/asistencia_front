import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import * as mockData from '../../../data/user.json'
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpClientSpy : {post : jasmine.Spy};
  let mockUser : any = (mockData as any).default
  let cookieServiceSpy : {set : jasmine.Spy};

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    cookieServiceSpy = jasmine.createSpyObj('CookieService', ['set'])
    TestBed.configureTestingModule({
      imports : [HttpClientTestingModule]
    })
    service = new AuthService(httpClientSpy as any, cookieServiceSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send credential and return a token', (done : DoneFn) => {
    //Arrange
    const user = mockUser.userOk
    const expectedResponse = {
      tokenSession : 'aaaaaaaaaaaaaacewhteh4eher'
    }

    httpClientSpy.post.and.returnValue(
      of(expectedResponse)
    )
    //Act

    service.sendCredentials(user.email, user.password)
      .subscribe(response => {
        const responseProperties = Object.keys(response)

        expect(response).toEqual(expectedResponse)
        expect(responseProperties).toContain('tokenSession')
        done()
      })
    //Assert
    
  });
});
