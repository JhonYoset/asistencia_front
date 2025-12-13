import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificacionSolicitudComponent } from './justificacion-solicitud.component';

describe('JustificacionSolicitudComponent', () => {
  let component: JustificacionSolicitudComponent;
  let fixture: ComponentFixture<JustificacionSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JustificacionSolicitudComponent]
    });
    fixture = TestBed.createComponent(JustificacionSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
